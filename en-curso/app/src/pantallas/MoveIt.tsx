import { useEffect, useState } from 'react'
import type { Frase } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

export function MoveIt({
  frases,
  onListo,
  onPanel,
  onInicio,
}: {
  frases: Frase[]
  paso?: number
  onListo: () => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const ordenes = frases
  const [i, setI] = useState(0)
  const [hablando, setHablando] = useState(false)
  const frase = ordenes[i]

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(300)
      if (cancelado) return

      setHablando(true)
      await decir(frase.ordenEn)
      if (cancelado) return
      setHablando(false)

      // Repetición calmada para que lo haga con el cuerpo. Como la tablet no
      // puede saber si corrió o saltó, nunca pedimos un botón arbitrario de
      // "I did it" que se pueda tocar para saltear la experiencia.
      await esperar(1100)
      if (cancelado) return
      setHablando(true)
      await decir(frase.ordenEn)
      if (cancelado) return
      setHablando(false)
      await esperar(2400)
      if (cancelado) return

      if (i + 1 >= ordenes.length) onListo()
      else setI((paso) => paso + 1)
    })()
    return () => {
      cancelado = true
    }
  }, [frase, i, onListo, ordenes.length])

  const repetir = async () => {
    setHablando(true)
    await decir(frase.ordenEn)
    setHablando(false)
  }

  return (
    <Marco paso={i} total={ordenes.length} ayudaEs={frase.es} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <Tarjeta
          img={frase.img}
          emoji={frase.emoji}
          grande
          onClick={() => void repetir()}
          audio={frase.ordenEn}
        />
        <p className="frase">{frase.ordenEn}</p>
        <p className="frase-chica">{hablando ? '🔊 · · ·' : frase.gesto}</p>
      </div>
    </Marco>
  )
}
