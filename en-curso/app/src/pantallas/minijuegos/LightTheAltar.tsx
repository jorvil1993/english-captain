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
  { id: 'candle-1', nombre: 'First Candle', orden: 'Light the candle!', sonido: 'Light! Shine bright!', emoji: '🕯️', img: 'u5-light' },
  { id: 'candle-2', nombre: 'Second Candle', orden: 'Light another candle!', sonido: 'Fire! Warm and bright!', emoji: '🕯️', img: 'u5-light' },
  { id: 'candle-3', nombre: 'Third Candle', orden: 'Light the altar candle!', sonido: 'Let your light shine!', emoji: '🕯️', img: 'u5-light' },
]

export function LightTheAltar({ onVolver, onPanel }: { onVolver: () => void; onPanel: () => void }) {
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
      await decir('Let your light shine!')
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
      reiniciarInactividad('Light another candle!')
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
    <Marco paso={encendidas.length} total={VELAS.length} onPanel={onPanel} onInicio={onVolver}>
      <div
        className="pantalla"
        onPointerMove={moverArrastreLlama}
        style={{ touchAction: 'none' }}
      >
        <p className="frase">Light the Altar</p>

        {/* Escena del Altar con Cruz Dorada Celestial */}
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
            padding: 'clamp(14px, 2.5vmin, 22px)',
            width: 'min(92vw, 420px)',
            boxShadow: terminado ? '0 0 36px rgba(245, 158, 11, 0.9)' : 'var(--sombra)',
            transition: 'all 500ms ease',
          }}
        >
          {/* Ilustración de la Cruz del Altar */}
          <div style={{ width: 88, height: 88, marginBottom: 8 }}>
            <Tarjeta img="altar-scene" emoji="✝️" />
          </div>

          <p className="frase" style={{ fontSize: 'clamp(17px, 3.2vmin, 22px)', margin: 0 }}>
            {terminado ? 'Thank you, Jesus!' : 'Let your light shine!'}
          </p>

          <p className="frase-chica" style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            Drag the flame 🔥 or tap each candle!
          </p>
        </div>

        {/* Las 3 Velas del Altar para encender */}
        <div className="fila" style={{ marginTop: 8 }}>
          {VELAS.map((v, i) => {
            const prendida = encendidas.includes(v.id)
            return (
              <div key={v.id} className="ficha">
                <Tarjeta
                  img="u5-light"
                  emoji={prendida ? '🔥' : '🕯️'}
                  elegida={prendida}
                  onClick={prendida || bloqueado ? undefined : () => void encender(v)}
                />
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 700 }}>
                  {prendida ? '✨ Shining!' : `Candle ${i + 1}`}
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
