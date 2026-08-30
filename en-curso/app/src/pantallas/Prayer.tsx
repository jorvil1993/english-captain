import { useEffect, useRef, useState } from 'react'
import { ORACIONES } from '../datos/curso'
import { useNarrador } from '../audio/narracion'
import { campana } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'
import { esperar } from '../audio/voz'
import { versoOracion } from '../animacion/movimiento'

/**
 * La oración: 20 segundos, con gesto, siempre igual, sin exigencia.
 *
 * José no rechaza rezar — rechaza el formato largo, quieto y presionado
 * (perfil §1). Cuando la oración es breve, compartida y pegada a otra
 * actividad, entra: reza el rosario en el auto casi siempre. Esta pantalla
 * copia ese molde, no el de la misa.
 *
 * Por eso: no se le pide que repita, no se comprueba si rezó, no hay premio
 * por rezar. Solo suena, con una campanita y un silencio al final. Si él la
 * dice, la dice; si no, la oyó, que a esta edad ya es catequesis.
 */
export function Prayer({ indice, onListo, onPanel }: { indice: number; onListo: () => void; onPanel: () => void }) {
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
      // El silencio del final. No se llena con nada.
      await esperar(1600)
      if (cancelado) return
      setTermino(true)
    })()
    return () => {
      cancelado = true
    }
  }, [oracion, narrar, sigueVivo])

  return (
    <Marco paso={0} total={6} onPanel={onPanel}>
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
