import { useCallback, useEffect, useRef, useState } from 'react'
import { Marco } from '../../componentes/Marco'
import { CAMPANAS, campanaTono, paz } from '../../audio/sonidos-extra'
import { limitar, useBucle, useGestoContinuo, useInactividad, useLocutor } from './motor/gestos'
import { Fondo } from './motor/Fondo'
import './motor/estilos.css'

/**
 * RING THE CHURCH BELLS — tirar de la cuerda, y después repetir lo que sonó.
 *
 * Dos juegos en uno, y el segundo es el que enseña.
 *
 * PRIMERO, LIBRE. Tres cuerdas para tirar. La campana grande suena grave, la
 * chica suena aguda, y cada una dice su nombre al sonar: `big`, `middle`,
 * `little`. Estos tres adjetivos son de los poquísimos que un niño de cuatro
 * años puede aprender sin traducción, porque la diferencia está en el sonido
 * y en el tamaño al mismo tiempo: se ve y se oye lo mismo. No hay tarjeta que
 * enseñe "big" mejor que una campana que suena grave y se ve más grande.
 *
 * DESPUÉS, EL ECO. La app toca una secuencia corta y José la repite. Empieza
 * con una campana, después dos, después tres. Esto NO es un juego de memoria
 * disfrazado: la memoria de trabajo auditiva —oír una tira de sonidos y poder
 * devolverla en orden— es la misma capacidad que sostiene la repetición de una
 * frase en otro idioma, y es de las que más predicen cuánto vocabulario nuevo
 * agarra un niño. Se entrena así.
 *
 * NUNCA SE PIERDE, Y LA CAMPANA SIEMPRE SUENA. Si José toca la campana
 * equivocada, esa campana suena igual —una cuerda tirada que no suena sería
 * un aparato roto— y dice su nombre, que es información útil. Después la
 * maestra dice "Listen again!" y vuelve a tocar la secuencia desde el
 * principio. No hay vidas, no hay ronda perdida, no se vuelve atrás en el
 * marcador.
 *
 * QUIÉN MANDA CUANDO LOS DOS HABLAN A LA VEZ. La regla general de estos cinco
 * juegos es que la acción de José gana y la voz de la app se calla (ver
 * `useLocutor`). Acá hay una excepción con nombre y motivo: mientras la app
 * está en una TRANSICIÓN que conduce ella —la demostración de la secuencia, o
 * los dos segundos entre una ronda y la siguiente— los tirones hacen sonar la
 * campana pero no cuentan. Si contaran, un tirón a destiempo cancelaría la
 * cadena de la transición y el juego se quedaría esperando una ronda que ya
 * nadie va a arrancar. La pantalla nunca queda muda: la campana suena siempre.
 *
 * EL BALANCEO SE APAGA SOLO. La campana no "reproduce una animación": guarda
 * una energía que decae, y su ángulo sale de esa energía. Es la misma idea que
 * usan los motores de juego para el retroceso de un golpe, pero en el registro
 * de esta app: nada golpea, nada destella, nada sacude la pantalla. Una
 * campana empujada que se va deteniendo.
 */

type CampanaId = 'big' | 'middle' | 'little'

type Torre = {
  id: CampanaId
  /** Centro de la torre, en porcentaje del ancho de la escena. */
  x: number
  /** Tamaño del emoji de la campana. Grande = grave, y se ve grande. */
  tam: string
  nombre: string
  frecuencia: number
}

const TORRES: Torre[] = [
  { id: 'big', x: 21, tam: 'clamp(46px, 11vmin, 88px)', nombre: 'Big bell!', frecuencia: CAMPANAS.big },
  { id: 'middle', x: 50, tam: 'clamp(34px, 8vmin, 64px)', nombre: 'Middle bell!', frecuencia: CAMPANAS.middle },
  { id: 'little', x: 79, tam: 'clamp(25px, 6vmin, 46px)', nombre: 'Little bell!', frecuencia: CAMPANAS.little },
]

/** Las secuencias del eco, de una a tres campanadas. */
const SECUENCIAS: CampanaId[][] = [
  ['big'],
  ['little', 'big'],
  ['middle', 'little', 'big'],
]

/** Cuánto hay que tirar de la cuerda para que suene, en píxeles. */
const TIRON = 26

