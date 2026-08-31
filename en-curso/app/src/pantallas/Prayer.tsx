import { useEffect, useRef, useState } from 'react'
import { ORACIONES } from '../datos/curso'
import { useNarrador } from '../audio/narracion'
import { campana } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'
import { esperar } from '../audio/voz'
import { versoOracion } from '../animacion/movimiento'

export function Prayer({
  indice,
  onListo,
  onPanel,
  onInicio,
}: {
  indice: number
  onListo: () => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const oracion = ORACIONES[indice % ORACIONES.length]
  const { narrar, sigueVivo } = useNarrador()
  const [verso, setVerso] = useState(-1)
  const [termino, setTermino] = useState(false)
  const linea = useRef<HTMLParagraphElement>(null)

  useEffect(() => versoOracion(linea.current), [verso])

  useEffect(() => {
    let cancelado = false
    void (async () => {
      campana()
      await esperar(1200)
      for (let i = 0; i < oracion.versos.length; i++) {
        if (cancelado || !sigueVivo()) return
        setVerso(i)
        await narrar([oracion.versos[i]], 300)
      }
      if (cancelado || !sigueVivo()) return
      await esperar(1600)
      if (cancelado) return
      setTermino(true)
    })()
    return () => {
      cancelado = true
    }
  }, [oracion, narrar, sigueVivo])

  return (
    <Marco paso={Math.max(0, verso)} total={oracion.versos.length} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <Tarjeta img={oracion.img} emoji={oracion.emoji} grande />
        <p className="frase" ref={linea}>
          {verso >= 0 ? oracion.versos[verso] : ' '}
        </p>
        <p className="frase-chica">{oracion.gesto}</p>
        {termino && (
          <Boton invita onClick={onListo}>
            ▶
          </Boton>
        )}
      </div>
    </Marco>
  )
}
