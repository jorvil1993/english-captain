import { useEffect } from 'react'
import { desbloquearAudio, decir } from '../audio/voz'
import { useSesion } from '../estado/Sesion'

export type SeccionMenu = 'prayers' | 'bible' | 'sing' | 'church'

export function Bienvenida({
  onEmpezar,
  onSeccion,
  onMinijuegos,
  onPanel,
}: {
  onEmpezar: () => void
  onSeccion: (s: SeccionMenu) => void
  onMinijuegos: () => void
  onPanel: () => void
}) {
  const { nombre } = useSesion()

  useEffect(() => {
    let cancelado = false
    void (async () => {
      const hora = new Date().getHours()
      const saludo = hora < 12 ? 'Good morning' : hora < 19 ? 'Good afternoon' : 'Good evening'
      await decir(`${saludo}, Captain ${nombre}!`)
    })()
    return () => {
      cancelado = true
    }
  }, [nombre])

  const entrarSeccion = (s: SeccionMenu, vozTexto: string) => {
    desbloquearAudio()
    void decir(vozTexto)
    onSeccion(s)
  }

  return (
    <div className="pantalla" style={{ justifyContent: 'flex-start', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
      <button className="candado" aria-label="Panel de papás" onClick={onPanel} title="Panel de papás">
        ⚙
      </button>

      <p className="frase" style={{ marginBottom: 4, fontSize: 'clamp(20px, 4vmin, 26px)' }}>
        Captain {nombre}
      </p>

      {/* 4 Secciones Visuales Católicas */}
      <div className="cuadricula-menu">
        <div
          className="tarjeta-menu"
          role="button"
          onClick={() => entrarSeccion('prayers', 'My Little Prayers')}
        >
          <span className="emoji-menu">🙏</span>
          <span className="titulo-menu">My Little Prayers</span>
        </div>

        <div
          className="tarjeta-menu"
          role="button"
          onClick={() => entrarSeccion('bible', 'Bible Friends')}
        >
          <span className="emoji-menu">🦁</span>
          <span className="titulo-menu">Bible Friends</span>
        </div>

        <div
          className="tarjeta-menu"
          role="button"
          onClick={() => entrarSeccion('sing', 'Sing and Praise')}
        >
          <span className="emoji-menu">🎵</span>
          <span className="titulo-menu">Sing & Praise</span>
        </div>

        <div
          className="tarjeta-menu"
          role="button"
          onClick={() => entrarSeccion('church', 'Holy Things and Church')}
        >
          <span className="emoji-menu">⛪</span>
          <span className="titulo-menu">Holy Things</span>
        </div>
      </div>

      {/* Acciones de Minijuegos y Misión del Día */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
        <button
          className="boton"
          tono="oro"
          onClick={() => {
            desbloquearAudio()
            void decir('Catholic Minigames')
            onMinijuegos()
          }}
          style={{
            padding: 'clamp(10px, 2vmin, 14px) clamp(16px, 3.5vmin, 24px)',
            fontSize: 'clamp(14px, 2.8vmin, 17px)',
          }}
        >
          🎮 Catholic Minigames
        </button>

        <button
          className="boton"
          onClick={() => {
            desbloquearAudio()
            void decir("Let's play!")
            onEmpezar()
          }}
          style={{
            padding: 'clamp(10px, 2vmin, 14px) clamp(16px, 3.5vmin, 24px)',
            fontSize: 'clamp(14px, 2.8vmin, 17px)',
          }}
        >
          ⚽ Daily Mission
        </button>
      </div>
    </div>
  )
}