/** Hasta dónde estira la cuerda, para que no se salga de la escena. */
const TIRON_MAXIMO = 90

/**
 * `conduce` es la fase en la que manda la app: la demostración y los enlaces
 * entre rondas. Es la única en la que un tirón no cuenta.
 */
type Fase = 'libre' | 'conduce' | 'repitiendo' | 'fin'

export function RingTheBells({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const escena = useRef<HTMLDivElement>(null)
  const voz = useLocutor()

  const [fase, setFase] = useState<Fase>('libre')
  const [probadas, setProbadas] = useState<CampanaId[]>([])
  const [ronda, setRonda] = useState(0)
  const [sonando, setSonando] = useState<CampanaId | null>(null)
  const [pie, setPie] = useState('')

  const campanas = useRef(new Map<CampanaId, HTMLSpanElement | null>())
  const cuerdas = useRef(new Map<CampanaId, HTMLDivElement | null>())
  const tiradores = useRef(new Map<CampanaId, HTMLDivElement | null>())

  /** Cuánta energía de balanceo le queda a cada campana. Decae sola. */
  const vaiven = useRef<Record<CampanaId, number>>({ big: 0, middle: 0, little: 0 })
  const reloj = useRef(0)

  const faseRef = useRef<Fase>('libre')
  const rondaRef = useRef(0)
  const posicion = useRef(0)
  const probadasRef = useRef<CampanaId[]>([])

  // Estado del tirón en curso.
  const tirandoDe = useRef<CampanaId | null>(null)
  const yDePartida = useRef(0)
  const yaSono = useRef(false)

  const irA = useCallback((f: Fase) => {
    faseRef.current = f
    setFase(f)
  }, [])

  const { reiniciar: reiniciarAyuda, limpiar: limpiarAyuda } = useInactividad(7000, () => {
    if (faseRef.current === 'libre') void voz.di('Pull the rope with your finger!')
    else if (faseRef.current === 'repitiendo') void voz.di('Now you! Do the same!')
  })

  /** Deja la cuerda como estaba, con su rebote. */
  const soltarCuerda = useCallback((id: CampanaId) => {
    const cuerda = cuerdas.current.get(id)
    const tirador = tiradores.current.get(id)
    if (cuerda) {
      cuerda.style.transition = 'transform 460ms cubic-bezier(0.2, 1.5, 0.4, 1)'
      cuerda.style.transform = 'translateX(-50%) scaleY(1)'
    }
    if (tirador) {
      tirador.style.transition = 'transform 460ms cubic-bezier(0.2, 1.5, 0.4, 1)'
      tirador.style.transform = 'translate(-50%, -50%)'
    }
  }, [])

  /** Suena una campana: audio y balanceo. Quién la tocó lo decide otro. */
  const tanir = useCallback((id: CampanaId) => {
    const torre = TORRES.find((t) => t.id === id)
    if (!torre) return
    campanaTono(torre.frecuencia)
    // La energía se SUMA, no se reemplaza: dos campanadas seguidas balancean
    // más que una, igual que una campana de verdad.
    vaiven.current[id] = Math.min(vaiven.current[id] + 1, 1.4)
  }, [])

  /** La app toca la secuencia para que José la escuche. */
  const mostrarSecuencia = useCallback(
    async (indice: number) => {
      const s = voz.nueva()
      limpiarAyuda()
      irA('conduce')
      posicion.current = 0

      setPie('Listen!')
      if (!(await voz.di('Listen!', s))) return
      if (!(await voz.pausa(300, s))) return

      for (const id of SECUENCIAS[indice]) {
        setSonando(id)
        tanir(id)
        if (!(await voz.pausa(820, s))) return
        setSonando(null)
        if (!(await voz.pausa(160, s))) return
      }

      if (!(await voz.pausa(250, s))) return
      // El turno pasa a José ANTES de la frase, no después: si esperáramos a
      // que la maestra termine de decir "Now you!", el primer tirón —que llega
      // siempre encima de la frase— no contaría.
      irA('repitiendo')
      setPie('Now you! Do the same!')
      reiniciarAyuda()
      await voz.di('Now you! Do the same!', s)
    },
    [irA, limpiarAyuda, reiniciarAyuda, tanir, voz],
  )

  const cerrar = useCallback(async () => {
    const s = voz.nueva()
    limpiarAyuda()
    irA('fin')
    paz()
    setPie('The bells call us to church.')
    if (!(await voz.di('The bells call us to church.', s))) return
    setPie('It is time for Holy Mass!')
    if (!(await voz.di('It is time for Holy Mass!', s))) return
    setPie('Come to church! Come and pray!')
    if (!(await voz.di('Come to church! Come and pray!', s))) return
    if (!(await voz.pausa(400, s))) return
    if (!(await voz.di('You rang all the bells! Wonderful!', s))) return
    if (!(await voz.pausa(500, s))) return
    if (!(await voz.di('Good job! God loves you!', s))) return
    if (!(await voz.pausa(700, s))) return
    onVolver()
  }, [irA, limpiarAyuda, onVolver, voz])

  /** José tiró de una cuerda. Acá se decide qué significa eso. */
  const alTanir = useCallback(
    async (id: CampanaId) => {
      // La campana suena SIEMPRE, pase lo que pase. Una cuerda tirada que no
      // suena es un aparato roto, y eso no se le hace a un niño de cuatro años.
      tanir(id)
      const f = faseRef.current
      if (f === 'conduce' || f === 'fin') return

      reiniciarAyuda()
      const torre = TORRES.find((t) => t.id === id)!
      const s = voz.nueva()

      // ── Fase libre: probar las tres ─────────────────────────────────
      if (f === 'libre') {
        setPie(torre.nombre)
        if (!probadasRef.current.includes(id)) {
          probadasRef.current = [...probadasRef.current, id]
          setProbadas(probadasRef.current)
        }

        if (probadasRef.current.length >= TORRES.length) {
          // Se pasa a conducir ANTES de narrar: de aquí al primer "Listen!"
          // la app maneja, y ningún tirón puede cortar la cadena.
          irA('conduce')
          if (!(await voz.di(torre.nombre, s))) return
          if (!(await voz.di('Ding, dong! Ding, dong!', s))) return
          if (!(await voz.pausa(400, s))) return
          void mostrarSecuencia(0)
          return
        }

        await voz.di(torre.nombre, s)
        return
      }

      // ── Fase eco: repetir la secuencia ──────────────────────────────
      if (f !== 'repitiendo') return

      const esperada = SECUENCIAS[rondaRef.current][posicion.current]

      if (id !== esperada) {
        // No se pierde nada. Se le pone nombre a lo que tocó y se vuelve a
        // escuchar la secuencia entera, desde el principio.
        irA('conduce')
        setPie(torre.nombre)
        if (!(await voz.di(torre.nombre, s))) return
        if (!(await voz.pausa(300, s))) return
        if (!(await voz.di('Listen again!', s))) return
        if (!(await voz.pausa(300, s))) return
        void mostrarSecuencia(rondaRef.current)
        return
      }

      posicion.current += 1
      if (posicion.current < SECUENCIAS[rondaRef.current].length) return

      // Secuencia completa: a partir de acá conduce la app otra vez.
      irA('conduce')
      setPie('Yes! The same bells!')
      if (!(await voz.di('Yes! The same bells!', s))) return

      const siguiente = rondaRef.current + 1
      if (siguiente < SECUENCIAS.length) {
        rondaRef.current = siguiente
        setRonda(siguiente)
        if (!(await voz.pausa(500, s))) return
        void mostrarSecuencia(siguiente)
        return
      }

      rondaRef.current = SECUENCIAS.length
      setRonda(SECUENCIAS.length)
      void cerrar()
    },
    [cerrar, irA, mostrarSecuencia, reiniciarAyuda, tanir, voz],
  )

  // El balanceo de las tres campanas, cuadro a cuadro.
  useBucle((dt) => {
    reloj.current += dt
    for (const t of TORRES) {
      const energia = vaiven.current[t.id]
      if (energia <= 0) continue
      // Decae despacio: una campana de bronce sigue moviéndose un buen rato.
      vaiven.current[t.id] = Math.max(energia - dt * 0.55, 0)
      const nodo = campanas.current.get(t.id)
      if (!nodo) continue
      const angulo = Math.sin(reloj.current * 6.2) * energia * 17
      nodo.style.transform = `rotate(${angulo.toFixed(2)}deg)`
    }
  }, fase !== 'fin')

  useGestoContinuo(
    escena,
    {
      inicio: (p) => {
        reiniciarAyuda()
        // ¿En qué columna bajó el dedo? La banda es ancha: casi un tercio de
        // la escena por torre, para que no haya que apuntar.
        const x = p.nx * 100
        const torre = TORRES.find((t) => Math.abs(x - t.x) < 15)
        if (!torre) return
        tirandoDe.current = torre.id
        yDePartida.current = p.y
        yaSono.current = false
        // Se corta la transición de rebote: ahora manda el dedo.
        const cuerda = cuerdas.current.get(torre.id)
        const tirador = tiradores.current.get(torre.id)
        if (cuerda) cuerda.style.transition = 'none'
        if (tirador) tirador.style.transition = 'none'
      },
      mover: (p) => {
        const id = tirandoDe.current
        if (!id) return
        const tiron = limitar(p.y - yDePartida.current, 0, TIRON_MAXIMO)

        const cuerda = cuerdas.current.get(id)
        const tirador = tiradores.current.get(id)
        if (cuerda) {
          const alto = cuerda.offsetHeight || 1
          cuerda.style.transform = `translateX(-50%) scaleY(${1 + tiron / alto})`
        }
        if (tirador) tirador.style.transform = `translate(-50%, calc(-50% + ${tiron}px))`

        // Suena EN CUANTO se pasa el umbral, no al soltar: la respuesta tiene
        // que llegar mientras el gesto todavía está pasando, o no se siente
        // causada por el gesto.
        if (!yaSono.current && tiron >= TIRON) {
          yaSono.current = true
          void alTanir(id)
        }
      },
      fin: () => {
        const id = tirandoDe.current
        tirandoDe.current = null
        if (id) soltarCuerda(id)
      },
    },
    fase !== 'fin',
  )

  useEffect(() => {
    void (async () => {
      const s = voz.nueva()
      if (!(await voz.pausa(350, s))) return
      if (!(await voz.di('Pull the rope with your finger!', s))) return
      setPie('Pull down! Down, down!')
      if (!(await voz.di('Pull down! Down, down!', s))) return
      reiniciarAyuda()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const avance = probadas.length + ronda
  const total = TORRES.length + SECUENCIAS.length

  return (
    <Marco paso={avance} total={total} onPanel={onPanel} onInicio={onInicio}>
      <div className="mjx-pantalla">
        <p className="mjx-titulo">Ring the Church Bells</p>

        <div className="mjx-escena" ref={escena}>
          <div className="mjx-campanario" />
          <Fondo img="mjx-belfry" anclaje="arriba" />
          <div className="mjx-viga" />

          {TORRES.map((t) => (
            <div
              key={t.id}
              className={`mjx-torre ${sonando === t.id ? 'sonando' : ''}`}
              style={{ left: `${t.x}%` }}
            >
              <span
                className="mjx-campana"
                ref={(el) => {
                  campanas.current.set(t.id, el)
                }}
                style={{ ['--tam' as string]: t.tam }}
              >
                🔔
              </span>
              <div className="mjx-cuerda-caja">
                <div
                  className="mjx-cuerda"
                  ref={(el) => {
                    cuerdas.current.set(t.id, el)
                  }}
                />
                <div
                  className="mjx-tirador"
                  ref={(el) => {
                    tiradores.current.set(t.id, el)
                  }}
                />
              </div>
            </div>
          ))}

          {fase === 'fin' && (
            <div className="mjx-final">
              <span>⛪</span>
              <span className="leyenda">It is time for Holy Mass!</span>
            </div>
          )}
        </div>

        <div className="mjx-marcador" aria-hidden>
          {TORRES.map((t) => (
            <span key={t.id} className={`mjx-ficha ${probadas.includes(t.id) ? 'llena' : ''}`}>
              🔔
            </span>
          ))}
          {SECUENCIAS.map((_, i) => (
            <span key={`s${i}`} className={`mjx-ficha ${i < ronda ? 'llena' : ''}`}>
              🎵
            </span>
          ))}
        </div>

        <p className="mjx-pie">{pie}</p>
      </div>
    </Marco>
  )
}
