import { type ReactNode } from 'react'

/**
 * El marco de toda pantalla de José:
 * - Botón de inicio / volver (🏠) arriba a la izquierda.
 * - Puntos de avance dinámicos al centro.
 * - Panel de papás (⚙) arriba a la derecha.
 */
export function Marco({
  paso,
  total,
  children,
  onPanel,
  onInicio,
}: {
  paso: number
  total: number
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
    </>
  )
}
