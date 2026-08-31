import { useEffect, useState } from 'react'
import { HISTORIAS_BIBLICAS, type ElementoBiblico, type HistoriaBiblica } from '../datos/catolico'
import { decir, esperar } from '../audio/voz'
import { bien, sonidoAnimal, toque } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

export function BibleFriends({
  onPanel,
  onInicio,
  historiaId,
  onListo,
}: {
  onPanel: () => void
  onInicio?: () => void
  /** Si viene, se salta el menú de elegir historia y arranca directo en
   *  esta — así se usa como parada del recorrido diario. */
  historiaId?: string
  /** Si está presente, al terminar la historia llama a esto en vez de
   *  volver al menú interno. Sin esto (Modo Calma), comportamiento igual
   *  que antes: menú libre de las 3 historias, sin fin. */
  onListo?: () => void
}) {
  const [historia, setHistoria] = useState<HistoriaBiblica | null>(() =>
    historiaId ? HISTORIAS_BIBLICAS.find((h) => h.id === historiaId) ?? null : null,
  )
  const [escenaIdx, setEscenaIdx] = useState(0)
  const [elementoActivo, setElementoActivo] = useState<string | null>(null)

  const escena = historia ? historia.escenas[escenaIdx] : null

  useEffect(() => {
    if (!escena) return
    let cancelado = false
    void (async () => {
      await esperar(300)
      if (cancelado) return
      await decir(escena.narracion)
    })()
    return () => {
      cancelado = true
    }
  }, [escena, escenaIdx])

  const tocarElemento = async (el: ElementoBiblico) => {
    toque()
    setElementoActivo(el.id)

    // Si es un animal, ejecutar la secuencia: Sonido Real MP3 ➔ Nombre en inglés ("Lion!") ➔ Sonido Real MP3
    if (['lion', 'sheep', 'dove', 'elephant'].includes(el.id)) {
      await sonidoAnimal(el.id)
      await decir(`${el.nombre}!`)
      await sonidoAnimal(el.id)
    } else {
      await decir(el.sonidoOTexto)
    }
  }

  const avanzar = () => {
    if (!historia) return
    if (escenaIdx + 1 < historia.escenas.length) {
      setEscenaIdx(escenaIdx + 1)
      setElementoActivo(null)
    } else {
      bien()
      if (onListo) {
        onListo()
        return
      }
      setHistoria(null)
      setEscenaIdx(0)
    }
  }

  // Menú de selección de historias con Ilustraciones Reales
  if (!historia) {
    return (
      <Marco paso={0} total={0} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla">
          <p className="frase">Bible Friends</p>
          <div className="fila" style={{ flexWrap: 'wrap' }}>
            {HISTORIAS_BIBLICAS.map((h) => (
              <div key={h.id} className="ficha">
                <Tarjeta
                  img={h.img}
                  emoji={h.icono}
                  onClick={() => {
                    setHistoria(h)
                    setEscenaIdx(0)
                  }}
                />
                <span className="frase-chica" style={{ fontWeight: 700 }}>
                  {h.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Marco>
    )
  }

  return (
    <Marco
      paso={escenaIdx}
      total={historia.escenas.length}
      onPanel={onPanel}
      onInicio={onListo ? undefined : () => setHistoria(null)}
    >
      <div className="pantalla">
        <p className="frase-chica" style={{ opacity: 0.7 }}>
          {historia.titulo}
        </p>

        <p
          className="frase"
          onClick={() => void decir(escena!.narracion)}
          style={{ cursor: 'pointer' }}
          title="Toca para escuchar"
        >
          🔊 {escena!.narracion}
        </p>

        <div className="fila">
          {escena!.elementos.map((el) => (
            <div key={el.id} className="ficha">
              <Tarjeta
                img={el.img}
                emoji={el.emoji}
                elegida={elementoActivo === el.id}
                onClick={() => void tocarElemento(el)}
              />
              <span className="frase-chica" style={{ fontWeight: 700 }}>
                {el.nombre}
              </span>
            </div>
          ))}
        </div>

        <Boton invita onClick={avanzar} style={{ marginTop: 12 }}>
          ▶
        </Boton>
      </div>
    </Marco>
  )
}
