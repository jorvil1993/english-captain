import { useEffect, useState } from 'react'
import type { Unidad } from '../datos/tipos'
import { useNarrador } from '../audio/narracion'
import { campana } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'
import { esperar } from '../audio/voz'

/**
 * Rescata las 7 `unidad.cancion` — hasta ahora huérfanas de verdad, solo se
 * leían desde la pantalla muerta `OracionesYCantos.tsx`. Se cantan enteras,
 * sin repetición espaciada: alterna con `SingAndPraise` en la rotación del
 * bloque de variedad. Sin `onInicio`: esta parada nunca se salta.
 */
export function CancionUnidad({
  unidad,
  onListo,
  onPanel,
}: {
  unidad: Unidad
  onListo: () => void
  onPanel: () => void
}) {
  const { narrar, sigueVivo } = useNarrador()
  const [verso, setVerso] = useState(-1)
  const [termino, setTermino] = useState(false)
  const cancion = unidad.cancion

  useEffect(() => {
    let cancelado = false
    void (async () => {
      campana()
      await esperar(900)
      for (let i = 0; i < cancion.versos.length; i++) {
        if (cancelado || !sigueVivo()) return
        setVerso(i)
        await narrar([cancion.versos[i]], 700)
      }
      if (cancelado || !sigueVivo()) return
      await esperar(1200)
      if (cancelado) return
      setTermino(true)
    })()
    return () => {
      cancelado = true
    }
  }, [cancion, narrar, sigueVivo])

  return (
    <Marco paso={Math.max(0, verso)} total={cancion.versos.length} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta img={unidad.frases[0]?.img ?? 'portada'} emoji="🎵" grande />
        <p className="frase-chica" style={{ opacity: 0.7 }}>
          {cancion.titulo}
        </p>
        <p className="frase">{verso >= 0 ? cancion.versos[verso] : ' '}</p>
        {termino && (
          <Boton invita onClick={onListo}>
            ▶
          </Boton>
        )}
      </div>
    </Marco>
  )
}
