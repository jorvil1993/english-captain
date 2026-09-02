import { useEffect, useRef, useState } from 'react'
import { fraseDe } from '../datos/curso'
import type { Frase, Unidad } from '../datos/tipos'
import { useNarrador } from '../audio/narracion'
import { bien, toque } from '../audio/sonidos'
import { decir, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

type Fase = 'narrando' | 'sigue' | 'preguntando' | 'resolviendo'

export function Story({
  unidad,
  escenasPermitidas,
  frasesDisponibles,
  onListo,
  onResponder,
  onPanel,
  onInicio,
}: {
  unidad: Unidad
  /** Solo el capítulo que puede comprender con lo aprendido hoy. */
  escenasPermitidas?: number[]
  /** Una pregunta solo se muestra si sus dos opciones ya se presentaron. */
  frasesDisponibles?: Frase[]
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
  /** La imagen de conteo (los `v-count-*`) que aparece un instante tras acertar
   *  un número: cierra el lazo cifra ↔ cantidad. No es un premio. */
  const [refuerzo, setRefuerzo] = useState<string | null>(null)
  const timerInactividad = useRef<number | null>(null)

  const escenas = escenasPermitidas?.map((indice) => unidad.cuento.escenas[indice]).filter(Boolean) ?? unidad.cuento.escenas
  const escena = escenas[i]
  const conocidas = new Set((frasesDisponibles ?? unidad.frases).map((frase) => frase.id))
  const pregunta = escena?.pregunta && escena.pregunta.opciones.every((opcion) => conocidas.has(opcion.fraseId))
    ? escena.pregunta
    : undefined

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
    setRefuerzo(null)

    void (async () => {
      await esperar(300)
      if (cancelado || !sigueVivo()) return
      await narrar(escena.en)
      if (cancelado || !sigueVivo()) return

      if (pregunta) {
        await esperar(200)
        if (cancelado) return
        setFase('preguntando')
        await decir(pregunta.en)
        reiniciarInactividad(pregunta.en)
      } else {
        setFase('sigue')
        // Si no hay pregunta, no hay nada que el niño deba decidir. Dejamos
        // tiempo para mirar y la historia continúa sin una flecha saltable.
        await esperar(1800)
        if (!cancelado && sigueVivo()) avanzar()
      }
    })()

    return () => {
      cancelado = true
      if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    }
  }, [escena, pregunta, narrar, sigueVivo])

  const avanzar = () => {
    setFase('narrando')
    setCorrecta(null)
    setWobbleId(null)
    if (i + 1 >= escenas.length) onListo()
    else setI(i + 1)
  }

  const repetir = () => {
    if (fase === 'preguntando' && pregunta) {
      void decir(pregunta.en)
      reiniciarInactividad(pregunta.en)
    } else if (escena) {
      void narrar(escena.en)
    }
  }

  const responder = async (fraseId: string, acierta: boolean) => {
    if (fase !== 'preguntando' || !pregunta) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)

    const buena = pregunta.opciones.find((o) => o.correcta)
    onResponder(fraseId, acierta)

    if (acierta && buena) {
      setFase('resolviendo')
      setCorrecta(buena.fraseId)
      bien()
      await esperar(250)
      const fBuena = fraseDe(buena.fraseId)
      await decir(`Yes! ${fBuena.en}`)
      if (fBuena.refuerzoImg) {
        setRefuerzo(fBuena.refuerzoImg)
        await esperar(200)
        if (fBuena.eco) await decir(fBuena.eco)
        await esperar(900)
        setRefuerzo(null)
      }
      await esperar(500)
      avanzar()
    } else {
      // Regla Cero Frustración: wobble suave + auto-nombrado en inglés + re-guía
      toque()
      setWobbleId(fraseId)
      await decir(fraseDe(fraseId).en)
      await esperar(500)
      setWobbleId(null)
      await decir(pregunta.en)
      reiniciarInactividad(pregunta.en)
    }
  }

  if (!escena) {
    return (
      <Marco paso={escenas.length} total={escenas.length} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla"><p className="frase-chica">✨</p></div>
      </Marco>
    )
  }

  const esPregunta = (fase === 'preguntando' || fase === 'resolviendo') && Boolean(pregunta)

  return (
    <Marco paso={i} total={escenas.length} ayudaEs={escena.es} onPanel={onPanel} onInicio={onInicio}>
      {refuerzo && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            display: 'grid', placeItems: 'center',
            background: 'var(--fondo, #faf4e9)',
          }}
        >
          <div style={{ width: 'min(72vw, 340px)' }}>
            <Tarjeta img={refuerzo} emoji="⚽" grande />
          </div>
        </div>
      )}
      <div className="pantalla">
        <Tarjeta
          img={escena.img}
          emoji={escena.emoji}
          grande
          onClick={repetir}
          audio={esPregunta && pregunta ? pregunta.en : escena.en.join(' ')}
        />

        {esPregunta && pregunta ? (
          <>
            <p
              className="frase"
              onClick={repetir}
              style={{ cursor: 'pointer' }}
              title="Toca para volver a escuchar"
            >
              🔊 {pregunta.en}
            </p>
            <div className="fila">
              {pregunta.opciones.map((o) => {
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
                    audio={f.en}
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
            {fase === 'sigue' && <p className="frase-chica">✨</p>}
          </>
        )}
      </div>
    </Marco>
  )
}
