import { useEffect, useState } from 'react'
import type { Unidad } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { bien } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

/**
 * MOVE IT — Total Physical Response puro.
 *
 * La voz da una orden en inglés y José la hace CON EL CUERPO: corre, salta,
 * patea, se señala el pecho. Los gestos que acompañan mejoran la retención de
 * palabras y frases nuevas porque se codifica por vía kinestésica, visual y
 * auditiva a la vez (§1.4).
 *
 * Para este niño en particular no es un accesorio: tiene muchísima energía, se
 * aburre y salta de actividad, y no aguanta quieto un formato largo. Tres
 * minutos de cuerpo en medio de la sesión son lo que hace que se quede en los
 * otros doce.
 *
 * La app no puede ver si lo hizo. No importa: él toca la tarjeta cuando
 * terminó. La honestidad de un niño de 4 años delante de una consigna que le
 * gusta es suficiente, y pedirle cámara sería otra app.
 */
export function MoveIt({
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
  // Cinco órdenes, no ocho: el sanguíneo se dispersa (perfil §1).
  const ordenes = unidad.frases.slice(0, 5)
  const [i, setI] = useState(0)
  const [listo, setListo] = useState(false)
  const frase = ordenes[i]

  useEffect(() => {
    let cancelado = false
    setListo(false)
    void (async () => {
      await esperar(400)
      if (cancelado) return
      await decir(frase.ordenEn)
      if (cancelado) return
      await esperar(700)
      if (cancelado) return
      // Se repite una vez. Dos veces la misma orden basta; una tercera es
      // presión, y la presión con José dispara el "taparse los oídos".
      await decir(frase.ordenEn)
      if (cancelado) return
      setListo(true)
    })()
    return () => {
      cancelado = true
    }
  }, [frase])

  const hecho = () => {
    bien()
    if (i + 1 >= ordenes.length) onListo()
    else setI(i + 1)
  }

  return (
    <Marco paso={paso} total={6} ayudaEs={frase.es} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta img={frase.img} emoji={frase.emoji} grande onClick={listo ? hecho : undefined} />
        <p className="frase">{frase.ordenEn}</p>
        <p className="frase-chica">{frase.gesto}</p>
        {listo && (
          <Boton tono="oro" invita onClick={hecho}>
            ✔ I did it!
          </Boton>
        )}
      </div>
    </Marco>
  )
}
