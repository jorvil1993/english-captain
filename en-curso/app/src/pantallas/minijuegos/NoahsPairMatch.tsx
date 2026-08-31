import { useEffect, useMemo, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, estrellitas, sonidoAnimal, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Marco } from '../../componentes/Marco'

type AnimalArca = {
  id: string
  nombre: string
  orden: string
  emoji: string
  img: string
}

const ANIMALES: AnimalArca[] = [
  { id: 'lion', nombre: 'Lion', orden: 'Find the lion!', emoji: '🦁', img: 'u5-no-fear' },
  { id: 'sheep', nombre: 'Sheep', orden: 'Find the sheep!', emoji: '🐑', img: 'u2-sheep' },
  { id: 'dove', nombre: 'Dove', orden: 'Find the dove!', emoji: '🕊️', img: 'u6-peace' },
]

function mezclar<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function NoahsPairMatch({ onVolver, onPanel }: { onVolver: () => void; onPanel: () => void }) {
  const [paso, setPaso] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [elegido, setElegido] = useState<string | null>(null)
  const [wobbleId, setWobbleId] = useState<string | null>(null)
  const [guiando, setGuiando] = useState(false)
  const [arrastrando, setArrastrando] = useState<string | null>(null)
  const [posicionArrastre, setPosicionArrastre] = useState({ x: 0, y: 0 })
  const arcaRef = useRef<HTMLDivElement>(null)
  const timerInactividad = useRef<number | null>(null)

  const objetivo = ANIMALES[paso % ANIMALES.length]

  const opciones = useMemo(() => {
    return mezclar(ANIMALES)
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

  const procesarSeleccion = async (item: AnimalArca) => {
    if (bloqueado) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    setBloqueado(true)

    // Secuencia acústica natural: Sonido Real MP3 ➔ Nombre claro en inglés ("Lion!") ➔ Sonido Real MP3
    await sonidoAnimal(item.id)
    await decir(`${item.nombre}!`)
    await sonidoAnimal(item.id)

    if (item.id === objetivo.id) {
      setElegido(item.id)
      bien()
      await esperar(300)
      if (paso + 1 < ANIMALES.length) {
        setPaso(paso + 1)
      } else {
        estrellitas()
        await decir('Rainbow! Red, yellow, green, blue!')
        await esperar(400)
        await decir('All safe in the Ark! Good job!')
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

  const soltarArrastre = (an: AnimalArca, e: React.PointerEvent) => {
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
    <Marco paso={paso} total={ANIMALES.length} onPanel={onPanel} onInicio={onVolver}>
      <div
        className="pantalla"
        onPointerMove={moverArrastre}
        style={{ touchAction: 'none' }}
      >
        <p className="frase">Noah's Ark</p>

        {/* Barco Arca de Noé con Ilustración, Silueta receptora y Arcoíris */}
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
            <Tarjeta img="noah-ark" emoji="🚢" />
          </div>
          <p className="frase" style={{ fontSize: 'clamp(17px, 3.2vmin, 22px)', margin: 0 }}>
            {objetivo.orden}
          </p>
          <p className="frase-chica" style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>
            Drag or tap the animal to the Ark!
          </p>
        </div>

        {/* Fila de opciones de animales con soporte Drag & Drop */}
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
                />
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 700 }}>
                  {an.nombre}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Marco>
  )
}
