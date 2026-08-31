import { useEffect, useState } from 'react'
import type { Unidad } from '../datos/tipos'
import { decir, decirEs, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

export function TakeItHome({
  unidad,
  onListo,
  onPanel,
  onInicio,
}: {
  unidad: Unidad
  paso?: number
  onListo: () => void
  onPanel: () => void
  onInicio?: () => void
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
    <Marco paso={0} total={0} ayudaEs={unidad.mision.es} onPanel={onPanel} onInicio={onInicio}>
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
