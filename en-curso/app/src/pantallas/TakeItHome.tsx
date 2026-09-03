import { useEffect, useState } from 'react'
import type { Unidad } from '../datos/tipos'
import { decir, decirEs, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

type MisionDeHoy = { en: string; es: string; emoji: string; img: string }

export function TakeItHome({
  unidad,
  mision,
  onListo,
  onPanel,
  onInicio,
}: {
  unidad: Unidad
  /** La misión usa una frase de la lección actual, no un lema de unidad que
   * José todavía no ha conocido. */
  mision?: MisionDeHoy
  paso?: number
  onListo: () => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const [listo, setListo] = useState(false)
  const misionActiva = mision ?? { ...unidad.mision, img: `mision-${unidad.id}` }

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(450)
      if (cancelado) return
      await decir('Your mission!')
      if (cancelado) return
      await esperar(300)
      await decir(misionActiva.en)
      if (cancelado) return
      await esperar(600)
      await decirEs(misionActiva.es)
      if (cancelado) return
      setListo(true)
      await esperar(1300)
      if (!cancelado) onListo()
    })()
    return () => {
      cancelado = true
    }
  }, [misionActiva.en, misionActiva.es])

  return (
    <Marco paso={0} total={0} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <Tarjeta img={misionActiva.img} emoji={misionActiva.emoji} grande audio={misionActiva.en} />
        <p className="frase">{misionActiva.en}</p>
        <p className="frase-chica">{misionActiva.es}</p>
        {listo && <p className="frase-chica">✨</p>}
      </div>
    </Marco>
  )
}
