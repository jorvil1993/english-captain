import { useEffect, useState } from 'react'
import { decir, esperar } from '../audio/voz'
import { final } from '../audio/sonidos'
import { grabacionesDeHoy, reproducir } from '../audio/grabaciones'
import { useSesion } from '../estado/Sesion'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'

/**
 * STOP. El corte de verdad.
 *
 * No hay "una más", no hay botón de volver a empezar, no hay pantalla
 * siguiente. La sesión se acabó y la app lo dice y se queda ahí.
 *
 * Esto es diseño, no una limitación. El cansancio es el disparador número uno
 * de los berrinches de José (perfil §1) y la app tiene que apagarse ANTES de
 * que él se sature, no cuando ya explotó. Y es la única forma de que papá se la
 * pueda dejar sin miedo: el límite lo sostiene el aparato, con la
 * previsibilidad perfecta que a esta familia le cuesta sostener a mano
 * (perfil §4, "amenazan y no cumplen").
 *
 * Lo único que queda vivo es el botón para que José le muestre a papá lo que
 * grabó. Ese no es tiempo de pantalla: es la conversación.
 */
export function Stop() {
  const { nombre } = useSesion()
  const [sonando, setSonando] = useState(false)
  const grabaciones = grabacionesDeHoy()

  useEffect(() => {
    let cancelado = false
    void (async () => {
      final()
      await esperar(700)
      if (cancelado) return
      await decir(`Great job, Captain ${nombre}!`)
      if (cancelado) return
      await esperar(400)
      await decir('See you tomorrow!')
    })()
    return () => {
      cancelado = true
    }
  }, [nombre])

  const paraPapa = async () => {
    setSonando(true)
    for (const g of grabaciones) {
      await reproducir(g.url)
      await esperar(500)
    }
    setSonando(false)
  }

  return (
    <div className="pantalla">
      <Tarjeta img="fin" emoji="🌟" grande />
      <p className="frase">Great job, Captain {nombre}!</p>
      <p className="frase-chica">Mañana seguimos.</p>

      {grabaciones.length > 0 && (
        <Boton tono="oro" invita={!sonando} onClick={() => void paraPapa()}>
          {sonando ? '🔊 …' : '🎧 Muéstrale a papá'}
        </Boton>
      )}
    </div>
  )
}
