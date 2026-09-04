import { useEffect, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { campanaIglesia, estrellitas, toque } from '../../audio/sonidos'
import { chispita, paz } from '../../audio/sonidos-extra'
import { Marco } from '../../componentes/Marco'
import './motor/estilos.css'

type VelaId = 'izq' | 'centro' | 'der'

type VelaAltar = {
  id: VelaId
  nombre: string
  x: number
  y: number
  alto: number
}

const VELAS_POS: VelaAltar[] = [
  { id: 'izq', nombre: 'Left candle', x: 22, y: 38, alto: 68 },
  { id: 'centro', nombre: 'Center candle', x: 50, y: 32, alto: 82 },
  { id: 'der', nombre: 'Right candle', x: 78, y: 38, alto: 68 },
]

export function LightTheAltar({
  onVolver,
  onPanel,
  onInicio,
}: {
  onVolver: () => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const [nivel, setNivel] = useState<1 | 2 | 3>(1)
  const [encendidas, setEncendidas] = useState<Set<VelaId>>(new Set())
  const [bloqueado, setBloqueado] = useState(true)
  const [mostrarGuia, setMostrarGuia] = useState(true)
  const [celebrando, setCelebrando] = useState(false)

  // Cirio que sostiene el dedo del jugador
  const [posCirio, setPosCirio] = useState<{ x: number; y: number }>({ x: 50, y: 78 })
  const [arrastrandoCirio, setArrastrandoCirio] = useState(false)

  const abortarRef = useRef(false)
  const escenaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    abortarRef.current = false
    void (async () => {
      await esperar(350)
      if (abortarRef.current) return
      await decir('Look at the holy altar.')
      if (abortarRef.current) return
      await esperar(200)
      await decir('Light the candle!')
      setBloqueado(false)
    })()

    return () => {
      abortarRef.current = true
    }
  }, [])

  const encenderVela = async (id: VelaId) => {
    if (bloqueado || encendidas.has(id)) return
    setMostrarGuia(false)
    toque()
    campanaIglesia()
    chispita()

    const nuevoSet = new Set(encendidas)
    nuevoSet.add(id)
    setEncendidas(nuevoSet)

    // ── NIVEL 1: Encender la primera vela ───────────────────────────
    if (nivel === 1) {
      setBloqueado(true)
      await esperar(400)
      estrellitas()
      await decir('Here is the candle.')
      await esperar(500)
      setNivel(2)
      setEncendidas(new Set())
      setPosCirio({ x: 50, y: 78 })
      await decir('Light the candle!')
      setBloqueado(false)
      return
    }

    // ── NIVEL 2 y 3: Encender las 3 velas del altar ─────────────────
    if (nuevoSet.size < 3) {
      // Falta encender las demás
      return
    }

    // Se encendieron las 3 velas: Gloria y bendición
    setBloqueado(true)
    setCelebrando(true)
    await esperar(500)
    estrellitas()
    paz()
    await decir('The altar is ready for Mass.')
    await esperar(600)
    await decir('Thank you, Jesus! Amen!')
    await esperar(1200)
    onVolver()
  }

  // Manejo de arrastre continuo del cirio con el puntero
  const actualizarPuntero = (clientX: number, clientY: number) => {
    if (!escenaRef.current) return
    const rect = escenaRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setPosCirio({ x: Math.max(10, Math.min(90, x)), y: Math.max(20, Math.min(85, y)) })

    // Detectar colisión de la llama con alguna mecha
    for (const v of VELAS_POS) {
      const dx = Math.abs(x - v.x)
      const dy = Math.abs(y - (v.y - 4))
      if (dx < 12 && dy < 14) {
        void encenderVela(v.id)
      }
    }
  }

  return (
    <Marco paso={nivel} total={3} onPanel={onPanel} onInicio={onInicio}>
      <div className="mjx-pantalla" style={{ background: 'radial-gradient(ellipse at 50% 25%, #fffdf7 0%, #ecdcc2 100%)' }}>
        {/* Cabecera con Nivel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 520, padding: '0 12px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--verde)', background: 'rgba(27,107,74,0.1)', padding: '3px 10px', borderRadius: 12 }}>
            Level {nivel} of 3 {nivel === 1 ? '· Light One Candle' : '· Holy Altar Lighting ⭐⭐⭐'}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tinta-suave)' }}>
            🕯️ Light the Altar
          </span>
        </div>

        {/* Escenario del Altar */}
        <div
          ref={escenaRef}
          onPointerDown={(e) => {
            setArrastrandoCirio(true)
            actualizarPuntero(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => {
            if (arrastrandoCirio) actualizarPuntero(e.clientX, e.clientY)
          }}
          onPointerUp={() => setArrastrandoCirio(false)}
          onPointerCancel={() => setArrastrandoCirio(false)}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 520,
            height: 'clamp(290px, 50vmin, 390px)',
            margin: '12px 0',
            background: 'linear-gradient(180deg, #2b1f3d 0%, #4a3b5c 50%, #20172e 100%)',
            borderRadius: 24,
            border: '4px solid #d4af37',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            touchAction: 'none',
            cursor: 'crosshair',
          }}
        >
          {/* Luz celestial de fondo sobre el sagrario */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              width: 200,
              height: 200,
              background: encendidas.size > 0
                ? 'radial-gradient(circle, rgba(255, 235, 150, 0.45) 0%, rgba(255, 215, 0, 0) 70%)'
                : 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              transition: 'background 400ms ease',
            }}
          />

          {/* Cruz Sagrada en el centro del altar */}
          <div
            style={{
              position: 'absolute',
              top: '14%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 44,
              filter: encendidas.size > 0 ? 'drop-shadow(0 0 16px #ffd700)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              pointerEvents: 'none',
              transition: 'filter 300ms ease',
            }}
          >
            ✝️
          </div>

          {/* Mesa de mármol del altar */}
          <div
            style={{
              position: 'absolute',
              bottom: '22%',
              left: '8%',
              right: '8%',
              height: 48,
              background: 'linear-gradient(180deg, #f8f6f0 0%, #e2dcd0 100%)',
              borderTop: '5px solid #d4af37',
              borderRadius: '6px 6px 0 0',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Mantel con bordado de cruz */}
            <span style={{ fontSize: 18, color: '#c49a45', letterSpacing: 8 }}>
              ✦ ✦ ✦
            </span>
          </div>

          {/* Base del altar inferior */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '12%',
              right: '12%',
              height: '22%',
              background: 'linear-gradient(180deg, #6e5d48 0%, #46392b 100%)',
              borderTop: '3px solid #8e7a62',
            }}
          />

          {/* Las 3 Velas en el altar */}
          {VELAS_POS.map((v) => {
            const prendida = encendidas.has(v.id)

            return (
              <div
                key={v.id}
                onClick={() => void encenderVela(v.id)}
                style={{
                  position: 'absolute',
                  top: `${v.y}%`,
                  left: `${v.x}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 4,
                }}
              >
                {/* Llama viva si está encendida */}
                {prendida ? (
                  <div
                    style={{
                      width: 22,
                      height: 32,
                      background: 'radial-gradient(ellipse at 50% 70%, #ffffff 0%, #ffe600 40%, #ff5e00 80%, transparent 100%)',
                      borderRadius: '50% 50% 35% 35%',
                      filter: 'drop-shadow(0 0 14px #ffaa00)',
                      animation: 'mjx-rebote-suave 400ms infinite ease-in-out',
                      marginBottom: 2,
                    }}
                  />
                ) : (
                  /* Mecha apagada */
                  <div style={{ width: 3, height: 10, background: '#222', marginBottom: 2 }} />
                )}

                {/* Vela blanca con candelabro dorado */}
                <div
                  style={{
                    width: 24,
                    height: v.alto,
                    background: 'linear-gradient(90deg, #ffffff 0%, #f0ede6 70%, #d8d3c5 100%)',
                    borderRadius: '4px 4px 0 0',
                    border: '1px solid #ccc',
                    boxShadow: prendida ? '0 0 18px rgba(255, 215, 0, 0.7)' : '0 4px 8px rgba(0,0,0,0.3)',
                    transition: 'box-shadow 300ms ease',
                  }}
                />

                {/* Candelabro dorado inferior */}
                <div
                  style={{
                    width: 38,
                    height: 14,
                    background: 'linear-gradient(180deg, #ffd700 0%, #996515 100%)',
                    borderRadius: '4px 4px 8px 8px',
                    border: '1px solid #d4af37',
                  }}
                />
              </div>
            )
          })}

          {/* Cirio de mano que sostiene el dedo */}
          <div
            style={{
              position: 'absolute',
              top: `${posCirio.y}%`,
              left: `${posCirio.x}%`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Llama encendida del cirio */}
            <div
              style={{
                width: 26,
                height: 38,
                background: 'radial-gradient(ellipse at 50% 70%, #ffffff 0%, #ffe600 35%, #ff5722 80%, transparent 100%)',
                borderRadius: '50% 50% 40% 40%',
                filter: 'drop-shadow(0 0 16px #ff9800)',
                animation: 'mjx-rebote-suave 500ms infinite ease-in-out',
              }}
            />
            {/* Cuerpo del cirio */}
            <div
              style={{
                width: 20,
                height: 52,
                background: 'linear-gradient(90deg, #fff 0%, #f7ecd5 100%)',
                borderRadius: '3px 3px 6px 6px',
                border: '1px solid #c9b08b',
                boxShadow: '0 6px 14px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Manita tutorial animada en Nivel 1 */}
          {mostrarGuia && nivel === 1 && encendidas.size === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '52%',
                left: '50%',
                fontSize: 38,
                pointerEvents: 'none',
                animation: 'mjx-rebote-suave 1.2s infinite ease-in-out',
                zIndex: 15,
              }}
            >
              👆 Drag to light!
            </div>
          )}

          {/* Celebración de luz final */}
          {celebrando && (
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
              <div style={{ fontSize: 52, marginBottom: 8 }}>✨ 🕯️ ✝️ 🕊️</div>
              <p className="frase" style={{ color: 'var(--verde)', fontSize: 26, margin: '4px 0' }}>
                Thank you, Jesus!
              </p>
              <p className="frase-chica">The altar is ready for Holy Mass!</p>
            </div>
          )}
        </div>

        <p className="mjx-pie" style={{ fontWeight: 800 }}>
          {nivel === 1 && '👉 Drag your candle to light the altar! 🕯️'}
          {nivel >= 2 && `⭐ Light all 3 candles for Jesus! (${encendidas.size}/3)`}
        </p>
      </div>
    </Marco>
  )
}
