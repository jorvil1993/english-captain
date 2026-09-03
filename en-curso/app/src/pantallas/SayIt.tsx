import { useEffect, useState } from 'react'
import type { Frase } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { bien } from '../audio/sonidos'
import { grabar, guardarGrabacion, hayMicrofono, reproducir } from '../audio/grabaciones'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

type Fase = 'oyendo' | 'listo' | 'grabando' | 'escuchando' | 'aplaudido'

export function SayIt({
  frases,
  onListo,
  onIntento,
  onPanel,
  onInicio,
}: {
  frases: Frase[]
  paso?: number
  onListo: () => void
  onIntento: () => void
  onPanel: () => void
  onInicio?: () => void
}) {
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
    <Marco paso={i} total={frases.length} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <Tarjeta img={frase.img} emoji={frase.emoji} grande onClick={() => void decir(frase.en)} audio={frase.en} />
        <p className="frase">{frase.en}</p>

        {fase === 'listo' && (
          <Boton tono="oro" redondo invita etiqueta="Grabar" onClick={() => void grabarloe()}>
            🎤
          </Boton>
        )}
        {fase === 'grabando' && <p className="frase-chica">🔴 …</p>}
        {fase === 'escuchando' && <p className="frase-chica">👂 That is you!</p>}
        {fase === 'aplaudido' && <p className="frase-chica">👏 👏 👏</p>}

      </div>
    </Marco>
  )
}
