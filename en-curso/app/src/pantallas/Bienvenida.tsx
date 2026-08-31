import { useEffect } from 'react'
import { desbloquearAudio, decir } from '../audio/voz'
import { useSesion } from '../estado/Sesion'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'

/**
 * La entrada directa. José toca un solo botón grande y arranca el recorrido
 * de hoy — nada de menú de secciones para elegir. El primer toque real de
 * José es también el que desbloquea el audio en iOS/Android.
 */
export function Bienvenida({ onEmpezar, onPanel }: { onEmpezar: () => void; onPanel: () => void }) {
  const { nombre } = useSesion()

  useEffect(() => {
    const hora = new Date().getHours()
    const saludo = hora < 12 ? 'Good morning' : hora < 19 ? 'Good afternoon' : 'Good evening'
    void decir(`${saludo}, Captain!`)
  }, [nombre])

  return (
    <div className="pantalla" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
      <button className="candado" aria-label="Panel de papás" onClick={onPanel} title="Panel de papás">
        ⚙
      </button>

      <p className="frase" style={{ marginBottom: 4, fontSize: 'clamp(20px, 4vmin, 26px)' }}>
        Captain {nombre}
      </p>

      <div style={{ width: 'clamp(140px, 30vmin, 200px)', height: 'clamp(140px, 30vmin, 200px)', marginTop: 12 }}>
        <Tarjeta img="portada" emoji="⚽" />
      </div>

      <div style={{ marginTop: 16, fontSize: 'clamp(18px, 3.6vmin, 24px)' }}>
        <Boton
          tono="oro"
          invita
          onClick={() => {
            desbloquearAudio()
            void decir("Let's play!")
            onEmpezar()
          }}
        >
          ▶ Let's play!
        </Boton>
      </div>
    </div>
  )
}
