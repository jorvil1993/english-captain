import { useEffect, useRef, type ReactNode } from 'react'
import { aparecer, invitar } from '../animacion/movimiento'

/**
 * El botón grande de José. Aparece suave al montarse y, si es el que tiene que
 * tocar para seguir, late muy despacio para invitarlo — un ciclo de casi un
 * segundo, no el parpadeo nervioso de una app de premios.
 *
 * `invita` se usa solo en el botón principal de cada pantalla. Dos cosas
 * latiendo a la vez ya es ruido, y el ruido compite con el contenido y gana
 * (§1.3 de la investigación).
 */
export function Boton({
  children,
  onClick,
  tono,
  redondo = false,
  invita = false,
  etiqueta,
}: {
  children: ReactNode
  onClick: () => void
  tono?: 'oro' | 'fantasma'
  redondo?: boolean
  invita?: boolean
  etiqueta?: string
}) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    aparecer(ref.current)
    if (!invita) return
    const parar = invitar(ref.current)
    return parar
  }, [invita])

  const clases = ['boton', tono ?? '', redondo ? 'redondo' : ''].filter(Boolean).join(' ')

  return (
    <button ref={ref} className={clases} onClick={onClick} aria-label={etiqueta}>
      {children}
    </button>
  )
}
