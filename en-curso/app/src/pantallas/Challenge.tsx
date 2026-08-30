import { useEffect, useMemo, useRef, useState } from 'react'
import { CROMOS } from '../datos/curso'
import type { Frase, Unidad } from '../datos/tipos'
import { decir, esperar } from '../audio/voz'
import { bien, final } from '../audio/sonidos'
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

/**
 * THE CHALLENGE — la comprensión, que es lo que de verdad se mide a esta edad.
 *
 * La voz dice una frase y José señala la imagen. Nada de producir, nada de
 * pronunciar: a los 4-5 años lo normal es un período silencioso largo, y muchos
 * niños desarrollan primero —o solo— habilidades receptivas (§1.9). Si entiende
 * y todavía no habla, va bien.
 *
 * Acá entra también el REPASO ESPACIADO: se cuelan frases de unidades
 * anteriores que hoy toca recuperar. Recuperar espaciadamente es lo que hace
 * que la frase siga ahí una semana después (§1.6).
 *
 * Y acá está la decisión más delicada de toda la app: JOSÉ NO PUEDE PERDER.
 * Odia perder —se enoja, llora, y le dura— y ese es justo el terreno donde hay
 * que entrenarlo, pero con papá en la cancha, no con una tablet a solas
 * (perfil §1). Así que no hay rival, no hay vidas, no hay "game over": corre
 * contra su propio récord, y si no lo mejora la app sencillamente no lo
 * menciona. Solo existe la felicitación cuando lo rompe.
 */
export function Challenge({
  unidad,
  repaso,
  paso,
  onListo,
  onResponder,
  onPanel,
}: {
  unidad: Unidad
  repaso: Frase[]
  paso: number
  onListo: () => void
  onResponder: (fraseId: string, acierto: boolean) => void
  onPanel: () => void
}) {
  const rondas = useMemo(() => mezclar([...unidad.frases.slice(0, 4), ...repaso]), [unidad, repaso])

  const [i, setI] = useState(0)
  const [bloqueado, setBloqueado] = useState(true)
  const [correcta, setCorrecta] = useState<string | null>(null)
  const [terminado, setTerminado] = useState(false)
  const [record, setRecord] = useState(false)
  const inicio = useRef<number>(Date.now())

  const objetivo = rondas[i]

  const opciones = useMemo(() => {
    if (!objetivo) return []
    const otros = unidad.frases.filter((f) => f.id !== objetivo.id)
    return mezclar([objetivo, ...mezclar(otros).slice(0, 2)])
  }, [objetivo, unidad])

  useEffect(() => {
    if (!objetivo) return
    let cancelado = false
    setBloqueado(true)
    setCorrecta(null)
    void (async () => {
      await esperar(450)
      if (cancelado) return
      await decir(objetivo.en)
      if (cancelado) return
      setBloqueado(false)
    })()
    return () => {
      cancelado = true
    }
  }, [objetivo])

  const responder = async (elegida: Frase) => {
    if (bloqueado) return
    setBloqueado(true)
    const acierta = elegida.id === objetivo.id
    onResponder(objetivo.id, acierta)
    setCorrecta(objetivo.id)
    if (acierta) {
      bien()
      await esperar(220)
      await decir('Yes!')
    } else {
      await esperar(220)
      await decir(objetivo.en)
    }
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
  }

  // El cromo del día: un jugador real, con su frase, como cierre del reto.
  const cromo = CROMOS[new Date().getDate() % CROMOS.length]

  if (terminado) {
    return (
      <Marco paso={paso} total={6} ayudaEs={cromo.es} onPanel={onPanel}>
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
      <Marco paso={paso} total={6} onPanel={onPanel}>
        <div className="pantalla">
          <Boton invita onClick={onListo}>
            ▶
          </Boton>
        </div>
      </Marco>
    )
  }

  return (
    <Marco paso={paso} total={6} ayudaEs={objetivo.es} onPanel={onPanel}>
      <div className="pantalla">
        <p className="frase">{objetivo.en}</p>
        <div className="fila">
          {opciones.map((f) => (
            <Tarjeta
              key={f.id}
              img={f.img}
              emoji={f.emoji}
              elegida={correcta === f.id}
              onClick={bloqueado ? undefined : () => void responder(f)}
            />
          ))}
        </div>
        <button className="boton fantasma" onClick={() => void decir(objetivo.en)}>
          🔊 again
        </button>
      </div>
    </Marco>
  )
}
