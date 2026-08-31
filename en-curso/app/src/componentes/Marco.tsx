import { type ReactNode } from 'react'
import { decirEs } from '../audio/voz'

/**
 * El marco de toda pantalla de José:
 * - Botón de inicio / volver (🏠) arriba a la izquierda.
 * - Puntos de avance dinámicos al centro.
 * - Panel de papás (⚙) arriba a la derecha.
 * - Botón de ayuda en español abajo a la izquierda.
 */
export function Marco({
  paso,
  total,
  ayudaEs,
  children,
  onPanel,
  onInicio,
}: {
  paso: number
  total: number
  ayudaEs?: string
  children: ReactNode
  onPanel?: () => void
  onInicio?: () => void
}) {
  return (
    <>
      {onInicio && (
        <button
          className="boton-inicio"
          aria-label="Volver al inicio"
          onClick={onInicio}
          title="Volver al menú principal"
        >
          🏠
        </button>
      )}

      {total > 1 && (
        <div className="puntos" aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`punto ${i < paso ? 'hecho' : i === paso ? 'activo' : ''}`} />
          ))}
        </div>
      )}

      {onPanel && (
        <button
          className="candado"
          aria-label="Panel de papás"
          onClick={onPanel}
          title="Panel de papás"
        >
          ⚙
        </button>
      )}

      {children}

      {ayudaEs && (
        <button className="boton fantasma ayuda" onClick={() => void decirEs(ayudaEs)}>
          ❓ en español
        </button>
      )}
    </>
  )
}
