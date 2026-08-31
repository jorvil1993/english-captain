import { useEffect, useRef, useState } from 'react'
import * as sonidos from '../audio/sonidos'
import { celebrar, entrarTarjeta, respirar, senalar } from '../animacion/movimiento'

/**
 * La tarjeta con imagen / emoji: el bloque táctil fundamental.
 *
 * Soporta:
 * - `wobble`: balanceo suave (Cero Frustración) cuando se toca una opción secundaria.
 * - `guiando`: pulso luminoso cálido (Andamiaje Auditivo) tras inactividad.
 */
export function Tarjeta({
  img,
  emoji,
  grande = false,
  hecha = false,
  elegida = false,
  wobble = false,
  guiando = false,
  onClick,
}: {
  img: string
  emoji: string
  grande?: boolean
  hecha?: boolean
  elegida?: boolean
  wobble?: boolean
  guiando?: boolean
  onClick?: () => void
}) {
  const [sinImagen, setSinImagen] = useState(false)
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSinImagen(false)
  }, [img])

  useEffect(() => {
    entrarTarjeta(caja.current)
    if (!grande) return
    const t = window.setTimeout(() => respirar(caja.current), 700)
    return () => window.clearTimeout(t)
  }, [grande, img])

  useEffect(() => {
    if (!elegida) return
    senalar(caja.current)
    celebrar(caja.current)
  }, [elegida])

  const clases = [
    'tarjeta',
    grande ? 'tarjeta-grande' : '',
    hecha ? 'hecha' : '',
    elegida ? 'elegida' : '',
    wobble ? 'wobble' : '',
    guiando ? 'guiando' : '',
  ]
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
