import { useEffect } from 'react'
import type { PlanDeOracion } from '../datos/oraciones-motor'
import { decir, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

/** Un pequeño eco de la frase de oración en medio del camino. No vuelve a
 * presentar toda la oración ni exige leer: la misma frase reaparece cuando
 * el niño ya ha hecho algo, para que se vuelva familiar por contexto. */
export function EcoOracion({
  plan,
  onListo,
  onPanel,
}: {
  plan: PlanDeOracion
  onListo: () => void
  onPanel: () => void
}) {
  const indice = plan.versoNuevo ?? plan.versosRepaso.at(-1) ?? 0
  const verso = plan.oracion.versos[indice]

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(350)
      if (cancelado) return
      await decir(verso)
      await esperar(1350)
      if (!cancelado) onListo()
    })()
    return () => {
      cancelado = true
    }
  }, [onListo, verso])

  return (
    <Marco paso={0} total={0} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta img={plan.oracion.img} emoji={plan.oracion.emoji} grande audio={verso} />
        <p className="frase">{verso}</p>
      </div>
    </Marco>
  )
}
