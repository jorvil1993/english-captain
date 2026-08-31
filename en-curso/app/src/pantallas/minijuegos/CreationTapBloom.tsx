import { useEffect, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien, estrellitas, toque } from '../../audio/sonidos'
import { Tarjeta } from '../../componentes/Tarjeta'
import { Marco } from '../../componentes/Marco'

type ElementoCreacion = {
  id: string
  nombre: string
  sonido: string
  emoji: string
  animacion: string
  img: string
}

const ELEMENTOS: ElementoCreacion[] = [
  { id: 'sun', nombre: 'Sun', sonido: 'God made the golden sun!', emoji: '☀️', animacion: '☀️ 🕊️ 🕊️', img: 'u3-sun' },
  { id: 'water', nombre: 'Water', sonido: 'Water! Splash splash!', emoji: '🌊', animacion: '🌊 🐟 🐠', img: 'u3-water' },
  { id: 'tree', nombre: 'Tree', sonido: 'Green trees and sweet fruits!', emoji: '🌳', animacion: '🌳 🍎 🍃', img: 'u3-tree' },
  { id: 'flowers', nombre: 'Flowers', sonido: 'Beautiful colorful flowers!', emoji: '🌸', animacion: '🌸 🌺 🌻', img: 'u3-flowers' },
]

export function CreationTapBloom({ onVolver, onPanel }: { onVolver: () => void; onPanel: () => void }) {
  const [descubiertos, setDescubiertos] = useState<string[]>([])
  const [activo, setActivo] = useState<ElementoCreacion | null>(null)
  const [bloqueado, setBloqueado] = useState(false)
  const [terminado, setTerminado] = useState(false)

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(300)
      if (cancelado) return
      await decir('God made the world! Tap to create!')
    })()
    return () => {
      cancelado = true
    }
  }, [])

  const tocarElemento = async (el: ElementoCreacion) => {
    if (bloqueado) return
    setBloqueado(true)
    toque()
    setActivo(el)

    const nuevas = descubiertos.includes(el.id) ? descubiertos : [...descubiertos, el.id]
    setDescubiertos(nuevas)

    await decir(el.sonido)
    await esperar(300)

    if (nuevas.length >= ELEMENTOS.length && !terminado) {
      setTerminado(true)
      bien()
      estrellitas()
      await decir('God saw that it was good! Amen!')
      await esperar(500)
      await decir('Good job! God loves you!')
      await esperar(500)
      onVolver()
    } else {
      setBloqueado(false)
    }
  }

  return (
    <Marco paso={descubiertos.length} total={ELEMENTOS.length} onPanel={onPanel} onInicio={onVolver}>
      <div className="pantalla">
        <p className="frase">Creation Tap & Bloom</p>

        {/* El Jardín de la Creación Interactivo */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: terminado
              ? 'radial-gradient(circle at center, #f0fdf4 30%, #dcfce7 70%, #86efac 100%)'
              : 'radial-gradient(circle at center, #ffffff 40%, #f0fdf4 100%)',
            border: 'clamp(3px, 0.8vmin, 6px) solid var(--fondo-2)',
            borderRadius: 'var(--radio)',
            padding: 'clamp(14px, 2.5vmin, 22px)',
            width: 'min(92vw, 420px)',
            minHeight: 150,
            boxShadow: terminado ? '0 0 32px rgba(34, 197, 94, 0.6)' : 'var(--sombra)',
            transition: 'all 500ms ease',
          }}
        >
          {/* Ilustración de la creación */}
          <div style={{ width: 80, height: 80, marginBottom: 6 }}>
            <Tarjeta img="u3-beautiful" emoji="🌎" />
          </div>

          <p className="frase" style={{ fontSize: 'clamp(17px, 3.2vmin, 22px)', margin: 0 }}>
            {activo ? activo.animacion : 'God made our world! 🌎'}
          </p>

          <p className="frase-chica" style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            Tap the elements to make nature bloom!
          </p>
        </div>

        {/* 4 Elementos de la Creación */}
        <div className="fila" style={{ flexWrap: 'wrap', maxWidth: 'min(90vw, 400px)', marginTop: 8 }}>
          {ELEMENTOS.map((el) => {
            const descubierto = descubiertos.includes(el.id)
            return (
              <div key={el.id} className="ficha">
                <Tarjeta
                  img={el.img}
                  emoji={el.emoji}
                  elegida={activo?.id === el.id}
                  hecha={descubierto}
                  onClick={() => void tocarElemento(el)}
                />
                <span className="frase-chica" style={{ fontSize: 13, fontWeight: 700 }}>
                  {el.nombre}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Marco>
  )
}
