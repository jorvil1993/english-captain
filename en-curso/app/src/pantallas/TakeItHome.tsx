import { useEffect, useState } from 'react'
import type { Unidad } from '../datos/tipos'
import { decir, decirEs, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

/**
 * TAKE IT HOME — la misión fuera de la pantalla.
 *
 * Es la actividad más importante de la sesión y la única que no ocurre en la
 * tablet. La app termina EMPUJÁNDOLO afuera: a decirle algo a mamá, a buscar
 * algo azul en su cuarto, a decir "thank you, God" en la cena.
 *
 * Dos razones. Una: la transferencia a la vida real es lo único que cuenta como
 * aprendizaje de verdad, y es exactamente lo que la pantalla hace peor por sí
 * sola (el "transfer deficit", §1.2). Dos: obliga a una conversación con papá o
 * mamá, que es el multiplicador más grande que existe (§1.2, §1.10) y la única
 * forma de que esto no sea una niñera electrónica.
 *
 * Acá el español SÍ se dice completo, sin que lo pida. Es la única pantalla
 * donde la misión tiene que quedar entendida sí o sí.
 */
export function TakeItHome({
  unidad,
  paso,
  onListo,
  onPanel,
}: {
  unidad: Unidad
  paso: number
  onListo: () => void
  onPanel: () => void
}) {
  const [listo, setListo] = useState(false)

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(450)
      if (cancelado) return
      await decir('Your mission!')
      if (cancelado) return
      await esperar(300)
      await decir(unidad.mision.en)
      if (cancelado) return
      await esperar(600)
      await decirEs(unidad.mision.es)
      if (cancelado) return
      setListo(true)
    })()
    return () => {
      cancelado = true
    }
  }, [unidad])

  return (
    <Marco paso={paso} total={6} ayudaEs={unidad.mision.es} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta img={`mision-${unidad.id}`} emoji={unidad.mision.emoji} grande />
        <p className="frase">{unidad.mision.en}</p>
        <p className="frase-chica">{unidad.mision.es}</p>
        {listo && (
          <Boton tono="oro" invita onClick={onListo}>
            GO!
          </Boton>
        )}
      </div>
    </Marco>
  )
}
