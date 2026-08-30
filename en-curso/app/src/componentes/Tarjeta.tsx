import { useEffect, useRef, useState } from 'react'
import * as sonidos from '../audio/sonidos'
import { celebrar, entrarTarjeta, respirar, senalar } from '../animacion/movimiento'

/**
 * La tarjeta con imagen: el único "objeto" de la interfaz.
 *
 * Si la imagen todavía no está generada muestra un emoji grande y la app
 * funciona igual. Esto no es un parche: es lo que permite escribir contenido
 * nuevo hoy y dibujarlo la semana que viene sin que nada se rompa.
 *
 * El movimiento sale de `animacion/movimiento.ts` (GSAP, el mismo motor de las
 * plantillas de Hyperframes del pipeline de la empresa): entra creciendo
 * apenas, y si es la tarjeta grande queda "respirando" muy despacio para que la
 * escena se sienta viva sin distraer.
 */
export function Tarjeta({
  img,
  emoji,
  grande = false,
  hecha = false,
  elegida = false,
  onClick,
}: {
  img: string
  emoji: string
  grande?: boolean
  hecha?: boolean
  elegida?: boolean
  onClick?: () => void
}) {
  const [sinImagen, setSinImagen] = useState(false)
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    entrarTarjeta(caja.current)
    if (!grande) return
    // La respiración arranca cuando terminó de entrar, para que las dos
    // animaciones no peleen por la misma propiedad.
    const t = window.setTimeout(() => respirar(caja.current), 700)
    return () => window.clearTimeout(t)
  }, [grande, img])

  // Se ilumina despacio. Sirve para las dos cosas: celebrar el acierto y
  // señalar cuál era la buena cuando se equivocó — sin sonido y sin castigo.
  useEffect(() => {
    if (!elegida) return
    senalar(caja.current)
    celebrar(caja.current)
  }, [elegida])

  const clases = ['tarjeta', grande ? 'tarjeta-grande' : '', hecha ? 'hecha' : '', elegida ? 'elegida' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={caja}
      className={clases}
      role={onClick ? 'button' : 'img'}
      onClick={
        onClick
          ? () => {
              sonidos.toque()
              onClick()
            }
          : undefined
      }
    >
      {sinImagen ? (
        <span className="emoji">{emoji}</span>
      ) : (
        <img src={`./img/${img}.jpg`} alt="" onError={() => setSinImagen(true)} draggable={false} />
      )}
    </div>
  )
}
