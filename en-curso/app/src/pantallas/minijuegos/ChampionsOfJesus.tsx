import { useEffect, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, estrellitas, golCelebracion, patadaBalon, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Boton } from '../../componentes/Boton'
import { Marco } from '../../componentes/Marco'

type ModoFutbol = 'menu' | 'penal' | 'pases' | 'atajadas'
type SubModo = 'penal' | 'pases' | 'atajadas'

type Jugador = {
  id: string
  nombre: string
  orden: string
  audio: string
  img: string
  emoji: string
  valor: string
}

const JUGADORES: Jugador[] = [
  {
    id: 'messi',
    nombre: 'Messi',
    orden: 'Pass to Messi!',
    audio: 'Messi! Thank you, God!',
    img: 'c-messi',
    emoji: '🔟',
    valor: 'Gratitude: Thank God for your talents!',
  },
  {
    id: 'mbappe',
    nombre: 'Mbappé',
    orden: 'Pass to Mbappé!',
    audio: 'Mbappé! Run fast!',
    img: 'c-mbappe',
    emoji: '⚡',
    valor: 'Joy: Play with all your heart!',
  },
  {
    id: 'yamal',
    nombre: 'Lamine',
    orden: 'Pass to Lamine!',
    audio: 'Lamine! Great team!',
    img: 'c-yamal',
    emoji: '⭐',
    valor: 'Humility: Learn and share with friends!',
  },
  {
    id: 'dibu',
    nombre: 'Dibu',
    orden: 'Dibu saves the ball!',
    audio: 'Dibu! Be strong and brave!',
    img: 'c-dibu',
    emoji: '🧤',
    valor: 'Courage: God is our protector!',
  },
]

