import { useEffect, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, estrellitas, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Marco } from '../../componentes/Marco'

type FiguraPesebre = {
  id: string
  nombre: string
  orden: string
  sonido: string
  emoji: string
  img: string
}

const FIGURAS: FiguraPesebre[] = [
  { id: 'mary', nombre: 'Mary is the Mother of Jesus.', orden: 'Show me Mary!', sonido: 'Mary is the Mother of Jesus.', emoji: '🌹', img: 'u4-mary' },
  { id: 'joseph', nombre: 'Saint Joseph is strong.', orden: 'Show me Saint Joseph!', sonido: 'Saint Joseph is strong.', emoji: '🪵', img: 'u4-joseph' },
  { id: 'jesus', nombre: 'Jesus is the Son of God.', orden: 'Show me Jesus!', sonido: 'Jesus is the Son of God.', emoji: '👶', img: 'u4-jesus' },
]

export function DressTheNativity({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const [paso, setPaso] = useState(0)
  const [colocadas, setColocadas] = useState<string[]>([])
  const [bloqueado, setBloqueado] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const [arrastrando, setArrastrando] = useState<string | null>(null)
  const establoRef = useRef<HTMLDivElement>(null)
  const timerInactividad = useRef<number | null>(null)

  const objetivo = FIGURAS[paso]

  const reiniciarInactividad = (texto: string) => {
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    timerInactividad.current = window.setTimeout(async () => {
      await decir(texto)
    }, 4500)
  }

  useEffect(() => {
    if (!objetivo) return
    let cancelado = false
    setBloqueado(true)

    void (async () => {
      await esperar(300)
      if (cancelado) return
      await decir(objetivo.orden)
      if (cancelado) return
      setBloqueado(false)
      reiniciarInactividad(objetivo.orden)
    })()

    return () => {
      cancelado = true
      if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    }
  }, [objetivo, paso])

  const colocar = async (fig: FiguraPesebre) => {
    if (bloqueado || colocadas.includes(fig.id)) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setBloqueado(true)

    if (fig.id === objetivo.id) {
      bien()
      setColocadas((prev) => [...prev, fig.id])
      await decir(fig.sonido)
      await esperar(300)

      if (paso + 1 < FIGURAS.length) {
        setPaso(paso + 1)
      } else {
        setTerminado(true)
        estrellitas()
        await decir('They are the Holy Family.')
        await esperar(500)
        await decir('Good job! God loves you!')
        await esperar(500)
        onVolver()
      }
    } else {
      toque()
      await decir(fig.nombre)
      await esperar(400)
      await decir(objetivo.orden)
      setBloqueado(false)
      reiniciarInactividad(objetivo.orden)
    }
  }

  // Manejadores de Arrastre Táctil (Drag & Drop)
  const iniciarArrastre = (id: string, e: React.PointerEvent) => {
    if (bloqueado || colocadas.includes(id)) return
    setArrastrando(id)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const soltarArrastre = (fig: FiguraPesebre, e: React.PointerEvent) => {
    if (!arrastrando) return
    const dropX = e.clientX
    const dropY = e.clientY
    setArrastrando(null)

    if (establoRef.current) {
      const rect = establoRef.current.getBoundingClientRect()
      const dentroEstablo =
        dropX >= rect.left - 40 &&
        dropX <= rect.right + 40 &&
        dropY >= rect.top - 40 &&
        dropY <= rect.bottom + 40

      if (dentroEstablo) {
        void colocar(fig)
        return
      }
    }

    void colocar(fig)
  }

  return (
    <Marco paso={colocadas.length} total={FIGURAS.length} onPanel={onPanel} onInicio={onInicio}>
      <div
        className="pantalla"
        style={{ touchAction: 'none' }}
      >
        <p className="frase">Dress the Nativity</p>

        {/* El Establo de Belén con Ilustraciones Reales y Ranuras Magnéticas */}
        <div
          ref={establoRef}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: terminado
              ? 'radial-gradient(circle at center, #fffbeb 30%, #fef3c7 70%, #d97706 100%)'
              : 'radial-gradient(circle at center, #ffffff 40%, #fef2f2 100%)',
            border: 'clamp(3px, 0.8vmin, 6px) solid var(--fondo-2)',
            borderRadius: 'var(--radio)',
            padding: 'clamp(14px, 2.5vmin, 22px)',
            width: 'min(92vw, 440px)',
            boxShadow: terminado ? '0 0 32px rgba(245, 158, 11, 0.8)' : 'var(--sombra)',
            transition: 'all 500ms ease',
            transform: arrastrando ? 'scale(1.03)' : 'scale(1)',
          }}
        >
          {/* Figuras dentro del establo: María, Jesús y José */}
          <div
            style={{
              display: 'flex',
              gap: 'clamp(10px, 2.5vmin, 20px)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                opacity: colocadas.includes('mary') ? 1 : 0.3,
                transform: colocadas.includes('mary') ? 'scale(1.05)' : 'scale(0.92)',
                transition: 'all 300ms ease',
              }}
            >
              <Tarjeta img="u4-mary" emoji="🌹" audio="Mother Mary!" />
            </div>
            <div
              style={{
                width: 76,
                height: 76,
                opacity: colocadas.includes('jesus') ? 1 : 0.3,
                transform: colocadas.includes('jesus') ? 'scale(1.05)' : 'scale(0.92)',
                transition: 'all 300ms ease',
              }}
            >
              <Tarjeta img="u4-jesus" emoji="👶" audio="Baby Jesus!" />
            </div>
            <div
              style={{
                width: 76,
                height: 76,
                opacity: colocadas.includes('joseph') ? 1 : 0.3,
                transform: colocadas.includes('joseph') ? 'scale(1.05)' : 'scale(0.92)',
                transition: 'all 300ms ease',
              }}
            >
              <Tarjeta img="u4-joseph" emoji="🪵" audio="Saint Joseph!" />
            </div>
          </div>

          <p className="frase-chica" style={{ fontSize: 13, opacity: 0.75, marginTop: 8 }}>
            Drag or tap the figure to place it in the Nativity!
          </p>
        </div>

        {/* Tarjetas inferiores para arrastrar o tocar */}
        <div className="fila" style={{ marginTop: 8 }}>
          {FIGURAS.map((f) => {
            const colocada = colocadas.includes(f.id)
            const esArrastrado = arrastrando === f.id
            return (
              <div
                key={f.id}
                className="ficha"
                onPointerDown={(e) => iniciarArrastre(f.id, e)}
                onPointerUp={(e) => soltarArrastre(f, e)}
                style={{
                  touchAction: 'none',
                  userSelect: 'none',
                  cursor: colocada ? 'default' : 'grab',
                  transform: esArrastrado ? 'scale(1.15) rotate(-4deg)' : 'none',
                  transition: esArrastrado ? 'none' : 'transform 180ms ease',
                  zIndex: esArrastrado ? 40 : 1,
                  opacity: colocada ? 0.4 : 1,
                }}
              >
                <Tarjeta
                  img={f.img}
                  emoji={f.emoji}
                  hecha={colocada}
                  audio={f.nombre}
                />
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 700 }}>
                  {f.nombre}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Marco>
  )
}
