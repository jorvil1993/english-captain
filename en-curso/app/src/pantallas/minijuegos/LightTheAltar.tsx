import { useEffect, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, campanaIglesia, estrellitas, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Marco } from '../../componentes/Marco'

type VelaAltar = {
  id: string
  nombre: string
  orden: string
  sonido: string
  emoji: string
  img: string
}

const VELAS: VelaAltar[] = [
  // Una sola vela: a esta edad el objetivo es comprender candle → altar →
  // encender, no contar tres objetos iguales ni tocar por tocar.
  { id: 'candle', nombre: 'Candle', orden: 'Light the candle!', sonido: 'Here is the candle.', emoji: '🕯️', img: 'u6-candle' },
]

export function LightTheAltar({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const [encendidas, setEncendidas] = useState<string[]>([])
  const [bloqueado, setBloqueado] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const [llamaArrastrando, setLlamaArrastrando] = useState(false)
  const [posLlama, setPosLlama] = useState({ x: 0, y: 0 })
  const altarRef = useRef<HTMLDivElement>(null)
  const timerInactividad = useRef<number | null>(null)

  const reiniciarInactividad = (texto: string) => {
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    timerInactividad.current = window.setTimeout(async () => {
      await decir(texto)
    }, 4500)
  }

  useEffect(() => {
    let cancelado = false
    setBloqueado(true)

    void (async () => {
      await esperar(300)
      if (cancelado) return
      await decir('Here is the candle.')
      if (cancelado) return
      await decir('Look at the holy altar.')
      if (cancelado) return
      await decir('Light the candle!')
      if (cancelado) return
      setBloqueado(false)
      reiniciarInactividad('Light the candle!')
    })()

    return () => {
      cancelado = true
      if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    }
  }, [])

  const encender = async (v: VelaAltar) => {
    if (bloqueado || encendidas.includes(v.id)) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setBloqueado(true)

    campanaIglesia()
    const nuevas = [...encendidas, v.id]
    setEncendidas(nuevas)
    await decir(v.sonido)
    await esperar(300)

    if (nuevas.length >= VELAS.length) {
      setTerminado(true)
      estrellitas()
      await decir('Thank you, Jesus! Amen!')
      await esperar(500)
      await decir('Good job! God loves you!')
      await esperar(500)
      onVolver()
    } else {
      setBloqueado(false)
      reiniciarInactividad('Light the candle!')
    }
  }

  const iniciarArrastreLlama = (e: React.PointerEvent) => {
    if (bloqueado) return
    setLlamaArrastrando(true)
    setPosLlama({ x: e.clientX, y: e.clientY })
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const moverArrastreLlama = (e: React.PointerEvent) => {
    if (!llamaArrastrando) return
    setPosLlama({ x: e.clientX, y: e.clientY })
  }

  const soltarArrastreLlama = (e: React.PointerEvent) => {
    if (!llamaArrastrando) return
    setLlamaArrastrando(false)
    const proximaVela = VELAS.find((v) => !encendidas.includes(v.id))
    if (proximaVela) {
      void encender(proximaVela)
    }
  }

  return (
    <Marco paso={encendidas.length} total={VELAS.length} onPanel={onPanel} onInicio={onInicio}>
      <div
        className="pantalla"
        onPointerMove={moverArrastreLlama}
        style={{ touchAction: 'none' }}
      >
        <p className="frase">Light the Altar</p>

        {/* Escena del Altar con Cruz Dorada Celestial (Encabezado General) */}
        <div
          ref={altarRef}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: terminado
              ? 'radial-gradient(circle at center, #fffbeb 30%, #fef3c7 70%, #f59e0b 100%)'
              : 'radial-gradient(circle at center, #ffffff 40%, #fef9c3 100%)',
            border: 'clamp(3px, 0.8vmin, 6px) solid var(--fondo-2)',
            borderRadius: 'var(--radio)',
            padding: 'clamp(12px, 2vmin, 18px)',
            width: 'min(92vw, 420px)',
            boxShadow: terminado ? '0 0 36px rgba(245, 158, 11, 0.9)' : 'var(--sombra)',
            transition: 'all 500ms ease',
          }}
        >
          {/* Ilustración de la Escena del Altar */}
          <div style={{ width: 84, height: 84, marginBottom: 4 }}>
            <Tarjeta img="altar-scene" emoji="✝️" audio="Look at the holy altar." />
          </div>

          <p className="frase" style={{ fontSize: 'clamp(17px, 3.2vmin, 22px)', margin: 0 }}>
            {terminado ? 'Thank you, Jesus!' : 'Look at the holy altar.'}
          </p>

          <p className="frase-chica" style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            Drag the flame 🔥 to the candle!
          </p>
        </div>

        {/* La vela sola aparece en primer plano antes de volver al altar. */}
        <div className="fila" style={{ marginTop: 8 }}>
          {VELAS.map((v, i) => {
            const prendida = encendidas.includes(v.id)
            return (
              <div
                key={v.id}
                className="ficha"
                style={{
                  transform: prendida ? 'scale(1.05)' : 'scale(0.96)',
                  transition: 'all 250ms ease',
                }}
              >
                <div
                  style={{
                    borderRadius: 'var(--radio)',
                    boxShadow: prendida ? '0 0 20px rgba(245, 158, 11, 0.85)' : 'none',
                    transition: 'box-shadow 300ms ease',
                  }}
                >
                  <Tarjeta
                    img={v.img}
                    emoji={prendida ? '🔥' : '🕯️'}
                    elegida={prendida}
                    onClick={prendida || bloqueado ? undefined : () => void encender(v)}
                    audio={v.orden}
                  />
                </div>
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 700 }}>
                  {prendida ? '✨ Shining!' : v.nombre}
                </span>
              </div>
            )
          })}
        </div>

        {/* Encendedor de llama táctil flotante */}
        {!terminado && (
          <div
            onPointerDown={iniciarArrastreLlama}
            onPointerUp={soltarArrastreLlama}
            style={{
              marginTop: 10,
              padding: '10px 20px',
              borderRadius: 30,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'grab',
              touchAction: 'none',
              userSelect: 'none',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              transform: llamaArrastrando ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 150ms ease',
            }}
          >
            <span style={{ fontSize: 24 }}>🔥</span>
            <span style={{ fontWeight: 800, fontSize: 14 }}>Drag Flame to Candle</span>
          </div>
        )}
      </div>
    </Marco>
  )
}
