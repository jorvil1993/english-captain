import { useEffect, useMemo, useRef, useState } from 'react'
import { OBJETOS_SAGRADOS, type ObjetoSagrado } from '../datos/catolico'
import { decir, esperar } from '../audio/voz'
import { estrellitas, toque } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

function mezclar<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function HolyThings({ onVolver, onPanel }: { onVolver: () => void; onPanel: () => void }) {
  const [i, setI] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [elegido, setElegido] = useState<string | null>(null)
  const [wobbleId, setWobbleId] = useState<string | null>(null)
  const [guiando, setGuiando] = useState(false)
  const timerInactividad = useRef<number | null>(null)

  const objetivo = OBJETOS_SAGRADOS[i % OBJETOS_SAGRADOS.length]

  const opciones = useMemo(() => {
    const otros = OBJETOS_SAGRADOS.filter((o) => o.id !== objetivo.id)
    return mezclar([objetivo, ...mezclar(otros).slice(0, 2)])
  }, [objetivo])

  // Temporizador de andamiaje auditivo (4.5 segundos sin tocar)
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
    setElegido(null)
    setWobbleId(null)
    setBloqueado(true)
    setGuiando(false)

    void (async () => {
      await esperar(300)
      if (cancelado) return
      await decir(objetivo.orden)
      if (cancelado) return
      setBloqueado(false)
      reiniciarInactividad(objetivo.orden)
    })()

    return () => {
      cancelado = true
      if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    }
  }, [objetivo])

  const seleccionar = async (item: ObjetoSagrado) => {
    if (bloqueado) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    setBloqueado(true)

    if (item.id === objetivo.id) {
      setElegido(item.id)
      estrellitas()
      await esperar(200)
      await decir(objetivo.respuesta)
      await esperar(600)
      if (i + 1 < OBJETOS_SAGRADOS.length) {
        setI(i + 1)
      } else {
        await decir('Great job, Captain! God bless you!')
        await esperar(400)
        onVolver()
      }
    } else {
      // Regla Cero Frustración: balanceo suave (wobble) + auto-nombrado en inglés + re-guía
      toque()
      setWobbleId(item.id)
      await decir(item.nombre)
      await esperar(600)
      setWobbleId(null)
      await decir(objetivo.orden)
      setBloqueado(false)
      reiniciarInactividad(objetivo.orden)
    }
  }

  const repetir = () => {
    if (!bloqueado) {
      void decir(objetivo.orden)
      reiniciarInactividad(objetivo.orden)
    }
  }

  return (
    <Marco paso={i} total={OBJETOS_SAGRADOS.length} onPanel={onPanel} onInicio={onVolver}>
      <div className="pantalla">
        <div className="tarjeta tarjeta-grande" onClick={repetir} style={{ cursor: 'pointer' }}>
          <span className="emoji">⛪</span>
        </div>

        <p className="frase" onClick={repetir} style={{ cursor: 'pointer' }} title="Toca para escuchar">
          🔊 {objetivo.orden}
        </p>

        <div className="fila">
          {opciones.map((op) => (
            <div key={op.id} className="ficha">
              <Tarjeta
                img={op.img}
                emoji={op.emoji}
                elegida={elegido === op.id}
                wobble={wobbleId === op.id}
                guiando={guiando && op.id === objetivo.id}
                onClick={bloqueado ? undefined : () => void seleccionar(op)}
              />
              <span className="frase-chica">{op.nombre}</span>
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
