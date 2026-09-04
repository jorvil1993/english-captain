import { useEffect, useState } from 'react'
import type { PlanDeOracion } from '../datos/oraciones-motor'
import { decir, esperar } from '../audio/voz'
import { bien } from '../audio/sonidos'
import { grabar, guardarGrabacion, hayMicrofono, reproducir } from '../audio/grabaciones'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

type Fase = 'oyendo' | 'listo' | 'grabando' | 'escuchando' | 'aplaudido'

/**
 * Eco de oración interactivo con micrófono:
 * El niño escucha el verso de la oración (máximo 2-3 palabras) y pulsa
 * el botón del micrófono para repetir y escucharse a sí mismo.
 */
export function EcoOracion({
  plan,
  onVersoMostrado,
  onListo,
  onPanel,
}: {
  plan: PlanDeOracion
  onVersoMostrado: (versoIdx: number) => void
  onListo: () => void
  onPanel: () => void
}) {
  const indice = plan.versoNuevo ?? plan.versosRepaso.at(-1) ?? 0
  const verso = plan.oracion.versos[indice] ?? plan.oracion.versos[0]
  const [fase, setFase] = useState<Fase>('oyendo')

  useEffect(() => {
    let cancelado = false
    setFase('oyendo')
    void (async () => {
      await esperar(350)
      if (cancelado) return
      await decir('Your turn!')
      if (cancelado) return
      await esperar(200)
      await decir(verso)
      if (cancelado) return
      setFase('listo')
    })()
    return () => {
      cancelado = true
    }
  }, [verso])

  const avanzar = async () => {
    setFase('aplaudido')
    bien()
    await decir('Bravo!')
    await esperar(400)
    onVersoMostrado(indice)
    onListo()
  }

  const grabarlo = async () => {
    if (!hayMicrofono()) {
      await avanzar()
      return
    }
    setFase('grabando')
    const url = await grabar(3000)
    if (url) {
      guardarGrabacion({ fraseId: `oracion-${plan.oracion.id}-${indice}`, en: verso, url, cuando: Date.now() })
      setFase('escuchando')
      await esperar(300)
      await reproducir(url)
    }
    await avanzar()
  }

  return (
    <Marco paso={0} total={0} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta
          img={plan.oracion.img}
          emoji={plan.oracion.emoji}
          grande
          onClick={() => void decir(verso)}
          audio={verso}
        />
        <p className="frase-chica" style={{ opacity: 0.7, margin: '4px 0 0' }}>
          {plan.oracion.titulo}
        </p>
        <p className="frase" style={{ fontSize: 'clamp(24px, 5vmin, 32px)', margin: '8px 0 16px' }}>
          {verso}
        </p>

        {fase === 'listo' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Boton tono="oro" redondo invita etiqueta="Grabar" onClick={() => void grabarlo()}>
              🎤
            </Boton>
            <button
              className="boton fantasma"
              onClick={() => void avanzar()}
              style={{ fontSize: 13, opacity: 0.7 }}
            >
              Skip →
            </button>
          </div>
        )}
        {fase === 'grabando' && <p className="frase-chica">🔴 Repite: {verso} …</p>}
        {fase === 'escuchando' && <p className="frase-chica">👂 That is you!</p>}
        {fase === 'aplaudido' && <p className="frase-chica">👏 👏 👏</p>}
      </div>
    </Marco>
  )
}
