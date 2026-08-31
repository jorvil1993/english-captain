import { useEffect, useState } from 'react'

/**
 * El fondo ilustrado de una escena, con red de seguridad.
 *
 * Si el jpg no está —todavía no se generó, el service worker no lo tenía
 * cacheado, la tablet se quedó sin espacio— el elemento se quita del todo y
 * debajo queda el degradado de CSS de esa escena. Nunca se ve un rectángulo
 * blanco ni un icono de imagen rota, y el juego sigue siendo jugable: los
 * personajes y el gesto no dependen del fondo.
 *
 * Que se QUITE (y no que se ponga transparente) importa: hay reglas de CSS que
 * preguntan si la escena tiene fondo ilustrado para esconder lo que el dibujo
 * ya trae —la viga del campanario, por ejemplo—. Si el `img` roto siguiera en
 * el árbol, esas reglas seguirían escondiendo cosas que ahora sí hacen falta.
 */
export function Fondo({
  img,
  anclaje = 'centro',
}: {
  /** Nombre del archivo en `public/img`, sin extensión. */
  img: string
  /** Qué parte del dibujo no se puede perder al recortar. */
  anclaje?: 'centro' | 'arriba' | 'abajo'
}) {
  const [roto, setRoto] = useState(false)

  useEffect(() => setRoto(false), [img])

  if (roto) return null

  const clase = anclaje === 'arriba' ? 'arriba' : anclaje === 'abajo' ? 'abajo' : ''

  return (
    <img
      className={`mjx-fondo ${clase}`}
      src={`./img/${img}.jpg`}
      alt=""
      draggable={false}
      onError={() => setRoto(true)}
    />
  )
}
