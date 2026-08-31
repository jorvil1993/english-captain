import { useEffect, useRef, useState } from 'react'
import { fraseDe } from '../datos/curso'
import type { Unidad } from '../datos/tipos'
import { useNarrador } from '../audio/narracion'
import { bien, toque } from '../audio/sonidos'
import { decir, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

type Fase = 'narrando' | 'sigue' | 'preguntando' | 'resolviendo'

export function Story({
  unidad,
  onListo,
  onResponder,
  onPanel,
  onInicio,
}: {
  unidad: Unidad
  paso?: number
  total?: number
  onListo: () => void
  onResponder: (fraseId: string, acierto: boolean) => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const { narrar, sigueVivo } = useNarrador()
  const [i, setI] = useState(0)
  const [fase, setFase] = useState<Fase>('narrando')
  const [correcta, setCorrecta] = useState<string | null>(null)
  const [wobbleId, setWobbleId] = useState<string | null>(null)
  const [guiando, setGuiando] = useState(false)
  const timerInactividad = useRef<number | null>(null)

  const escenas = unidad.cuento.escenas
  const escena = escenas[i]

  const reiniciarInactividad = (texto: string) => {
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    timerInactividad.current = window.setTimeout(async () => {
      setGuiando(true)
      await decir(texto)
    }, 4500)
  }

  useEffect(() => {
    if (!escena) return
    let cancelado = false
    setFase('narrando')
    setCorrecta(null)
    setWobbleId(null)
    setGuiando(false)

    void (async () => {
      await esperar(300)
      if (cancelado || !sigueVivo()) return
      await narrar(escena.en)
      if (cancelado || !sigueVivo()) return

      if (escena.pregunta) {
        await esperar(200)
        if (cancelado) return
        setFase('preguntando')
        await decir(escena.pregunta.en)
        reiniciarInactividad(escena.pregunta.en)
      } else {
        setFase('sigue')
      }
    })()

    return () => {
      cancelado = true
      if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    }
  }, [escena, narrar, sigueVivo])

  const avanzar = () => {
    setFase('narrando')
    setCorrecta(null)
    setWobbleId(null)
    if (i + 1 >= escenas.length) onListo()
    else setI(i + 1)
  }

  const repetir = () => {
    if (fase === 'preguntando' && escena?.pregunta) {
      void decir(escena.pregunta.en)
      reiniciarInactividad(escena.pregunta.en)
    } else if (escena) {
      void narrar(escena.en)
    }
  }

  const responder = async (fraseId: string, acierta: boolean) => {
    if (fase !== 'preguntando' || !escena?.pregunta) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)

    const buena = escena.pregunta.opciones.find((o) => o.correcta)
    onResponder(fraseId, acierta)

    if (acierta && buena) {
      setFase('resolviendo')
      setCorrecta(buena.fraseId)
      bien()
      await esperar(250)
      await decir(`Yes! ${fraseDe(buena.fraseId).en}`)
      await esperar(500)
      avanzar()
    } else {
      // Regla Cero Frustración: wobble suave + auto-nombrado en inglés + re-guía
      toque()
      setWobbleId(fraseId)
      await decir(fraseDe(fraseId).en)
      await esperar(500)
      setWobbleId(null)
      await decir(escena.pregunta.en)
      reiniciarInactividad(escena.pregunta.en)
    }
  }

  if (!escena) {
    return (
      <Marco paso={escenas.length} total={escenas.length} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla">
          <Boton invita onClick={onListo}>
            ▶
          </Boton>
        </div>
      </Marco>
    )
  }

  const esPregunta = (fase === 'preguntando' || fase === 'resolviendo') && Boolean(escena.pregunta)

  return (
    <Marco paso={i} total={escenas.length} ayudaEs={escena.es} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <Tarjeta img={escena.img} emoji={escena.emoji} grande onClick={repetir} />

        {esPregunta && escena.pregunta ? (
          <>
            <p
              className="frase"
              onClick={repetir}
              style={{ cursor: 'pointer' }}
              title="Toca para volver a escuchar"
            >
              🔊 {escena.pregunta.en}
            </p>
            <div className="fila">
              {escena.pregunta.opciones.map((o) => {
                const f = fraseDe(o.fraseId)
                return (
                  <Tarjeta
                    key={o.fraseId}
                    img={f.img}
                    emoji={f.emoji}
                    elegida={correcta === o.fraseId}
                    wobble={wobbleId === o.fraseId}
                    guiando={guiando && o.correcta}
                    onClick={fase === 'preguntando' ? () => void responder(o.fraseId, o.correcta) : undefined}
                  />
                )
              })}
            </div>
            <button
              className="boton fantasma"
              onClick={repetir}
              style={{ marginTop: 4, fontSize: 15 }}
            >
              🔊 Escuchar de nuevo
            </button>
          </>
        ) : (
          <>
            <p className="frase" onClick={repetir} style={{ cursor: 'pointer' }}>
              {escena.en.join(' ')}
            </p>
            {fase === 'sigue' && (
              <Boton invita onClick={avanzar}>
                ▶
              </Boton>
            )}
          </>
        )}
      </div>
    </Marco>
  )
}
