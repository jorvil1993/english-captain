import { useEffect, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, estrellitas, toque } from '../../audio/sonidos'
import { CAMPANAS, campanaTono, paz } from '../../audio/sonidos-extra'
import { Marco } from '../../componentes/Marco'
import './motor/estilos.css'

type CampanaId = 'big' | 'middle' | 'little'

type CampanaInfo = {
  id: CampanaId
  nombre: string
  audioNombre: string
  frecuencia: number
  tamano: number
  cuerdaAlto: number
  color: string
}

const CAMPANAS_INFO: CampanaInfo[] = [
  { id: 'big', nombre: 'Big Bell', audioNombre: 'Big bell!', frecuencia: CAMPANAS.big, tamano: 110, cuerdaAlto: 90, color: '#d4af37' },
  { id: 'middle', nombre: 'Middle Bell', audioNombre: 'Middle bell!', frecuencia: CAMPANAS.middle, tamano: 88, cuerdaAlto: 110, color: '#e5c158' },
  { id: 'little', nombre: 'Little Bell', audioNombre: 'Little bell!', frecuencia: CAMPANAS.little, tamano: 70, cuerdaAlto: 125, color: '#f3d779' },
]

export function RingTheBells({
  onVolver,
  onPanel,
  onInicio,
}: {
  onVolver: () => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const [nivel, setNivel] = useState<1 | 2 | 3>(1)
  const [tocadasNivel1, setTocadasNivel1] = useState<Set<CampanaId>>(new Set())
  const [secuenciaDemo, setSecuenciaDemo] = useState<CampanaId[]>([])
  const [pasoJugador, setPasoJugador] = useState<number>(0)
  const [esTurnoJugador, setEsTurnoJugador] = useState(false)
  const [campanaActiva, setCampanaActiva] = useState<CampanaId | null>(null)
  const [campanaOscilando, setCampanaOscilando] = useState<Record<CampanaId, boolean>>({
    big: false,
    middle: false,
    little: false,
  })
  const [bloqueado, setBloqueado] = useState(true)
  const [celebrando, setCelebrando] = useState(false)
  const [mostrarGuia, setMostrarGuia] = useState(true)

  const timerGuia = useRef<number | null>(null)
  const abortarRef = useRef(false)

  // Iniciar Nivel 1: Explorar libremente
  useEffect(() => {
    abortarRef.current = false
    void (async () => {
      await esperar(400)
      if (abortarRef.current) return
      await decir('Ring the Church Bells')
      if (abortarRef.current) return
      await esperar(300)
      await decir('Ring the bell!')
      if (abortarRef.current) return
      setBloqueado(false)
      setEsTurnoJugador(true)
    })()

    return () => {
      abortarRef.current = true
      if (timerGuia.current) window.clearTimeout(timerGuia.current)
    }
  }, [])

  const activarCampanaVisual = (id: CampanaId) => {
    setCampanaOscilando((prev) => ({ ...prev, [id]: true }))
    setCampanaActiva(id)
    setTimeout(() => {
      setCampanaActiva((actual) => (actual === id ? null : actual))
    }, 450)
    setTimeout(() => {
      setCampanaOscilando((prev) => ({ ...prev, [id]: false }))
    }, 900)
  }

  // Reproducir demo de secuencia para Niveles 2 y 3
  const reproducirDemo = async (sec: CampanaId[]) => {
    setBloqueado(true)
    setEsTurnoJugador(false)
    setPasoJugador(0)
    await esperar(500)

    for (let i = 0; i < sec.length; i++) {
      if (abortarRef.current) return
      const id = sec[i]
      const info = CAMPANAS_INFO.find((c) => c.id === id)!
      activarCampanaVisual(id)
      campanaTono(info.frecuencia, 0.28)
      await esperar(750)
    }

    if (abortarRef.current) return
    await esperar(300)
    await decir('Your turn!')
    setBloqueado(false)
    setEsTurnoJugador(true)
  }

  const tocarCampana = async (id: CampanaId) => {
    if (bloqueado) return
    setMostrarGuia(false)
    const info = CAMPANAS_INFO.find((c) => c.id === id)!

    activarCampanaVisual(id)
    campanaTono(info.frecuencia, 0.3)

    // ── NIVEL 1: Explorar las 3 campanas ─────────────────────────────
    if (nivel === 1) {
      toque()
      const nuevoSet = new Set(tocadasNivel1)
      nuevoSet.add(id)
      setTocadasNivel1(nuevoSet)

      if (nuevoSet.size >= 3) {
        setBloqueado(true)
        setEsTurnoJugador(false)
        await esperar(500)
        bien()
        estrellitas()
        await decir('Great job!')
        await esperar(500)
        setNivel(2)
        const secNivel2: CampanaId[] = ['big', 'little']
        setSecuenciaDemo(secNivel2)
        await reproducirDemo(secNivel2)
      }
      return
    }

    // ── NIVEL 2: Repetir 2 campanas ──────────────────────────────────
    if (nivel === 2) {
      const esperado = secuenciaDemo[pasoJugador]
      if (id === esperado) {
        bien()
        const sigPaso = pasoJugador + 1
        setPasoJugador(sigPaso)

        if (sigPaso >= secuenciaDemo.length) {
          setBloqueado(true)
          setEsTurnoJugador(false)
          await esperar(500)
          estrellitas()
          await decir('Yes! The same bells!')
          await esperar(600)
          setNivel(3)
          const secNivel3: CampanaId[] = ['big', 'middle', 'little']
          setSecuenciaDemo(secNivel3)
          await reproducirDemo(secNivel3)
        }
      } else {
        // En caso de toque diferente: no hay castigo, recuerda suavemente la secuencia
        await esperar(400)
        await reproducirDemo(secuenciaDemo)
      }
      return
    }

    // ── NIVEL 3: Himno festivo de 3 campanas ─────────────────────────
    if (nivel === 3) {
      const esperado = secuenciaDemo[pasoJugador]
      if (id === esperado) {
        bien()
        const sigPaso = pasoJugador + 1
        setPasoJugador(sigPaso)

        if (sigPaso >= secuenciaDemo.length) {
          setBloqueado(true)
          setEsTurnoJugador(false)
          setCelebrando(true)
          await esperar(400)

          // Repique jubiloso simultáneo
          campanaTono(CAMPANAS.big, 0.3)
          activarCampanaVisual('big')
          await esperar(180)
          campanaTono(CAMPANAS.middle, 0.28)
          activarCampanaVisual('middle')
          await esperar(180)
          campanaTono(CAMPANAS.little, 0.26)
          activarCampanaVisual('little')

          estrellitas()
          await decir('You rang all the bells! Wonderful!')
          await esperar(500)
          paz()
          await decir('The bells call us to church.')
          await esperar(1200)
          onVolver()
        }
      } else {
        await esperar(400)
        await reproducirDemo(secuenciaDemo)
      }
    }
  }

  return (
    <Marco paso={nivel} total={3} onPanel={onPanel} onInicio={onInicio}>
      <div className="mjx-pantalla" style={{ background: 'radial-gradient(ellipse at 50% 20%, #fefcf3 0%, #ecdcc2 100%)' }}>
        {/* Cabecera del juego con indicador de Nivel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 520, padding: '0 12px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--verde)', background: 'rgba(27, 107, 74, 0.1)', padding: '3px 10px', borderRadius: 12 }}>
            Level {nivel} of 3 {nivel === 1 ? '· Explore' : nivel === 2 ? '· 2 Bells' : '· Celebration'}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tinta-suave)' }}>
            🔔 Ring the Bells
          </span>
        </div>

        {/* Campanario interactivo */}
        <div
          className="mjx-escena"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 540,
            height: 'clamp(280px, 50vmin, 380px)',
            margin: '12px 0',
            background: 'linear-gradient(180deg, rgba(215, 185, 140, 0.25) 0%, rgba(180, 145, 100, 0.35) 100%)',
            borderRadius: 24,
            border: '4px solid #b8976b',
            boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.06), 0 8px 24px rgba(70,45,20,0.12)',
            overflow: 'hidden',
            touchAction: 'manipulation',
          }}
        >
          {/* Viga superior de madera */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 28,
              background: '#8b5a2b',
              borderBottom: '3px solid #5c3a17',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              zIndex: 2,
            }}
          />

          {/* Las 3 Campanas colgadas */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              height: '100%',
              paddingTop: 28,
              position: 'relative',
              zIndex: 3,
            }}
          >
            {CAMPANAS_INFO.map((c) => {
              const oscila = campanaOscilando[c.id]
              const activa = campanaActiva === c.id
              const yaTocadaL1 = nivel === 1 && tocadasNivel1.has(c.id)

              return (
                <div
                  key={c.id}
                  onClick={() => void tocarCampana(c.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: bloqueado ? 'default' : 'pointer',
                    transform: oscila ? 'rotate(16deg)' : 'rotate(0deg)',
                    transformOrigin: 'top center',
                    transition: oscila
                      ? 'transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      : 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    position: 'relative',
                  }}
                >
                  {/* Campana Visual SVG estilizada */}
                  <div
                    style={{
                      width: c.tamano,
                      height: c.tamano,
                      filter: activa
                        ? 'drop-shadow(0 0 16px rgba(255, 215, 0, 0.95)) brightness(1.15)'
                        : 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
                      transition: 'filter 180ms ease, transform 180ms ease',
                      transform: activa ? 'scale(1.12)' : 'scale(1)',
                    }}
                  >
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <defs>
                        <linearGradient id={`grad-${c.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fff2a1" />
                          <stop offset="40%" stopColor={c.color} />
                          <stop offset="100%" stopColor="#967016" />
                        </linearGradient>
                      </defs>
                      {/* Aro de sujeción */}
                      <circle cx="50" cy="12" r="7" fill="none" stroke="#5c3a17" strokeWidth="4" />
                      {/* Cuerpo de la campana */}
                      <path
                        d="M 50 16 C 36 18, 30 40, 24 64 C 18 78, 12 82, 10 86 C 10 90, 90 90, 90 86 C 88 82, 82 78, 76 64 C 70 40, 64 18, 50 16 Z"
                        fill={`url(#grad-${c.id})`}
                        stroke="#6e4f0a"
                        strokeWidth="2.5"
                      />
                      {/* Borde inferior reforzado */}
                      <ellipse cx="50" cy="86" rx="40" ry="6" fill="#b08d24" stroke="#6e4f0a" strokeWidth="2" />
                      {/* Badajo interior */}
                      <circle cx="50" cy="91" r="6" fill="#4a3710" />
                    </svg>
                  </div>

                  {/* Cuerda que cae de la campana */}
                  <div
                    style={{
                      width: 5,
                      height: c.cuerdaAlto,
                      background: 'repeating-linear-gradient(180deg, #c49a45 0px, #c49a45 6px, #825f18 7px, #825f18 10px)',
                      borderRadius: 3,
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />

                  {/* Tirador inferior de la cuerda */}
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#734e19',
                      border: '2px solid #ecdcc2',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    ↓
                  </div>

                  {/* Indicador de check en Nivel 1 */}
                  {yaTocadaL1 && (
                    <span style={{ position: 'absolute', bottom: -8, fontSize: 16 }}>
                      ⭐
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Manita animada tutorial que enseña a tocar */}
          {mostrarGuia && esTurnoJugador && nivel === 1 && (
            <div
              style={{
                position: 'absolute',
                top: '55%',
                left: '20%',
                fontSize: 36,
                pointerEvents: 'none',
                animation: 'mjx-rebote-suave 1.2s infinite ease-in-out',
                zIndex: 10,
              }}
            >
              👆
            </div>
          )}

          {/* Cartel flotante de "Your Turn!" cuando le toca a José */}
          {esTurnoJugador && !bloqueado && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1b6b4a',
                color: '#fff',
                padding: '4px 16px',
                borderRadius: 20,
                fontSize: 'clamp(12px, 2.8vmin, 15px)',
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 4px 14px rgba(27,107,74,0.4)',
                animation: 'mjx-pulso 1.4s infinite ease-in-out',
                zIndex: 10,
              }}
            >
              👉 YOUR TURN!
            </div>
          )}

          {/* Efectos de celebración final */}
          {celebrando && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.88)',
                zIndex: 20,
                animation: 'mjx-aparecer 300ms ease-out',
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 8 }}>🕊️ 🔔 ✨</div>
              <p className="frase" style={{ color: 'var(--verde)', fontSize: 26, margin: '4px 0' }}>
                Wonderful!
              </p>
              <p className="frase-chica">Glory to God in the Highest!</p>
            </div>
          )}
        </div>

        {/* Pie con texto en inglés claro */}
        <p className="mjx-pie" style={{ fontSize: 'clamp(14px, 3.2vmin, 18px)', fontWeight: 700 }}>
          {nivel === 1 && 'Touch the bells to hear their voices! 🔔'}
          {nivel === 2 && 'Listen and repeat the 2 bells! ⭐'}
          {nivel === 3 && 'Ring the church melody for Jesus! 🕊️'}
        </p>
      </div>
    </Marco>
  )
}
