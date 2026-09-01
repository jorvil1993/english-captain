import { useEffect, useRef, useState } from 'react'
import type { Frase } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { bien } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

/**
 * La puerta de entrada de cada episodio: antes del cuento o del juego el
 * niño oye y toca las dos frases que necesitará reconocer después. No hay
 * pestañas, texto que leer ni botón "siguiente": tocar la imagen correcta
 * confirma el encuentro y la ruta continúa por sí sola.
 */
export function PalabrasDelDia({
  frases,
  onListo,
  onPanel,
}: {
  frases: Frase[]
  onListo: () => void
  onPanel: () => void
}) {
  const [indice, setIndice] = useState(0)
  const [bloqueado, setBloqueado] = useState(true)
  const [guiando, setGuiando] = useState(false)
  const timerGuia = useRef<number | null>(null)
  const frase: Frase | undefined = frases[indice]

  useEffect(() => {
    if (!frase) return
    let cancelado = false
    setBloqueado(true)
    setGuiando(false)

    void (async () => {
      await esperar(450)
      if (cancelado) return
      await decir(frase.en)
      if (cancelado) return
      await esperar(650)
      if (cancelado) return
      setBloqueado(false)
      // José no debe averiguar qué hacer. Si mira la imagen sin tocarla,
      // vuelve a oír la misma frase y el objetivo se ilumina.
      timerGuia.current = window.setTimeout(() => {
        setGuiando(true)
        void decir(frase.en)
      }, 2600)
    })()

    return () => {
      cancelado = true
      if (timerGuia.current) window.clearTimeout(timerGuia.current)
    }
  }, [frase])

  const aprender = async () => {
    if (!frase || bloqueado) return
    if (timerGuia.current) window.clearTimeout(timerGuia.current)
    setBloqueado(true)
    setGuiando(false)
    bien()
    await decir(frase.en)
    await esperar(850)
    if (indice + 1 >= frases.length) onListo()
    else setIndice((valor) => valor + 1)
  }

  if (!frase) return null

  return (
    <Marco paso={indice} total={frases.length} ayudaEs={frase.es} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta
          img={frase.img}
          emoji={frase.emoji}
          grande
          guiando={guiando}
          onClick={bloqueado ? undefined : () => void aprender()}
          audio={frase.en}
        />
        <p className="frase">{frase.en}</p>
        <p className="frase-chica">👆</p>
      </div>
    </Marco>
  )
}
