import { useEffect, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, estrellitas, golCelebracion, patadaBalon, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Marco } from '../../componentes/Marco'

type ModoFutbol = 'menu' | 'penal' | 'pases'

type Jugador = {
  id: string
  nombre: string
  orden: string
  audio: string
  img: string
  emoji: string
}

const JUGADORES: Jugador[] = [
  { id: 'messi', nombre: 'Messi', orden: 'Pass to Messi!', audio: 'Messi! Thank you, God!', img: 'c-messi', emoji: '🔟' },
  { id: 'mbappe', nombre: 'Mbappé', orden: 'Pass to Mbappé!', audio: 'Mbappé! Run fast!', img: 'c-mbappe', emoji: '⚡' },
  { id: 'modric', nombre: 'Luka', orden: 'Pass to Luka!', audio: 'Luka! Great team!', img: 'c-modric', emoji: '⭐' },
  { id: 'dibu', nombre: 'Dibu', orden: 'Dibu saves the ball!', audio: 'Dibu! Be strong and brave!', img: 'c-dibu', emoji: '🧤' },
]

export function ChampionsOfJesus({
  onPanel,
  onInicio,
  onListo,
}: {
  onPanel: () => void
  onInicio?: () => void
  onListo?: () => void
}) {
  const [modo, setModo] = useState<ModoFutbol>(onListo ? 'penal' : 'menu')
  const [nivelPenal, setNivelPenal] = useState<1 | 2 | 3>(1)
  const [golesNivel3, setGolesNivel3] = useState<number>(0)
  const [pateando, setPateando] = useState(false)
  const [direccionTiro, setDireccionTiro] = useState<'izq' | 'centro' | 'der'>('centro')
  const [golMarcado, setGolMarcado] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)
  const [mostrarGuia, setMostrarGuia] = useState(true)
  const [celebrandoTodo, setCelebrandoTodo] = useState(false)

  // Estado del modo pases
  const [pasoPases, setPasoPases] = useState(0)
  const [posicionBalonPases, setPosicionBalonPases] = useState<'messi' | 'mbappe' | 'modric'>('messi')

  // Control de finalización
  const abortarRef = useRef(false)

  useEffect(() => {
    abortarRef.current = false
    void (async () => {
      await esperar(300)
      if (abortarRef.current) return
      if (modo === 'penal') {
        await decir('Shoot and score!')
      }
    })()
    return () => {
      abortarRef.current = true
    }
  }, [modo])

  // ── PATEAR AL ARCO CON FÍSICA Y DIRECCIÓN ────────────────────────────────
  const dispararPenal = async (dir: 'izq' | 'centro' | 'der') => {
    if (bloqueado || pateando) return
    setBloqueado(true)
    setMostrarGuia(false)
    setDireccionTiro(dir)
    setPateando(true)
    patadaBalon()

    await esperar(450)
    if (abortarRef.current) return

    // ¡GOLAZO!
    setGolMarcado(true)
    golCelebracion()
    bien()
    await decir('Goal!')
    await esperar(400)
    estrellitas()

    // ── GESTIÓN DE NIVELES ──────────────────────────────────────────────
    if (nivelPenal === 1) {
      await esperar(800)
      if (abortarRef.current) return
      setGolMarcado(false)
      setPateando(false)
      setNivelPenal(2)
      await decir('Great kick, Captain José!')
      await esperar(300)
      await decir('Shoot and score!')
      setBloqueado(false)
    } else if (nivelPenal === 2) {
      await esperar(800)
      if (abortarRef.current) return
      setGolMarcado(false)
      setPateando(false)
      setNivelPenal(3)
      setGolesNivel3(1)
      await decir('GOAL! Thank you, God!')
      await esperar(400)
      await decir('Shoot and score!')
      setBloqueado(false)
    } else if (nivelPenal === 3) {
      const nuevosGoles = golesNivel3 + 1
      setGolesNivel3(nuevosGoles)

      if (nuevosGoles < 3) {
        await esperar(800)
        if (abortarRef.current) return
        setGolMarcado(false)
        setPateando(false)
        await decir('Goal!')
        setBloqueado(false)
      } else {
        // Hat-trick completado
        setCelebrandoTodo(true)
        await esperar(400)
        await decir('Champions of Jesus')
        await esperar(500)
        await decir('We play together with Jesus!')
        await esperar(1200)
        if (onListo) onListo()
        else setModo('menu')
      }
    }
  }

  // ── MODO PASES EN EQUIPO ────────────────────────────────────────────────
  const ejecutarPase = async (jugadorId: 'messi' | 'mbappe' | 'modric') => {
    if (bloqueado) return
    const esperado = pasoPases === 0 ? 'messi' : pasoPases === 1 ? 'mbappe' : 'modric'

    setBloqueado(true)
    patadaBalon()
    setPosicionBalonPases(jugadorId)

    if (jugadorId === esperado) {
      bien()
      const j = JUGADORES.find((x) => x.id === jugadorId)!
      await decir(j.nombre)
      await esperar(350)

      if (pasoPases + 1 < 3) {
        const sig = pasoPases + 1
        setPasoPases(sig)
        const proximo = JUGADORES[sig]
        await decir(proximo.orden)
        setBloqueado(false)
      } else {
        estrellitas()
        await decir('One team with Jesus! Great job!')
        await esperar(900)
        if (onListo) onListo()
        else setModo('menu')
      }
    } else {
      toque()
      await esperar(300)
      const jEsperado = JUGADORES[pasoPases]
      await decir(jEsperado.orden)
      setBloqueado(false)
    }
  }

  // ── RENDER MENÚ LIBRE ────────────────────────────────────────────────────
  if (modo === 'menu') {
    return (
      <Marco paso={0} total={0} onPanel={onPanel} onInicio={onInicio}>
        <div className="mjx-pantalla">
          <p className="frase">Champions of Jesus ⚽</p>
          <p className="frase-chica">Fútbol dinámico con los héroes</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 420, marginTop: 12 }}>
            <div
              onClick={() => {
                setNivelPenal(1)
                setGolesNivel3(0)
                setPateando(false)
                setGolMarcado(false)
                setModo('penal')
              }}
              className="ficha"
              style={{ cursor: 'pointer', padding: 14 }}
            >
              <Tarjeta img="c-messi" emoji="🥅" grande />
              <span className="frase-chica" style={{ fontWeight: 800, marginTop: 6 }}>
                🥅 Penalty Shootout
              </span>
              <span style={{ fontSize: 11, color: 'var(--tinta-suave)' }}>3 niveles con Dibu</span>
            </div>

            <div
              onClick={() => {
                setPasoPases(0)
                setPosicionBalonPases('messi')
                setModo('pases')
              }}
              className="ficha"
              style={{ cursor: 'pointer', padding: 14 }}
            >
              <Tarjeta img="c-modric" emoji="👟" grande />
              <span className="frase-chica" style={{ fontWeight: 800, marginTop: 6 }}>
                👟 Team Passing
              </span>
              <span style={{ fontSize: 11, color: 'var(--tinta-suave)' }}>Pases con Messi & Luka</span>
            </div>
          </div>
        </div>
      </Marco>
    )
  }

  // ── RENDER MODO PASES ────────────────────────────────────────────────────
  if (modo === 'pases') {
    return (
      <Marco paso={pasoPases + 1} total={3} onPanel={onPanel} onInicio={() => setModo('menu')}>
        <div className="mjx-pantalla">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 500, padding: '0 8px' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--verde)' }}>Pass {pasoPases + 1} of 3</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tinta-suave)' }}>⚽ Team Passing</span>
          </div>

          {/* Cancha de pases con césped verde */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 520,
              height: 'clamp(280px, 48vmin, 360px)',
              background: 'repeating-linear-gradient(0deg, #238b45 0px, #238b45 32px, #2ca25f 32px, #2ca25f 64px)',
              borderRadius: 24,
              border: '4px solid #ffffff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              margin: '12px 0',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {/* Círculo central blanco de la cancha */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 130,
                height: 130,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.4)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />

            {/* Los 3 Jugadores en cancha */}
            {(['messi', 'mbappe', 'modric'] as const).map((jId) => {
              const jugador = JUGADORES.find((x) => x.id === jId)!
              const tieneBalon = posicionBalonPases === jId
              const esElObjetivo = (pasoPases === 0 && jId === 'messi') || (pasoPases === 1 && jId === 'mbappe') || (pasoPases === 2 && jId === 'modric')

              return (
                <div
                  key={jId}
                  onClick={() => void ejecutarPase(jId)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: bloqueado ? 'default' : 'pointer',
                    zIndex: 4,
                    transform: tieneBalon ? 'scale(1.12)' : 'scale(1)',
                    transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 18,
                      overflow: 'hidden',
                      border: esElObjetivo ? '4px solid #ffd700' : '3px solid #ffffff',
                      boxShadow: esElObjetivo ? '0 0 20px rgba(255,215,0,0.8)' : '0 4px 10px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Tarjeta img={jugador.img} emoji={jugador.emoji} grande />
                  </div>
                  <span style={{ color: '#ffffff', fontWeight: 800, fontSize: 14, marginTop: 4, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {jugador.nombre}
                  </span>

                  {tieneBalon && (
                    <div style={{ fontSize: 26, marginTop: -4, animation: 'mjx-rebote-suave 1s infinite ease-in-out' }}>
                      ⚽
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <p className="mjx-pie" style={{ fontWeight: 800 }}>
            {pasoPases === 0 && '👉 Pass to Messi! 🔟'}
            {pasoPases === 1 && '👉 Pass to Mbappé! ⚡'}
            {pasoPases === 2 && '👉 Pass to Luka! ⭐'}
          </p>
        </div>
      </Marco>
    )
  }

  // ── RENDER MODO PENAL CON FÍSICAS Y DIBU MARTÍNEZ ────────────────────────
  return (
    <Marco paso={nivelPenal} total={3} onPanel={onPanel} onInicio={onListo ? undefined : () => setModo('menu')}>
      <div className="mjx-pantalla" style={{ background: 'radial-gradient(ellipse at 50% 30%, #eefbf3 0%, #cbe9d4 100%)' }}>
        {/* Marcador superior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 520, padding: '0 12px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--verde)', background: 'rgba(27,107,74,0.1)', padding: '3px 10px', borderRadius: 12 }}>
            Level {nivelPenal} of 3 {nivelPenal === 1 ? '· Open Goal' : nivelPenal === 2 ? '· Dibu Moves' : '· Hat-Trick ⭐⭐⭐'}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {nivelPenal === 3 && (
              <>
                <span style={{ opacity: golesNivel3 >= 1 ? 1 : 0.3, fontSize: 18 }}>⚽</span>
                <span style={{ opacity: golesNivel3 >= 2 ? 1 : 0.3, fontSize: 18 }}>⚽</span>
                <span style={{ opacity: golesNivel3 >= 3 ? 1 : 0.3, fontSize: 18 }}>⚽</span>
              </>
            )}
          </div>
        </div>

        {/* Cancha y Arco en Perspectiva 3D */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 520,
            height: 'clamp(280px, 48vmin, 380px)',
            margin: '10px 0',
            background: 'linear-gradient(180deg, #1d733b 0%, #29934f 55%, #1f803f 100%)',
            borderRadius: 24,
            border: '4px solid #ffffff',
            boxShadow: golMarcado ? '0 0 36px rgba(245, 158, 11, 0.85)' : '0 8px 24px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 12px 14px',
            touchAction: 'manipulation',
          }}
        >
          {/* Fondo: Red y Postes del Arco */}
          <div
            style={{
              position: 'relative',
              width: '88%',
              height: '48%',
              border: '6px solid #ffffff',
              borderBottom: 'none',
              borderRadius: '8px 8px 0 0',
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 8px, transparent 8px, transparent 16px), repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 8px, transparent 8px, transparent 16px)',
              backgroundSize: '16px 16px',
              backgroundColor: 'rgba(0, 50, 20, 0.4)',
              boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Dibu Martínez en el arco */}
            {nivelPenal >= 2 && (
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'absolute',
                  bottom: 2,
                  zIndex: 3,
                  animation: !pateando && nivelPenal === 2 ? 'mjx-dibu-patrulla 2.8s infinite alternate ease-in-out' : undefined,
                  transform: pateando
                    ? direccionTiro === 'izq'
                      ? 'translateX(70px) rotate(20deg)'
                      : direccionTiro === 'der'
                      ? 'translateX(-70px) rotate(-20deg)'
                      : 'translateX(60px)'
                    : undefined,
                  transition: 'transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <Tarjeta img="c-dibu" emoji="🧤" grande />
              </div>
            )}

            {/* Balón cuando entra al arco (Gol) */}
            {golMarcado && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '30%',
                  left: direccionTiro === 'izq' ? '18%' : direccionTiro === 'der' ? '78%' : '48%',
                  fontSize: 34,
                  transform: 'translate(-50%, 0) scale(0.85)',
                  animation: 'mjx-rebote-suave 400ms infinite ease-in-out',
                  zIndex: 4,
                }}
              >
                ⚽
              </div>
            )}
          </div>

          {/* Tres Zonas de Tiro Táctil al Arco */}
          {!pateando && (
            <div style={{ display: 'flex', width: '88%', justifyContent: 'space-between', position: 'absolute', top: '16px', height: '48%', zIndex: 10 }}>
              <button
                onClick={() => void dispararPenal('izq')}
                style={{ width: '32%', height: '100%', opacity: 0, cursor: 'pointer' }}
                aria-label="Patear izquierda"
              />
              <button
                onClick={() => void dispararPenal('centro')}
                style={{ width: '32%', height: '100%', opacity: 0, cursor: 'pointer' }}
                aria-label="Patear centro"
              />
              <button
                onClick={() => void dispararPenal('der')}
                style={{ width: '32%', height: '100%', opacity: 0, cursor: 'pointer' }}
                aria-label="Patear derecha"
              />
            </div>
          )}

          {/* Punto de Penal y Balón abajo */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Punto blanco de penal en el césped */}
            <div style={{ width: 48, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', marginBottom: -10 }} />

            {/* Balón que se patea */}
            {!golMarcado && (
              <div
                onClick={() => void dispararPenal('centro')}
                style={{
                  width: 82,
                  height: 82,
                  fontSize: 54,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  cursor: bloqueado ? 'default' : 'pointer',
                  transform: pateando
                    ? `translateY(-140px) translateX(${direccionTiro === 'izq' ? '-60px' : direccionTiro === 'der' ? '60px' : '0px'}) scale(0.55) rotate(720deg)`
                    : 'translateY(0) scale(1)',
                  transition: pateando ? 'transform 420ms cubic-bezier(0.12, 0.8, 0.32, 1)' : 'transform 180ms ease',
                  userSelect: 'none',
                }}
              >
                ⚽
              </div>
            )}
          </div>

          {/* Manita tutorial en Nivel 1 */}
          {mostrarGuia && nivelPenal === 1 && !pateando && (
            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                fontSize: 38,
                pointerEvents: 'none',
                animation: 'mjx-rebote-suave 1.2s infinite ease-in-out',
                zIndex: 12,
              }}
            >
              👆
            </div>
          )}

          {/* Cartel de ¡GOL! en pantalla */}
          {golMarcado && (
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#ffd700',
                color: '#1b6b4a',
                padding: '8px 24px',
                borderRadius: 24,
                fontSize: 28,
                fontWeight: 900,
                boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
                animation: 'mjx-aparecer 250ms ease-out',
                zIndex: 15,
              }}
            >
              🙌 GOAL!
            </div>
          )}

          {/* Celebración de los campeones al ganar */}
          {celebrandoTodo && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.92)',
                zIndex: 25,
                animation: 'mjx-aparecer 300ms ease-out',
              }}
            >
              <div style={{ fontSize: 50, marginBottom: 8 }}>🏆 ⚽ ⭐</div>
              <p className="frase" style={{ color: 'var(--verde)', fontSize: 26, margin: '4px 0' }}>
                Champions of Jesus!
              </p>
              <p className="frase-chica">Great kick, Captain José! Bravo!</p>
            </div>
          )}
        </div>

        <p className="mjx-pie" style={{ fontWeight: 800 }}>
          {nivelPenal === 1 && '👉 Tap the ball to shoot and score! ⚽'}
          {nivelPenal === 2 && '👉 Aim to the corner past Dibu! 🧤'}
          {nivelPenal === 3 && `⭐ Score 3 goals for the trophy! (${golesNivel3}/3)`}
        </p>
      </div>
    </Marco>
  )
}
