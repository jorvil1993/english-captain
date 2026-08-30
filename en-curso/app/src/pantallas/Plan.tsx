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

/**
 * EL PLAN. La pantalla más importante para el temperamento de José.
 *
 * Él es colérico primario: necesita mandar, necesita saber el plan y le da
 * ansiedad que se lo cambien de golpe (perfil §1). La respuesta de diseño no es
 * quitarle el control, es dárselo por adelantado y encauzado: ve las tres
 * cosas que hay que hacer y ELIGE el orden. La app no cede en QUÉ se hace —eso
 * está decidido— pero le entrega entero el CÓMO se ordena.
 *
 * Es exactamente el consejo que ya está en su perfil para prevenir berrinches:
 * "control sano y protagonismo canalizado antes de que lo tome por la fuerza".
 */
export function Plan({
  hechas,
  onElegir,
  onPanel,
}: {
  hechas: Actividad[]
  onElegir: (a: Actividad) => void
  onPanel: () => void
}) {
  const pendientes = FICHAS.filter((f) => !hechas.includes(f.id))

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(350)
      if (cancelado) return
      await decir(pendientes.length === 1 ? 'And now, the last one!' : 'What do we do first?')
    })()
    return () => {
      cancelado = true
    }
    // Solo al cambiar cuántas quedan, no en cada render.
  }, [pendientes.length])

  return (
    <Marco paso={1 + hechas.length} total={6} onPanel={onPanel}>
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
