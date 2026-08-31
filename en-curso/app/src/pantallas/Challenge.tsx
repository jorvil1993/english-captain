import { useEffect, useMemo, useRef, useState } from 'react'
import { CROMOS } from '../datos/curso'
import type { Frase, Unidad } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { bien, final, toque } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

const CLAVE_RECORD = 'jose-english-record'

function mezclar<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function Challenge({
  unidad,
  repaso,
  onListo,
  onResponder,
  onPanel,
  onInicio,
}: {
  unidad: Unidad
  repaso: Frase[]
  paso?: number
  onListo: () => void
  onResponder: (fraseId: string, acierto: boolean) => void
  onPanel: () => void
  onInicio?: () => void
}) {
  const [rondas] = useState(() => mezclar([...unidad.frases.slice(0, 4), ...repaso]))
  const [i, setI] = useState(0)
  const [bloqueado, setBloqueado] = useState(true)
  const [correcta, setCorrecta] = useState<string | null>(null)
  const [wobbleId, setWobbleId] = useState<string | null>(null)
  const [guiando, setGuiando] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const [record, setRecord] = useState(false)
  const inicio = useRef<number>(Date.now())
  const timerInactividad = useRef<number | null>(null)

  const objetivo = rondas[i]

  const opciones = useMemo(() => {
    if (!objetivo) return []
    const otros = unidad.frases.filter((f) => f.id !== objetivo.id)
    return mezclar([objetivo, ...mezclar(otros).slice(0, 2)])
  }, [objetivo, unidad])

  const reiniciarInactividad = (texto: string) => {
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    timerInactividad.current = window.setTimeout(async () => {
      setGuiando(true)
      await decir(texto)
    }, 4500)
  }

  useEffect(() => {
    if (!objetivo) return
    let cancelado = false
    setBloqueado(true)
    setCorrecta(null)
    setWobbleId(null)
    setGuiando(false)

    void (async () => {
      await esperar(450)
      if (cancelado) return
      await decir(objetivo.en)
      if (cancelado) return
      setBloqueado(false)
      reiniciarInactividad(objetivo.en)
    })()

    return () => {
      cancelado = true
      if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    }
  }, [objetivo])

  const responder = async (elegida: Frase) => {
    if (bloqueado) return
    if (timerInactividad.current) window.clearTimeout(timerInactividad.current)
    setGuiando(false)
    setBloqueado(true)

    const acierta = elegida.id === objetivo.id
    onResponder(objetivo.id, acierta)

    if (acierta) {
      setCorrecta(objetivo.id)
      bien()
      await esperar(220)
      await decir('Yes!')
      await esperar(450)
      if (i + 1 >= rondas.length) {
        const segundos = Math.round((Date.now() - inicio.current) / 1000)
        const previo = Number(localStorage.getItem(CLAVE_RECORD) ?? '0')
        const mejoro = previo === 0 || segundos < previo
        if (mejoro) localStorage.setItem(CLAVE_RECORD, String(segundos))
        setRecord(mejoro)
        setTerminado(true)
        final()
        await decir(mejoro ? 'NEW RECORD! You are fast!' : 'You did it!')
      } else {
        setI(i + 1)
      }
    } else {
      // Regla Cero Frustración: wobble suave + auto-nombrado en inglés + re-guía
      toque()
      setWobbleId(elegida.id)
      await decir(elegida.en)
      await esperar(500)
      setWobbleId(null)
      await decir(objetivo.en)
      setBloqueado(false)
      reiniciarInactividad(objetivo.en)
    }
  }

  const cromo = CROMOS[new Date().getDate() % CROMOS.length]

  if (terminado) {
    return (
      <Marco paso={rondas.length} total={rondas.length} ayudaEs={cromo.es} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla">
          <Tarjeta img={cromo.img} emoji={cromo.emoji} grande onClick={() => void decir(cromo.en)} />
          <p className="frase">{cromo.en}</p>
          {record && <p className="frase-chica">🏆 NEW RECORD</p>}
          <Boton invita onClick={onListo}>
            ▶
          </Boton>
        </div>
      </Marco>
    )
  }

  if (!objetivo) {
    return (
      <Marco paso={rondas.length} total={rondas.length} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla">
          <Boton invita onClick={onListo}>
            ▶
          </Boton>
        </div>
      </Marco>
    )
  }

  return (
    <Marco paso={i} total={rondas.length} ayudaEs={objetivo.es} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla">
        <p className="frase">{objetivo.en}</p>
        <div className="fila">
          {opciones.map((f) => (
            <Tarjeta
              key={f.id}
              img={f.img}
              emoji={f.emoji}
              elegida={correcta === f.id}
              wobble={wobbleId === f.id}
              guiando={guiando && f.id === objetivo.id}
              onClick={bloqueado ? undefined : () => void responder(f)}
            />
          ))}
        </div>
        <button
          className="boton fantasma"
          onClick={() => {
            void decir(objetivo.en)
            reiniciarInactividad(objetivo.en)
          }}
        >
          🔊 again
        </button>
      </div>
    </Marco>
  )
}
