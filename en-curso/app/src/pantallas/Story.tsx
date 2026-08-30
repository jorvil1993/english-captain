import { useEffect, useState } from 'react'
import { fraseDe } from '../datos/curso'
import type { Unidad } from '../datos/tipos'
import { useNarrador } from '../audio/narracion'
import { bien } from '../audio/sonidos'
import { decir, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

type Fase = 'narrando' | 'sigue' | 'preguntando' | 'resolviendo'

/**
 * EL CUENTO. La columna vertebral de la unidad.
 *
 * Dos decisiones vienen directo de la investigación:
 *
 *  · El cuento gana a la canción en vocabulario incidental (§1.5), y el
 *    "storytelling elaborativo interactivo" —el que se detiene, pregunta y
 *    expande— gana a la relectura repetida. Por eso el cuento SE DETIENE.
 *
 *  · Un cuento que corre solo es un video, y de un video no se aprende (§1.2).
 *    Acá cada escena espera un toque de José y algunas le hacen una pregunta
 *    de verdad. La pantalla no avanza sin él.
 *
 * Y cuando se equivoca no pasa NADA: ningún sonido, ninguna cara, ningún "no".
 * La voz vuelve a decir la frase correcta con calma y el cuento sigue. José no
 * tolera que se rían de él y cualquier señal de fallo le cierra la puerta
 * (perfil §1, sensibilidad a la burla; Don Bosco: mostrar lo lindo, nunca
 * humillar).
 */
export function Story({
  unidad,
  paso,
  onListo,
  onResponder,
  onPanel,
}: {
  unidad: Unidad
  paso: number
  onListo: () => void
  onResponder: (fraseId: string, acierto: boolean) => void
  onPanel: () => void
}) {
  const { narrar, sigueVivo } = useNarrador()
  const [i, setI] = useState(0)
  const [fase, setFase] = useState<Fase>('narrando')
  const [correcta, setCorrecta] = useState<string | null>(null)

  const escena = unidad.cuento.escenas[i]

  useEffect(() => {
    let cancelado = false
    setFase('narrando')
    setCorrecta(null)
    void (async () => {
      await esperar(400)
      if (cancelado || !sigueVivo()) return
      await narrar(escena.en)
      if (cancelado || !sigueVivo()) return
      if (escena.pregunta) {
        await esperar(300)
        if (cancelado) return
        await decir(escena.pregunta.en)
        if (cancelado) return
        setFase('preguntando')
      } else {
        setFase('sigue')
      }
    })()
    return () => {
      cancelado = true
    }
  }, [escena, narrar, sigueVivo])

  const avanzar = () => {
    if (i + 1 >= unidad.cuento.escenas.length) onListo()
    else setI(i + 1)
  }

  const responder = async (fraseId: string, acierta: boolean) => {
    if (fase !== 'preguntando') return
    setFase('resolviendo')
    onResponder(fraseId, acierta)
    const buena = escena.pregunta!.opciones.find((o) => o.correcta)!
    setCorrecta(buena.fraseId)
    if (acierta) {
      bien()
      await esperar(250)
      await decir(`Yes! ${fraseDe(buena.fraseId).en}`)
    } else {
      // Sin sonido, sin "no". Se vuelve a modelar bien y ya.
      await esperar(250)
      await decir(fraseDe(buena.fraseId).en)
    }
    await esperar(500)
    avanzar()
  }

  return (
    <Marco paso={paso} total={6} ayudaEs={escena.es} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta img={escena.img} emoji={escena.emoji} grande />

        {fase === 'preguntando' || fase === 'resolviendo' ? (
          <>
            <p className="frase">{escena.pregunta!.en}</p>
            <div className="fila">
              {escena.pregunta!.opciones.map((o) => {
                const f = fraseDe(o.fraseId)
                return (
                  <Tarjeta
                    key={o.fraseId}
                    img={f.img}
                    emoji={f.emoji}
                    elegida={correcta === o.fraseId}
                    onClick={fase === 'preguntando' ? () => void responder(o.fraseId, o.correcta) : undefined}
                  />
                )
              })}
            </div>
          </>
        ) : (
          <>
            <p className="frase">{escena.en.join(' ')}</p>
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
