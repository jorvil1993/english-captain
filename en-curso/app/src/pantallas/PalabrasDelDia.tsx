import { useEffect, useRef, useState } from 'react'
import type { Frase } from '../datos/tipos'
import { callar, decir, esperar } from '../audio/voz'
import { bien } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

/**
 * La puerta de entrada de cada episodio: antes del cuento o del juego el
 * niño oye y toca las dos frases que necesitará reconocer después. No hay
 * pestañas, texto que leer ni botón "siguiente": la imagen se ilumina para
 * invitar a tocarla, pero la ruta continúa sola si José solo mira y escucha.
 * Ninguna palabra puede dejarlo esperando a que un adulto le explique qué
 * botón falta tocar.
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
  const timerAutoavance = useRef<number | null>(null)
  const pasando = useRef(false)
  const frase: Frase | undefined = frases[indice]

  const limpiarTemporizadores = () => {
    if (timerGuia.current) window.clearTimeout(timerGuia.current)
    if (timerAutoavance.current) window.clearTimeout(timerAutoavance.current)
    timerGuia.current = null
    timerAutoavance.current = null
  }

  const aprender = async (automatico = false) => {
    // El tiempo de seguridad puede vencer mientras un mp3 intenta cargar. En
    // ese caso pasa sin esperar el audio: una visita con wifi lento no puede
    // inmovilizar la clase.
    if (!frase || pasando.current || (!automatico && bloqueado)) return
    pasando.current = true
    limpiarTemporizadores()
    setBloqueado(true)
    setGuiando(false)

    if (automatico) callar()
    else bien()

    await esperar(automatico ? 500 : 700)
    if (indice + 1 >= frases.length) onListo()
    else setIndice((valor) => valor + 1)
  }

  useEffect(() => {
    if (!frase) return
    let cancelado = false
    pasando.current = false
    setBloqueado(true)
    setGuiando(false)

    // Tiene casi siete segundos para oír, mirar y tocar. Si no hace nada, el
    // flujo sigue igual: tocar es práctica voluntaria, nunca una barrera.
    timerAutoavance.current = window.setTimeout(() => {
      if (!cancelado) void aprender(true)
    }, 6800)

    void (async () => {
      await esperar(450)
      if (cancelado || pasando.current) return
      await decir(frase.en)
      if (cancelado || pasando.current) return
      await esperar(650)
      if (cancelado || pasando.current) return
      setBloqueado(false)
      setGuiando(true)
      // La imagen ya está iluminada cuando queda disponible. Si desea más
      // tiempo, la misma frase vuelve a sonar; el autoavance de arriba sigue
      // siendo la salida segura para no depender de un adulto.
      timerGuia.current = window.setTimeout(() => {
        setGuiando(true)
        void decir(frase.en)
      }, 2300)
    })()

    return () => {
      cancelado = true
      limpiarTemporizadores()
    }
    // `frase` es el único cambio que inicia una nueva tarjeta. `aprender`
    // usa los valores de esta tarjeta dentro del temporizador ya creado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frase])

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
        <p className="frase-chica guia-toque" aria-live="polite">
          {bloqueado ? '👂' : '👆 ✨'}
        </p>
      </div>
    </Marco>
  )
}
