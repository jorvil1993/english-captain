import { useEffect, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, campana, estrellitas, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Boton } from '../../componentes/Boton'
import { Marco } from '../../componentes/Marco'

type ModoBendicion = 'menu' | 'morning' | 'night'
type SubBendicion = 'morning' | 'night'

export function MorningNightBlessings({
  onPanel,
  onInicio,
  onListo,
}: {
  onPanel: () => void
  onInicio?: () => void
  /** Igual que en `ChampionsOfJesus`: si está presente, cuenta las 2
   *  bendiciones y llama a `onListo` cuando están las dos. Sin `onListo`
   *  (Modo Calma), el comportamiento es exactamente el de antes. */
  onListo?: () => void
}) {
  const [modo, setModo] = useState<ModoBendicion>(() => (onListo ? 'morning' : 'menu'))
  const [cortinaAbierta, setCortinaAbierta] = useState(false)
  const [cobijado, setCobijado] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)
  const [completados, setCompletados] = useState<Set<SubBendicion>>(new Set())

  const terminarSub = (sub: SubBendicion) => {
    bien()
    if (!onListo) {
      setModo('menu')
      return
    }
    setCompletados((prev) => {
      const next = new Set(prev)
      next.add(sub)
      if (next.size >= 2) onListo()
      else setModo('menu')
      return next
    })
  }

  const iniciarMorning = async () => {
    setModo('morning')
    setCortinaAbierta(false)
    // En la ruta diaria reutiliza el saludo que acabamos de enseñar, no una
    // oración nueva que compite con el vocabulario de la unidad.
    await decir('Good morning!')
  }

  const abrirVentana = async () => {
    if (bloqueado) return
    setBloqueado(true)
    toque()
    setCortinaAbierta(true)
    await decir('Good morning!')
    await esperar(400)
    estrellitas()
    await decir('Thank you, God!')
    await esperar(500)
    if (onListo) {
      await esperar(700)
      onListo()
    } else {
      setBloqueado(false)
    }
  }

  const iniciarNight = async () => {
    setModo('night')
    setCobijado(false)
    await decir('Good night, Jesus! Look at the stars!')
  }

  useEffect(() => {
    if (!onListo) return
    void iniciarMorning()
    // Se presenta una sola vez al entrar al recorrido diario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const arropar = async () => {
    if (bloqueado) return
    setBloqueado(true)
    toque()
    setCobijado(true)
    campana()
    await decir('Angel of God, protect me through the night!')
    await esperar(400)
    estrellitas()
    await decir('Good night, little Captain! God bless you! Amen!')
    await esperar(500)
    if (onListo) {
      await esperar(700)
      onListo()
    } else {
      setBloqueado(false)
    }
  }

  if (modo === 'menu') {
    return (
      <Marco paso={0} total={0} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla">
          <p className="frase">Daily Blessings</p>
          <p className="frase-chica">Morning & Night Routines</p>

          <div className="fila">
            {!completados.has('morning') && (
              <div className="ficha">
                <Tarjeta img="u3-sun" emoji="☀️" onClick={() => void iniciarMorning()} audio="Good morning, God! Open the window!" />
                <span className="frase-chica" style={{ fontWeight: 700 }}>
                  Morning Blessing ☀️
                </span>
              </div>
            )}
            {!completados.has('night') && (
              <div className="ficha">
                <Tarjeta img="u5-angel" emoji="🌙" onClick={() => void iniciarNight()} audio="Good night, Jesus! Look at the stars!" />
                <span className="frase-chica" style={{ fontWeight: 700 }}>
                  Night Prayer 🌙
                </span>
              </div>
            )}
          </div>
        </div>
      </Marco>
    )
  }

  return (
    <Marco paso={1} total={1} onPanel={onPanel} onInicio={onListo ? undefined : () => setModo('menu')}>
      <div className="pantalla">
        <p className="frase">{modo === 'morning' ? 'Morning Blessing ☀️' : 'Night Blessing 🌙'}</p>

        {modo === 'morning' ? (
          <>
            {/* Ventana de la mañana */}
            <div
              onClick={() => void abrirVentana()}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: cortinaAbierta
                  ? 'radial-gradient(circle at center, #fffbeb 30%, #fef3c7 70%, #fde68a 100%)'
                  : 'radial-gradient(circle at center, #ffffff 40%, #e2e8f0 100%)',
                border: 'clamp(3px, 0.8vmin, 6px) solid var(--fondo-2)',
                borderRadius: 'var(--radio)',
                padding: 'clamp(14px, 2.5vmin, 22px)',
                width: 'min(92vw, 420px)',
                minHeight: 160,
                boxShadow: cortinaAbierta ? '0 0 32px rgba(245, 158, 11, 0.6)' : 'var(--sombra)',
                cursor: 'pointer',
                transition: 'all 500ms ease',
              }}
            >
              <div style={{ width: 84, height: 84, marginBottom: 6 }}>
                <Tarjeta
                  img={cortinaAbierta ? 'u3-sun' : 'u5-angel'}
                  emoji={cortinaAbierta ? '☀️' : '🪟'}
                  audio={cortinaAbierta ? 'Thank you, God!' : 'Good morning!'}
                />
              </div>

              <p className="frase" style={{ fontSize: 'clamp(17px, 3.2vmin, 22px)', margin: 0 }}>
                {cortinaAbierta ? '☀️ Good morning!' : 'Tap to open the window! 🪟'}
              </p>
            </div>

            {!onListo && (
              <Boton invita onClick={() => terminarSub('morning')} style={{ marginTop: 12 }}>
                ✔ Amen!
              </Boton>
            )}
          </>
        ) : (
          <>
            {/* Noche estrellada con Ángel de la Guarda */}
            <div
              onClick={() => void arropar()}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: cobijado
                  ? 'radial-gradient(circle at center, #1e1b4b 30%, #0f172a 100%)'
                  : 'radial-gradient(circle at center, #312e81 40%, #1e1b4b 100%)',
                color: '#ffffff',
                border: 'clamp(3px, 0.8vmin, 6px) solid #4338ca',
                borderRadius: 'var(--radio)',
                padding: 'clamp(14px, 2.5vmin, 22px)',
                width: 'min(92vw, 420px)',
                minHeight: 160,
                boxShadow: cobijado ? '0 0 32px rgba(99, 102, 241, 0.8)' : 'var(--sombra)',
                cursor: 'pointer',
                transition: 'all 500ms ease',
              }}
            >
              <div style={{ width: 84, height: 84, marginBottom: 6 }}>
                <Tarjeta img="u5-angel" emoji="👼" audio="Angel of God, protect me through the night!" />
              </div>

              <p className="frase" style={{ color: '#fef08a', fontSize: 'clamp(17px, 3.2vmin, 22px)', margin: 0 }}>
                {cobijado ? '⭐ Angel of God, protect me! ⭐' : 'Tap to pray and sleep! 🌙'}
              </p>
            </div>

            {!onListo && (
              <Boton invita onClick={() => terminarSub('night')} style={{ marginTop: 12 }}>
                ✔ Amen!
              </Boton>
            )}
          </>
        )}
      </div>
    </Marco>
  )
}
