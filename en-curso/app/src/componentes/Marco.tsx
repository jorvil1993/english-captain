import { useRef, type ReactNode } from 'react'
import { decirEs } from '../audio/voz'

/**
 * El marco de toda pantalla de José: los puntos de avance, el botón de ayuda
 * en español y el candado del panel de papás.
 *
 * El botón de ayuda es deliberadamente chico y está en una esquina. El español
 * existe solo como rescate breve cuando algo no se entiende — si estuviera al
 * centro, José lo apretaría siempre y la app dejaría de ser inmersión para
 * volverse un traductor (§4 de la investigación).
 */
export function Marco({
  paso,
  total,
  ayudaEs,
  children,
  onPanel,
}: {
  paso: number
  total: number
  ayudaEs?: string
  children: ReactNode
  onPanel?: () => void
}) {
  const temporizador = useRef<number | null>(null)

  // El candado se mantiene apretado dos segundos: José no entra de casualidad.
  const empezarAPresionar = () => {
    if (!onPanel) return
    temporizador.current = window.setTimeout(onPanel, 2000)
  }
  const soltar = () => {
    if (temporizador.current) window.clearTimeout(temporizador.current)
    temporizador.current = null
  }

  return (
    <>
      <div className="puntos" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`punto ${i < paso ? 'hecho' : i === paso ? 'activo' : ''}`} />
        ))}
      </div>

      {onPanel && (
        <button
          className="candado"
          aria-label="Panel de papás"
          onPointerDown={empezarAPresionar}
          onPointerUp={soltar}
          onPointerLeave={soltar}
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
