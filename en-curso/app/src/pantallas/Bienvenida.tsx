import { useEffect, useState } from 'react'
import { desbloquearAudio, decir, esperar } from '../audio/voz'
import { useSesion } from '../estado/Sesion'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'

/**
 * La puerta. Un solo botón enorme.
 *
 * Cumple tres cosas a la vez: desbloquea el audio (los navegadores móviles no
 * dejan sonar nada hasta que el usuario toca), saluda a José POR SU NOMBRE
 * —que es la contingencia mínima (§1.2) y, no por casualidad, la imagen del
 * Buen Pastor que llama a cada oveja por su nombre— y le dice qué va a pasar,
 * porque necesita saber el plan antes de empezar (perfil §1).
 */
export function Bienvenida({ onEmpezar, onPanel }: { onEmpezar: () => void; onPanel: () => void }) {
  const { nombre, yaJugoHoy } = useSesion()
  const [tocado, setTocado] = useState(false)

  useEffect(() => {
    if (!tocado) return
    let cancelado = false
    void (async () => {
      const hora = new Date().getHours()
      const saludo = hora < 12 ? 'Good morning' : hora < 19 ? 'Good afternoon' : 'Good evening'
      await decir(`${saludo}, Captain ${nombre}!`)
      if (cancelado) return
      await esperar(400)
      if (cancelado) return
      await decir("Let's play!")
      if (cancelado) return
      onEmpezar()
    })()
    return () => {
      cancelado = true
    }
  }, [tocado, nombre, onEmpezar])

  // Ya jugó hoy: no hay segunda sesión. El límite lo sostiene la app, no papá.
  if (yaJugoHoy) {
    return (
      <div className="pantalla">
        <button className="candado" aria-label="Panel de papás" onClick={onPanel}>
          ⚙
        </button>
        <Tarjeta img="fin-dia" emoji="🌙" grande />
        <p className="frase">See you tomorrow, Captain {nombre}!</p>
        <p className="frase-chica">Hoy ya jugaron. Mañana los espera otra vez.</p>
      </div>
    )
  }

  return (
    <div className="pantalla">
      <button className="candado" aria-label="Panel de papás" onClick={onPanel}>
        ⚙
      </button>

      <Tarjeta img="portada" emoji="⚽" grande />

      {!tocado ? (
        <Boton
          invita
          onClick={() => {
            desbloquearAudio()
            setTocado(true)
          }}
        >
          ▶ START
        </Boton>
      ) : (
        <p className="frase">Hello, Captain {nombre}!</p>
      )}
    </div>
  )
}