export function ChampionsOfJesus({
  onPanel,
  onInicio,
  onListo,
}: {
  onPanel: () => void
  onInicio?: () => void
  /** Si está presente, esta pantalla es una parada del recorrido diario: en
   *  vez de dejar los 3 sub-modos como un menú libre para siempre, cuenta
   *  cuáles ya se jugaron y llama a `onListo` cuando están los 3, sin volver
   *  a mostrar 🏠 en las sub-pantallas mientras tanto. Sin `onListo`
   *  (Modo Calma) el comportamiento es exactamente el de antes. */
  onListo?: () => void
}) {
  // En el recorrido diario hay una sola actividad: patear y comprobar que la
  // pelota entra. Los demás modos permanecen para el juego libre acompañado.
  const [modo, setModo] = useState<ModoFutbol>(() => (onListo ? 'penal' : 'menu'))
  const [paso, setPaso] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [balonEnArco, setBalonEnArco] = useState(false)
  const [celebrandoGol, setCelebrandoGol] = useState(false)
  const [completados, setCompletados] = useState<Set<SubModo>>(new Set())

  const jugadorObjetivo = JUGADORES[paso % 3] // Para modo pases (Messi, Mbappé, Lamine)

  useEffect(() => {
    if (!onListo || modo !== 'penal' || balonEnArco) return
    void decir('Kick the ball!')
  }, [onListo, modo, balonEnArco])

  const marcarCompletado = (sub: SubModo) => {
    if (onListo) {
      // Un juego completado lleva a la siguiente parada; no fuerza dos
      // submodos que no corresponden a la palabra que acaba de practicar.
      onListo()
      return
    }
    setCompletados((prev) => {
      const next = new Set(prev)
      next.add(sub)
      if (next.size >= 3) onListo?.()
      else setModo('menu')
      return next
    })
  }

  // 1. Iniciar Modo Penal (Shoot & Score)
  const iniciarPenal = async () => {
    setModo('penal')
    setBalonEnArco(false)
    setCelebrandoGol(false)
    await decir('Kick the ball!')
  }

  // 2. Iniciar Modo Pases (Pass to Friends)
  const iniciarPases = async () => {
    setModo('pases')
    setPaso(0)
    await decir('We play together with Jesus! Pass to Messi!')
  }

  // 3. Iniciar Modo Atajadas de Dibu (Dibu Saves)
  const iniciarAtajadas = async () => {
    setModo('atajadas')
    setPaso(0)
    await decir('Dibu saves the ball! Be strong and brave!')
  }

  // Disparar al arco (Penal)
  const patearAlArco = async () => {
    if (bloqueado || balonEnArco) return
    setBloqueado(true)
    patadaBalon()
    setBalonEnArco(true)

    await esperar(350)
    golCelebracion()
    setCelebrandoGol(true)
    await decir('Goal!')
    await esperar(600)
    estrellitas()
    await decir('Goal!')
    await esperar(800)
    setBloqueado(false)

    if (onListo) {
      await esperar(400)
      marcarCompletado('penal')
    }
  }

  // Pasar el balón a un compañero
  const pasarA = async (j: Jugador) => {
    if (bloqueado) return
    setBloqueado(true)
    patadaBalon()

    if (j.id === jugadorObjetivo.id) {
      bien()
      await decir(`${j.nombre}!`)
      await esperar(300)
      if (paso + 1 < 3) {
        const siguiente = JUGADORES[(paso + 1) % 3]
        setPaso(paso + 1)
        await decir(siguiente.orden)
        setBloqueado(false)
      } else {
        estrellitas()
        await decir('One team with Jesus! Great job!')
        await esperar(600)
        setBloqueado(false)
        if (onListo) marcarCompletado('pases')
        else setModo('menu')
      }
    } else {
      toque()
      await decir(j.nombre)
      await esperar(400)
      await decir(jugadorObjetivo.orden)
      setBloqueado(false)
    }
  }

  // Atajar con Dibu
  const atajarConDibu = async () => {
    if (bloqueado) return
    setBloqueado(true)
    patadaBalon()
    bien()
    await decir('Save! Dibu saves the ball!')
    await esperar(400)
    estrellitas()
    await decir('Be strong and brave! God is our shield! Amen!')
    await esperar(600)
    setBloqueado(false)

    if (onListo) {
      await esperar(400)
      marcarCompletado('atajadas')
    }
  }

  // Selector de Menú de Fútbol
  if (modo === 'menu') {
    return (
      <Marco paso={0} total={0} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla" style={{ maxWidth: 'min(92vw, 480px)' }}>
          <p className="frase">Champions of Jesus ⚽</p>
          <p className="frase-chica">Football & Faith with Heroes</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(8px, 2vmin, 16px)',
              width: '100%',
              marginTop: 4,
            }}
          >
            {/* Modo 1: Penal */}
            {!completados.has('penal') && (
              <div
                onClick={() => void iniciarPenal()}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ width: 88, height: 88 }}>
              <Tarjeta img="c-messi" emoji="🔟" audio="Kick the ball!" />
                </div>
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 800, marginTop: 4, textAlign: 'center' }}>
                  Shoot & Score! 🥅
                </span>
              </div>
            )}

            {/* Modo 2: Pases */}
            {!completados.has('pases') && (
              <div
                onClick={() => void iniciarPases()}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ width: 88, height: 88 }}>
                  <Tarjeta img="c-yamal" emoji="⚡" audio="We play together with Jesus! Pass to Messi!" />
                </div>
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 800, marginTop: 4, textAlign: 'center' }}>
                  Team Passing 👟
                </span>
              </div>
            )}

            {/* Modo 3: Atajadas */}
            {!completados.has('atajadas') && (
              <div
                onClick={() => void iniciarAtajadas()}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ width: 88, height: 88 }}>
                  <Tarjeta img="c-dibu" emoji="🧤" audio="Dibu saves the ball! Be strong and brave!" />
                </div>
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 800, marginTop: 4, textAlign: 'center' }}>
                  Dibu Saves! 🛡️
                </span>
              </div>
            )}
          </div>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <p className="frase-chica" style={{ opacity: 0.8 }}>
              ⚽ "Whatever you do, do it with all your heart for the Lord!"
            </p>
          </div>
        </div>
      </Marco>
    )
  }

  // Modo 1: Penal (Shoot & Score)
  if (modo === 'penal') {
    return (
      <Marco paso={balonEnArco ? 1 : 0} total={1} onPanel={onPanel} onInicio={onListo ? undefined : () => setModo('menu')}>
        <div className="pantalla">
          <p className="frase">{celebrandoGol ? '🙌 GOAL! Thank you, God!' : 'Shoot and Score!'}</p>

          {/* El Arco de Fútbol con Portero Dibu */}
          <div
            style={{
              position: 'relative',
              width: 'min(90vw, 360px)',
              height: 180,
              background: 'radial-gradient(circle at center, #ffffff 30%, #dcfce7 100%)',
              border: 'clamp(4px, 1vmin, 8px) solid #ffffff',
              borderRadius: 'var(--radio)',
              boxShadow: celebrandoGol ? '0 0 36px rgba(245, 158, 11, 0.9)' : 'var(--sombra)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transition: 'all 300ms ease',
            }}
          >
            {/* Red del arco */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                opacity: 0.3,
              }}
            />

            {/* Cuando hay gol, el arquero se lanza tarde y queda claramente
                lejos del balón: la imagen y la celebración dicen lo mismo. */}
            <div
              style={{
                width: 72,
                height: 72,
                transform: balonEnArco ? 'translateX(-112px) translateY(36px) rotate(-24deg) scale(0.86)' : 'translateY(0)',
                transition: 'transform 460ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              <Tarjeta img="c-dibu" emoji="🧤" audio="Kick the ball!" />
            </div>

            {/* Balón dentro de la red, lejos del arquero: visualmente es gol
                antes de que la voz diga GOAL. */}
            {balonEnArco && (
              <div
                style={{
                  position: 'absolute',
                  right: '16%',
                  top: '34%',
                  fontSize: 38,
                  animation: 'golEntra 520ms cubic-bezier(0.16, 1, 0.3, 1) both, pulsoGuia 1s 520ms infinite alternate',
                }}
              >
                ⚽
              </div>
            )}
          </div>

          {/* Balón interactivo para patear abajo */}
          {!balonEnArco ? (
            <div
              onClick={() => void patearAlArco()}
              style={{
                marginTop: 14,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  fontSize: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  animation: 'balanceoSuave 2s infinite ease-in-out',
                }}
              >
                ⚽
              </div>
              <p className="frase-chica" style={{ marginTop: 6, fontWeight: 800 }}>
                Tap the ball to KICK! 🚀
              </p>
            </div>
          ) : (
            !onListo && (
              <Boton
                invita
                onClick={() => {
                  setBalonEnArco(false)
                  setCelebrandoGol(false)
                }}
                style={{ marginTop: 14 }}
              >
                ⚽ Kick again!
              </Boton>
            )
          )}
        </div>
      </Marco>
    )
  }

  // Modo 2: Pases de Equipo (Pass to Friends)
  if (modo === 'pases') {
    return (
      <Marco paso={paso} total={3} onPanel={onPanel} onInicio={onListo ? undefined : () => setModo('menu')}>
        <div className="pantalla">
          <p className="frase">{jugadorObjetivo.orden}</p>
          <p className="frase-chica">We play together with Jesus!</p>

          <div
            style={{
              display: 'flex',
              gap: 'clamp(10px, 2.5vmin, 20px)',
              justifyContent: 'center',
              marginTop: 8,
            }}
          >
            {JUGADORES.slice(0, 3).map((j) => {
              const esObjetivo = j.id === jugadorObjetivo.id
              return (
                <div key={j.id} className="ficha" onClick={() => void pasarA(j)}>
                  <div style={{ width: 88, height: 88 }}>
                    <Tarjeta
                      img={j.img}
                      emoji={j.emoji}
                      guiando={esObjetivo}
                      audio={j.orden}
                    />
                  </div>
                  <span className="frase-chica" style={{ fontWeight: 800 }}>
                    {j.nombre}
                  </span>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 16, fontSize: 32 }}>
            ⚽ ➔ 👟
          </div>
        </div>
      </Marco>
    )
  }

  // Modo 3: Atajadas de Dibu (Dibu Saves)
  return (
    <Marco paso={1} total={1} onPanel={onPanel} onInicio={onListo ? undefined : () => setModo('menu')}>
      <div className="pantalla">
        <p className="frase">Dibu saves the ball! 🧤</p>
        <p className="frase-chica">Be strong and brave! God is our shield!</p>

        <div
          onClick={() => void atajarConDibu()}
          style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            background: 'radial-gradient(circle at center, #ffffff 40%, #f0fdf4 100%)',
            border: 'clamp(3px, 0.8vmin, 6px) solid var(--fondo-2)',
            borderRadius: 'var(--radio)',
            padding: 'clamp(16px, 3vmin, 24px)',
            width: 'min(90vw, 360px)',
            boxShadow: 'var(--sombra)',
          }}
        >
          <div style={{ width: 100, height: 100, marginBottom: 8 }}>
            <Tarjeta img="c-dibu" emoji="🧤" audio="Dibu saves the ball!" />
          </div>

          <p className="frase" style={{ fontSize: 'clamp(16px, 3.2vmin, 20px)', margin: 0 }}>
            Tap Dibu's Gloves to SAVE! ⚽
          </p>
        </div>

        {!onListo && (
          <Boton invita onClick={() => setModo('menu')} style={{ marginTop: 14 }}>
            ✔ Great job!
          </Boton>
        )}
      </div>
    </Marco>
  )
}
