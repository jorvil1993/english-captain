import { useEffect } from 'react'
import { decir, esperar } from '../audio/voz'
import { etiquetaDeParada, type Parada } from '../datos/recorrido'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

/**
 * La elección chica del recorrido: José elige el ORDEN de 2-3 paradas
 * consecutivas, nunca si las hace. Generaliza lo que antes era un array fijo
 * de story/move/challenge a cualquier bloque `modo: 'elegible'` del
 * recorrido de hoy (ver `datos/recorrido.ts`). Sin `onInicio`: esta parada
 * nunca se salta.
 */
export function Plan({
  paradas,
  hechas,
  onElegir,
  onPanel,
}: {
  paradas: Parada[]
  hechas: Parada[]
  onElegir: (p: Parada) => void
  onPanel: () => void
}) {
  const pendientes = paradas.filter((p) => !hechas.includes(p))

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
    <Marco paso={hechas.length} total={paradas.length} onPanel={onPanel}>
      <div className="pantalla">
        <p className="frase-chica">You choose, Captain.</p>
        <div className="fila">
          {paradas.map((p) => {
            const hecha = hechas.includes(p)
            const etiqueta = etiquetaDeParada(p)
            return (
              <div key={p.tipo} className="ficha">
                <Tarjeta
                  img={etiqueta.img}
                  emoji={hecha ? '✅' : etiqueta.emoji}
                  hecha={hecha}
                  onClick={hecha ? undefined : () => onElegir(p)}
                />
                <span className="frase-chica">{etiqueta.en}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Marco>
  )
}
