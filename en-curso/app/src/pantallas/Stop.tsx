import { useEffect, useState } from 'react'
import { decir, esperar } from '../audio/voz'
import { final } from '../audio/sonidos'
import { grabacionesDeHoy, reproducir } from '../audio/grabaciones'
import { useSesion } from '../estado/Sesion'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'

/**
 * Pausa de seguridad excepcional.
 *
 * La línea normal no llega aquí: al terminar una misión se inicia la lección
 * siguiente. Esto solo cubre un final inesperado y José puede continuar de
 * inmediato.
 */
export function Stop({ onContinuar }: { onContinuar?: () => void }) {
  const { nombre } = useSesion()
  const [sonando, setSonando] = useState(false)
  const grabaciones = grabacionesDeHoy()

  useEffect(() => {
    let cancelado = false
    void (async () => {
      final()
      await esperar(700)
      if (cancelado) return
      await decir('Great job, Captain!')
      if (cancelado) return
      await esperar(400)
      await decir("Let's play!")
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
      <p className="frase-chica">✨ Keep going!</p>

      {onContinuar && (
        <Boton tono="oro" invita onClick={onContinuar}>
          ▶ Let's play!
        </Boton>
      )}

      {grabaciones.length > 0 && (
        <Boton tono="oro" invita={!sonando} onClick={() => void paraPapa()}>
          {sonando ? '🔊 …' : '🎧 Show Dad'}
        </Boton>
      )}
    </div>
  )
}
