import { useEffect, useState } from 'react'
import type { Unidad } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { bien } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

export function MoveIt({
  unidad,
  onListo,
  onPanel,
  onInicio,
}: {
  unidad: Unidad
  paso?: number
  onListo: () => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const ordenes = unidad.frases.slice(0, 5)
  const [i, setI] = useState(0)
  const [listo, setListo] = useState(false)
  const [hablando, setHablando] = useState(false)
  const frase = ordenes[i]

  useEffect(() => {
    let cancelado = false
    setListo(false)
    void (async () => {
      await esperar(300)
      if (cancelado) return

      setHablando(true)
      await decir(frase.ordenEn)
      if (cancelado) return
      setHablando(false)

      setListo(true)

      await esperar(900)
      if (cancelado) return
      setHablando(true)
      await decir(frase.ordenEn)
      if (cancelado) return
      setHablando(false)
    })()
    return () => {
      cancelado = true
    }
  }, [frase])

  const repetir = async () => {
    setHablando(true)
    await decir(frase.ordenEn)
    setHablando(false)
    setListo(true)
  }

  const hecho = () => {
    bien()
    if (i + 1 >= ordenes.length) onListo()
    else setI(i + 1)
  }

  return (
    <Marco paso={i} total={ordenes.length} ayudaEs={frase.es} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <Tarjeta img={frase.img} emoji={frase.emoji} grande onClick={() => void repetir()} />
        <p className="frase">{frase.ordenEn}</p>
        <p className="frase-chica">{hablando ? '🔊 · · ·' : frase.gesto}</p>
        {listo && (
          <Boton tono="oro" invita onClick={hecho}>
            ✔ I did it!
          </Boton>
        )}
      </div>
    </Marco>
  )
}
