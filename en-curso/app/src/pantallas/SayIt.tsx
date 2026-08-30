import { useEffect, useState } from 'react'
import type { Unidad } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { bien } from '../audio/sonidos'
import { grabar, guardarGrabacion, hayMicrofono, reproducir } from '../audio/grabaciones'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

type Fase = 'oyendo' | 'listo' | 'grabando' | 'escuchando' | 'aplaudido'

/**
 * SAY IT — José habla. Y nadie lo corrige.
 *
 * El micrófono graba y devuelve; no juzga. El reconocimiento automático del
 * habla no es fiable por debajo de los 6 años (§1.8), así que cualquier
 * "correcto/incorrecto" sería mentira técnica — y con este niño, además, una
 * puerta cerrada: no tolera que se rían de él.
 *
 * Nunca se le exige repetir. Si no dice nada, la pantalla avanza igual y con
 * el mismo aplauso. La presión frontal es lo que le hace taparse los oídos
 * (perfil §1); el reconocimiento es lo que lo engancha.
 */
export function SayIt({
  unidad,
  paso,
  onListo,
  onIntento,
  onPanel,
}: {
  unidad: Unidad
  paso: number
  onListo: () => void
  onIntento: () => void
  onPanel: () => void
}) {
  const frases = unidad.frases.slice(0, 3)
  const [i, setI] = useState(0)
  const [fase, setFase] = useState<Fase>('oyendo')
  const frase = frases[i]

  useEffect(() => {
    let cancelado = false
    setFase('oyendo')
    void (async () => {
      await esperar(400)
      if (cancelado) return
      await decir('Your turn!')
      if (cancelado) return
      await esperar(250)
      await decir(frase.en)
      if (cancelado) return
      setFase('listo')
    })()
    return () => {
      cancelado = true
    }
  }, [frase])

  const siguiente = async () => {
    setFase('aplaudido')
    bien()
    await decir('Bravo!')
    await esperar(400)
    if (i + 1 >= frases.length) onListo()
    else setI(i + 1)
  }

  const grabarloe = async () => {
    onIntento()
    if (!hayMicrofono()) {
      // Sin micrófono la actividad sigue existiendo: la voz lo invita, él lo
      // dice en voz alta y se le aplaude igual. Grabar es un extra, no el punto.
      await siguiente()
      return
    }
    setFase('grabando')
    const url = await grabar(3000)
    if (url) {
      guardarGrabacion({ fraseId: frase.id, en: frase.en, url, cuando: Date.now() })
      setFase('escuchando')
      await esperar(300)
      await reproducir(url)
    }
    await siguiente()
  }

  return (
    <Marco paso={paso} total={6} ayudaEs={frase.es} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta img={frase.img} emoji={frase.emoji} grande onClick={() => void decir(frase.en)} />
        <p className="frase">{frase.en}</p>

        {fase === 'listo' && (
          <Boton tono="oro" redondo invita etiqueta="Grabar" onClick={() => void grabarloe()}>
            🎤
          </Boton>
        )}
        {fase === 'grabando' && <p className="frase-chica">🔴 …</p>}
        {fase === 'escuchando' && <p className="frase-chica">👂 That is you!</p>}
        {fase === 'aplaudido' && <p className="frase-chica">👏 👏 👏</p>}

        {(fase === 'listo' || fase === 'grabando') && (
          <button className="boton fantasma" onClick={() => void siguiente()}>
            saltar
          </button>
        )}
      </div>
    </Marco>
  )
}
