import { useEffect } from 'react'
import { decir, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

export type Actividad = 'story' | 'move' | 'challenge'

const FICHAS: { id: Actividad; img: string; emoji: string; en: string }[] = [
  { id: 'story', img: 'plan-story', emoji: '📖', en: 'The story' },
  { id: 'move', img: 'plan-move', emoji: '🏃', en: 'Move it' },
  { id: 'challenge', img: 'plan-challenge', emoji: '🏆', en: 'The challenge' },
]

export function Plan({
  hechas,
  onElegir,
  onPanel,
  onInicio,
}: {
  hechas: Actividad[]
  onElegir: (a: Actividad) => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const pendientes = FICHAS.filter((f) => !hechas.includes(f.id))

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(350)
      if (cancelado) return
      if (pendientes.length === 1) {
        await decir('And now, the last one!')
      } else if (hechas.length === 1) {
        await decir('What is next, Captain?')
      } else {
        await decir('What do we do first?')
      }
    })()
    return () => {
      cancelado = true
    }
  }, [hechas.length, pendientes.length])

  return (
    <Marco paso={hechas.length} total={3} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <p className="frase-chica">You choose, Captain.</p>
        <div className="fila">
          {FICHAS.map((f) => {
            const hecha = hechas.includes(f.id)
            return (
              <div key={f.id} className="ficha">
                <Tarjeta
                  img={f.img}
                  emoji={hecha ? '✅' : f.emoji}
                  hecha={hecha}
                  onClick={hecha ? undefined : () => onElegir(f.id)}
                />
                <span className="frase-chica">{f.en}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Marco>
  )
}
