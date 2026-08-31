import { useEffect, useRef, useState } from 'react'
import { PEQUENAS_ORACIONES, type OpcionOracion } from '../datos/catolico'
import { decir, esperar } from '../audio/voz'
import { estrellitas } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

export function MyLittlePrayers({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const [i, setI] = useState(0)
  const [completada, setCompletada] = useState<string | null>(null)
  const [bloqueado, setBloqueado] = useState(false)
  const [guiando, setGuiando] = useState(false)
  const timerInactividad = useRef<number | null>(null)

  const oracion = PEQUENAS_ORACIONES[i % PEQUENAS_ORACIONES.length]

  const reiniciarInactividad = (texto: string) => {
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    timerInactividad.current = window.setTimeout(async () => {
      setGuiando(true)
      await decir(texto)
    }, 4500)
  }

  useEffect(() => {
    let cancelado = false
    setCompletada(null)
    setBloqueado(true)
    setGuiando(false)

    void (async () => {
      await esperar(300)
      if (cancelado) return
      await decir(oracion.audioInicio)
      if (cancelado) return
      setBloqueado(false)
      reiniciarInactividad(oracion.audioInicio)
    })()

    return () => {
      cancelado = true
      if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    }
  }, [oracion])

  const elegir = async (opcion: OpcionOracion) => {
    if (bloqueado) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    setBloqueado(true)
    setCompletada(opcion.id)
    estrellitas()
    await esperar(200)
    await decir(opcion.fraseCompleta)
    await esperar(700)
    if (i + 1 < PEQUENAS_ORACIONES.length) {
      setI(i + 1)
    } else {
      await decir('Bless you, Captain!')
      await esperar(400)
      onVolver()
    }
  }

  const repetir = () => {
    if (!bloqueado) {
      void decir(oracion.audioInicio)
      reiniciarInactividad(oracion.audioInicio)
    }
  }

  return (
    <Marco paso={i} total={PEQUENAS_ORACIONES.length} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <div style={{ width: 'clamp(90px, 20vmin, 120px)', height: 'clamp(90px, 20vmin, 120px)', cursor: 'pointer' }} onClick={repetir}>
          <Tarjeta img="u5-angel" emoji="👼" />
        </div>

        <p className="frase" onClick={repetir} style={{ cursor: 'pointer' }} title="Toca para escuchar">
          🔊 {oracion.inicio}
        </p>

        <div className="fila">
          {oracion.opciones.map((op) => (
            <div key={op.id} className="ficha">
              <Tarjeta
                img={op.img}
                emoji={op.emoji}
                elegida={completada === op.id}
                guiando={guiando}
                onClick={bloqueado ? undefined : () => void elegir(op)}
              />
              <span className="frase-chica">{op.en}</span>
            </div>
          ))}
        </div>

        <button className="boton fantasma" onClick={repetir} style={{ marginTop: 6, fontSize: 15 }}>
          🔊 Escuchar de nuevo
        </button>
      </div>
    </Marco>
  )
}
