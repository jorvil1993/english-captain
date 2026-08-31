import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * La red de seguridad.
 *
 * Si algo revienta, React desmonta el árbol entero y deja la pantalla EN
 * BLANCO. Para un adulto eso es un bug; para José, sentado solo con la tablet,
 * es la app rota y sin salida — y encima no sabe leer para entender qué pasó.
 * Pasó de verdad el 2026-08-30: un `undefined` en el reto dejó la pantalla
 * vacía y no había forma de seguir.
 *
 * Así que ningún error puede volver a llevarse la pantalla. Se muestra una
 * tarjeta amable con un botón grande que recarga y sigue. El detalle técnico
 * queda guardado para que papá lo pueda ver en el panel, no en la cara del
 * niño.
 */
type Props = { children: ReactNode }
type Estado = { rota: boolean }

const CLAVE_ERROR = 'jose-english-ultimo-error'

export class RedDeSeguridad extends Component<Props, Estado> {
  state: Estado = { rota: false }

  static getDerivedStateFromError(): Estado {
    return { rota: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      localStorage.setItem(
        CLAVE_ERROR,
        JSON.stringify({
          cuando: new Date().toISOString(),
          mensaje: String(error?.message ?? error),
          donde: info.componentStack?.split('\n').slice(0, 4).join(' · ') ?? '',
        }),
      )
    } catch {
      // Si ni siquiera se puede guardar el error, no vale la pena insistir.
    }
  }

  render() {
    if (!this.state.rota) return this.props.children
    return (
      <div className="pantalla">
        <div className="tarjeta tarjeta-grande">
          <span className="emoji">🐑</span>
        </div>
        <p className="frase">Let's try again!</p>
        <button className="boton" onClick={() => window.location.reload()}>
          ▶
        </button>
      </div>
    )
  }
}

/** Lo último que se rompió, para el panel de papás. */
export function ultimoError(): { cuando: string; mensaje: string; donde: string } | null {
  try {
    const crudo = localStorage.getItem(CLAVE_ERROR)
    return crudo ? JSON.parse(crudo) : null
  } catch {
    return null
  }
}
