import { useEffect, useMemo, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, estrellitas, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Marco } from '../../componentes/Marco'

type PasoOveja = {
  id: string
  frase: string
  orden: string
  emoji: string
  img: string
}

/** Este era un arca con lion/dove nuevos y sin vínculo con el cuento de la
 * unidad. Ahora es la misma aventura del Buen Pastor: reconocer la oveja,
 * seguir y celebrar que fue encontrada. Todas las frases ya se oyeron antes. */
const PASOS: PasoOveja[] = [
  { id: 'lost', frase: 'The sheep is lost.', orden: 'Find the sheep!', emoji: '🔍', img: 'u2-sheep' },
  { id: 'follow', frase: 'Follow me.', orden: 'Follow the Shepherd!', emoji: '👣', img: 'u2-shepherd' },
  { id: 'found', frase: 'He finds the sheep!', orden: 'Find the sheep!', emoji: '🤗', img: 'u2-sheep' },
]

function mezclar<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function NoahsPairMatch({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const [paso, setPaso] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [elegido, setElegido] = useState<string | null>(null)
  const [wobbleId, setWobbleId] = useState<string | null>(null)
  const [guiando, setGuiando] = useState(false)
  const [arrastrando, setArrastrando] = useState<string | null>(null)
  const [posicionArrastre, setPosicionArrastre] = useState({ x: 0, y: 0 })
  const arcaRef = useRef<HTMLDivElement>(null)
  const timerInactividad = useRef<number | null>(null)

  const objetivo = PASOS[paso % PASOS.length]

  const opciones = useMemo(() => {
    return mezclar(PASOS)
  }, [paso])

  const reiniciarInactividad = (texto: string) => {
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    timerInactividad.current = window.setTimeout(async () => {
      setGuiando(true)
      await decir(texto)
    }, 4500)
  }

  useEffect(() => {
    let cancelado = false
    setElegido(null)
    setWobbleId(null)
    setBloqueado(true)
    setGuiando(false)
    setArrastrando(null)

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

  const procesarSeleccion = async (item: PasoOveja) => {
    if (bloqueado) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    setBloqueado(true)

    // No se nombra un animal ajeno: se repite la frase exacta que el niño
    // acaba de practicar y su imagen limpia.
    await decir(item.frase)

    if (item.id === objetivo.id) {
      setElegido(item.id)
      bien()
      await esperar(300)
      if (paso + 1 < PASOS.length) {
        setPaso(paso + 1)
      } else {
        estrellitas()
        await decir('He finds the sheep!')
        await esperar(400)
        await decir('I love you.')
        await esperar(500)
        onVolver()
      }
    } else {
      toque()
      setWobbleId(item.id)
      await esperar(400)
      setWobbleId(null)
      await decir(objetivo.orden)
      setBloqueado(false)
      reiniciarInactividad(objetivo.orden)
    }
  }

  // Manejadores de Arrastre Táctil (Drag & Drop)
  const iniciarArrastre = (id: string, e: React.PointerEvent) => {
    if (bloqueado) return
    setArrastrando(id)
    setPosicionArrastre({ x: e.clientX, y: e.clientY })
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const moverArrastre = (e: React.PointerEvent) => {
    if (!arrastrando) return
    setPosicionArrastre({ x: e.clientX, y: e.clientY })
  }

  const soltarArrastre = (an: PasoOveja, e: React.PointerEvent) => {
    if (!arrastrando) return
    const dropX = e.clientX
    const dropY = e.clientY
    setArrastrando(null)

    // Si se soltó cerca del Arca o fue un toque directo
    if (arcaRef.current) {
      const rect = arcaRef.current.getBoundingClientRect()
      const dentroArca =
        dropX >= rect.left - 40 &&
        dropX <= rect.right + 40 &&
        dropY >= rect.top - 40 &&
        dropY <= rect.bottom + 40

      if (dentroArca) {
        void procesarSeleccion(an)
        return
      }
    }

    // Si fue un toque simple sin desplazamiento
    void procesarSeleccion(an)
  }

  return (
    <Marco paso={paso} total={PASOS.length} onPanel={onPanel} onInicio={onInicio}>
      <div
        className="pantalla"
        onPointerMove={moverArrastre}
        style={{ touchAction: 'none' }}
      >
        <p className="frase">Help the Lost Sheep</p>

        {/* La casa del Pastor es el destino: no mezclamos el Arca de Noé con
            el cuento de la oveja perdida. */}
        <div
          ref={arcaRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'radial-gradient(circle at center, #ffffff 40%, #e0f2fe 100%)',
            border: 'clamp(3px, 0.8vmin, 6px) solid var(--fondo-2)',
            borderRadius: 'var(--radio)',
            padding: 'clamp(12px, 2vmin, 18px)',
            width: 'min(90vw, 360px)',
            boxShadow: 'var(--sombra)',
            transition: 'transform 200ms ease',
            transform: arrastrando ? 'scale(1.04)' : 'scale(1)',
          }}
        >
          <div style={{ width: 80, height: 80, marginBottom: 4 }}>
            <Tarjeta img="u2-shepherd" emoji="🏠" audio={objetivo.orden} />
          </div>
          <p className="frase" style={{ fontSize: 'clamp(17px, 3.2vmin, 22px)', margin: 0 }}>
            {objetivo.orden}
          </p>
          <p className="frase-chica" style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>
            Tap the picture that helps the sheep get home!
          </p>
        </div>

        {/* Fila de pasos del cuento con soporte Drag & Drop */}
        <div className="fila" style={{ marginTop: 8 }}>
          {opciones.map((an) => {
            const esElArrastrado = arrastrando === an.id
            return (
              <div
                key={an.id}
                className="ficha"
                onPointerDown={(e) => iniciarArrastre(an.id, e)}
                onPointerUp={(e) => soltarArrastre(an, e)}
                style={{
                  touchAction: 'none',
                  userSelect: 'none',
                  cursor: 'grab',
                  transform: esElArrastrado ? 'scale(1.15) rotate(4deg)' : 'none',
                  transition: esElArrastrado ? 'none' : 'transform 180ms ease',
                  zIndex: esElArrastrado ? 40 : 1,
                }}
              >
                <Tarjeta
                  img={an.img}
                  emoji={an.emoji}
                  elegida={elegido === an.id}
                  wobble={wobbleId === an.id}
                  guiando={guiando && an.id === objetivo.id}
                  audio={an.frase}
                />
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 700 }}>
                  {an.frase}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Marco>
  )
}
