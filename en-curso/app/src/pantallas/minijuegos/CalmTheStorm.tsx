import { useCallback, useEffect, useRef, useState } from 'react'
import { Marco } from '../../componentes/Marco'
import { ola, paz, viento } from '../../audio/sonidos-extra'
import { limitar, useBucle, useGestoContinuo, useInactividad, useLocutor } from './motor/gestos'
import './motor/estilos.css'

/**
 * CALM THE STORM — primero se agita la tormenta, y después se la calma
 * quedándose quieto.
 *
 * Este es el juego que más falta hacía, y no por el inglés.
 *
 * José es colérico primario. La descarga motora la necesita —y la app se la
 * da en la primera mitad: agitar el dedo lo más fuerte que pueda hasta
 * levantar olas, viento y truenos—. Pero la segunda mitad hace lo contrario y
 * es la que importa: Jesús dice "Peace! Be still!" y ahora hay que poner el
 * dedo en el círculo y NO MOVERSE durante unos segundos. Quedarse quieto a
 * propósito es una habilidad que se entrena, no un rasgo que se tiene, y acá
 * se entrena con un aro que se llena solo cuando la mano está en paz.
 *
 * La secuencia agitar → aquietar es la del evangelio (Mc 4, 35-41) y también
 * la de la autorregulación: primero se reconoce la tormenta, después se la
 * atraviesa acompañado. Por eso Jesús no aparece al final como premio; aparece
 * DURANTE, dormido en la barca, desde el primer segundo. La frase que se lleva
 * José no es "gané": es "Do not be afraid. Jesus is with you."
 *
 * DOS CICLOS. La segunda tormenta llega sabiendo lo que viene después, y para
 * un niño que necesita anticipación eso lo cambia todo: la primera vez se
 * calma porque se lo piden, la segunda porque ya sabe cómo se hace.
 *
 * Y no hay forma de fallar. Si se mueve durante la calma, el aro baja despacio
 * y la voz de oración repite "Do not move. Quiet." — sin sonido de error, sin
 * volver a empezar, sin reproche.
 *
 * CADA TRAMO HABLADO ABRE SU PROPIA SERIE, y eso no es un detalle de estilo.
 * José es colérico: agita FUERTE, y levanta la tormenta en cuatro segundos,
 * mucho antes de que termine la presentación ("Jesus is sleeping in the
 * boat..."). Sin series quedaban dos narraciones vivas a la vez, cada una
 * cortándole el mp3 a la otra; y como cortar un audio no lo termina, la que
 * quedaba esperando se colgaba hasta que saltaba su red de seguridad, ocho
 * segundos después. El resultado en la tablet era el peor posible: el aro
 * lleno del todo, el niño quieto habiendo hecho bien lo difícil, y la pantalla
 * sin reaccionar durante casi medio minuto. Con `voz.nueva()`, empezar un
 * tramo mata el anterior en el acto.
 */

type Fase = 'tormenta' | 'calma' | 'fin'

const CICLOS = 2

/** Segundos de mano quieta que llenan el aro. */
const QUIETUD_PEDIDA = [3.4, 4.2]

/**
 * Cuánto movimiento se tolera durante la calma antes de considerar que el
 * dedo "se movió". No es cero a propósito: un dedo apoyado de verdad tiembla,
 * y exigir inmovilidad perfecta a un niño de cuatro años sería exigirle algo
 * que ni un adulto da.
 */
const TEMBLOR_TOLERADO = 30

export function CalmTheStorm({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const escena = useRef<HTMLDivElement>(null)
  const barco = useRef<HTMLDivElement>(null)
  const olaAlta = useRef<SVGPathElement>(null)
  const olaBaja = useRef<SVGPathElement>(null)
  const nubes = useRef<HTMLDivElement>(null)
  const aro = useRef<SVGCircleElement>(null)
  const voz = useLocutor()

  const [fase, setFase] = useState<Fase>('tormenta')
  const [ciclo, setCiclo] = useState(0)
  const [calmo, setCalmo] = useState(false)
  const [pie, setPie] = useState('')

  const energia = useRef(0)
  const reloj = useRef(0)
  const quietud = useRef(0)
  const movimiento = useRef(0)
  const dedoAbajo = useRef(false)
  const faseRef = useRef<Fase>('tormenta')
  const cicloRef = useRef(0)
  const ocupado = useRef(false)
  /**
   * Se está cerrando un ciclo. Es distinto de `ocupado`: `ocupado` solo dice
   * que la app está hablando —y hablar nunca puede frenar el juego—, mientras
   * que esto evita que el mismo ciclo se cierre dos veces.
   */
  const cerrando = useRef(false)
  const dichas = useRef(new Set<string>())
  const sopla = useRef<ReturnType<typeof viento> | null>(null)
  const ultimaOla = useRef(0)

  const { reiniciar: reiniciarAyuda } = useInactividad(6000, () => {
    if (ocupado.current) return
    if (faseRef.current === 'tormenta') {
      void voz.di('Shake your finger fast! Make the storm!')
    } else if (faseRef.current === 'calma' && !dedoAbajo.current) {
      // Solo si LEVANTÓ el dedo. Si lo tiene apoyado y quieto está haciendo
      // exactamente lo que se le pidió, y repetírselo cada seis segundos sería
      // interrumpir el único momento de silencio que tiene la app.
      void voz.di('Now hold your finger very still.')
    }
  })

  /** El viento solo puede arrancar después de que José tocó la pantalla. */
  const asegurarViento = useCallback(() => {
    if (!sopla.current) sopla.current = viento()
  }, [])

  useEffect(() => {
    return () => {
      sopla.current?.parar()
      sopla.current = null
    }
  }, [])

  const irACalma = useCallback(async () => {
    const s = voz.nueva()
    ocupado.current = true
    faseRef.current = 'calma'
    setFase('calma')
    quietud.current = 0
    movimiento.current = 0

    if (!(await voz.di('Wake up, Jesus! Help us!', s))) return
    if (!(await voz.pausa(250, s))) return
    setPie('Peace! Be still!')
    if (!(await voz.di('Peace! Be still!', s))) return
    setPie('Now hold your finger very still.')
    if (!(await voz.di('Now hold your finger very still.', s))) return
    ocupado.current = false
    reiniciarAyuda()
  }, [reiniciarAyuda, voz])

  const irATormenta = useCallback(async () => {
    const s = voz.nueva()
    ocupado.current = true
    faseRef.current = 'tormenta'
    setFase('tormenta')
    setCalmo(false)
    energia.current = 0
    cerrando.current = false
    dichas.current.clear()
    setPie('Shake your finger fast! Make the storm!')
    if (!(await voz.di('Shake your finger fast! Make the storm!', s))) return
    ocupado.current = false
    reiniciarAyuda()
  }, [reiniciarAyuda, voz])

  const cerrarCiclo = useCallback(async () => {
    const s = voz.nueva()
    cerrando.current = true
    ocupado.current = true
    energia.current = 0
    sopla.current?.nivel(0)
    setCalmo(true)
    paz()

    setPie('The wind stops.')
    if (!(await voz.di('The wind stops.', s))) return
    setPie('The sea is calm.')
    if (!(await voz.di('The sea is calm.', s))) return

    const siguiente = cicloRef.current + 1
    if (siguiente < CICLOS) {
      cicloRef.current = siguiente
      setCiclo(siguiente)
      if (!(await voz.pausa(900, s))) return
      void irATormenta()
      return
    }

    faseRef.current = 'fin'
    setFase('fin')
    sopla.current?.parar()
    sopla.current = null
    setPie('Do not be afraid. Jesus is with you.')
    if (!(await voz.di('Do not be afraid. Jesus is with you.', s))) return
    if (!(await voz.pausa(400, s))) return
    setPie('You are calm, like the sea. Amen!')
    if (!(await voz.di('You are calm, like the sea. Amen!', s))) return
    if (!(await voz.pausa(500, s))) return
    if (!(await voz.di('Good job! God loves you!', s))) return
    if (!(await voz.pausa(700, s))) return
    onVolver()
  }, [irATormenta, onVolver, voz])

  useBucle((dt) => {
    reloj.current += dt
    const t = reloj.current
    const f = faseRef.current

    // ── La energía de la tormenta ───────────────────────────────────────
    // Se gana agitando y se pierde sola. Esa fuga constante es lo que obliga
    // a MANTENER el movimiento: sin ella bastaría un manotazo y listo.
    if (f === 'tormenta') {
      energia.current = limitar(energia.current - dt * 0.42, 0, 1)
    } else {
      energia.current = limitar(energia.current - dt * 0.9, 0, 1)
    }
    const e = energia.current
    sopla.current?.nivel(f === 'tormenta' ? e : e * 0.4)

    // Una ola rompe cada tanto, y más seguido cuanto más fuerte la tormenta.
    if (f === 'tormenta' && e > 0.28 && t - ultimaOla.current > 1.6 - e) {
      ultimaOla.current = t
      ola(e)
    }

    // ── El mar ──────────────────────────────────────────────────────────
    // Dos senos desfasados: el de arriba más alto y lento, el de abajo más
    // corto y rápido. Sumados no se repiten a la vista y el mar parece vivo.
    const amplitud = 2.5 + e * 11
    const dibujarOla = (nodo: SVGPathElement | null, base: number, amp: number, vel: number, desfase: number) => {
      if (!nodo) return
      let d = `M 0 100 L 0 ${base}`
      for (let x = 0; x <= 100; x += 5) {
        const y = base + Math.sin(x / 11 + t * vel + desfase) * amp
        d += ` L ${x} ${y.toFixed(2)}`
      }
      d += ' L 100 100 Z'
      nodo.setAttribute('d', d)
    }
    dibujarOla(olaAlta.current, 62, amplitud, 1.6 + e * 3.2, 0)
    dibujarOla(olaBaja.current, 72, amplitud * 0.68, 2.3 + e * 4.1, 1.9)

    // ── La barca ────────────────────────────────────────────────────────
    if (barco.current) {
      const balanceo = Math.sin(t * (1.7 + e * 5.4)) * (2 + e * 20)
      const subeBaja = Math.sin(t * (1.6 + e * 4.6) + 0.7) * (1 + e * 7)
      const alto = 58 - e * 4
      barco.current.style.top = `${alto + subeBaja * 0.35}%`
      barco.current.style.transform = `translate(-50%, -50%) rotate(${balanceo.toFixed(2)}deg)`
    }

    // ── Las nubes ───────────────────────────────────────────────────────
    if (nubes.current) {
      nubes.current.style.opacity = String(0.35 + e * 0.6)
      nubes.current.style.transform = `translateX(${(Math.sin(t * 0.9) * e * 12).toFixed(1)}px)`
    }

    // ── Se llegó al tope de la tormenta ─────────────────────────────────
    if (f === 'tormenta' && !ocupado.current) {
      const anuncio = (clave: string, umbral: number, frase: string) => {
        if (e >= umbral && !dichas.current.has(clave)) {
          dichas.current.add(clave)
          setPie(frase)
          void voz.di(frase)
        }
      }
      anuncio('viento', 0.3, 'The wind is blowing! Woo, woo!')
      anuncio('olas', 0.6, 'Faster! Big waves!')
      anuncio('agita', 0.82, 'Shake, shake, shake!')
    }

    // La tormenta llega al tope: se pasa a la calma aunque la app esté
    // hablando. `irACalma` cambia la fase en su primera línea, así que este
    // mismo `if` no puede dispararse dos veces.
    if (f === 'tormenta' && e >= 0.98) {
      void irACalma()
    }

    // ── La calma: el aro se llena mientras la mano no se mueva ──────────
    // Mientras se cierra el ciclo el aro se congela lleno. Si se siguiera
    // calculando, al pasar al ciclo dos —que pide sostener un poco más— el
    // aro bajaría y volvería a subir durante la despedida, como si algo se
    // hubiera perdido justo después de conseguirlo.
    if (f === 'calma' && !cerrando.current) {
      movimiento.current *= Math.exp(-4.5 * dt)
      const quieto = dedoAbajo.current && movimiento.current < TEMBLOR_TOLERADO
      const pedida = QUIETUD_PEDIDA[cicloRef.current] ?? QUIETUD_PEDIDA[0]

      if (quieto) quietud.current = Math.min(quietud.current + dt, pedida)
      // Bajar más despacio de lo que sube: moverse cuesta, pero no arruina.
      else quietud.current = Math.max(quietud.current - dt * 0.45, 0)

      const avance = quietud.current / pedida
      if (aro.current) {
        const largo = 2 * Math.PI * 44
        aro.current.style.strokeDasharray = String(largo)
        aro.current.style.strokeDashoffset = String(largo * (1 - avance))
      }

      // El aliento de la mitad sí espera a que la app termine de hablar: es
      // un adorno y encimarlo sobre otra frase solo haría ruido.
      if (!ocupado.current && avance >= 0.45 && !dichas.current.has('mitad')) {
        dichas.current.add('mitad')
        setPie('Still. Very still.')
        void voz.di('Still. Very still.')
      }

      // Cerrar el ciclo NO espera. José acaba de sostener el dedo inmóvil
      // varios segundos: es lo más difícil que le pide la app, y ya lo logró.
      // Que la maestra siguiera diciéndole "hold your finger very still"
      // cuatro segundos DESPUÉS de que lo consiguió es justo el trato que
      // este niño no soporta. `cerrarCiclo` abre serie nueva y la calla.
      if (avance >= 1 && !cerrando.current) {
        cerrando.current = true
        void cerrarCiclo()
      }
    }
  }, fase !== 'fin')

  useGestoContinuo(
    escena,
    {
      inicio: (p) => {
        asegurarViento()
        dedoAbajo.current = true
        movimiento.current = 0
        reiniciarAyuda()
        void p
      },
      mover: (_p, m) => {
        if (faseRef.current === 'tormenta') {
          // La tormenta se mide en DISTANCIA RECORRIDA, no en eventos: un
          // teléfono que dispara 120 eventos por segundo y una tablet que
          // dispara 60 tienen que costar lo mismo, o el juego sería el doble
          // de fácil en el aparato más caro. Y el filtro de velocidad es lo
          // que distingue agitar de arrastrar: paseando el dedo despacio no
          // se levanta ninguna tormenta, hay que sacudir.
          if (m.velocidad > 250) {
            energia.current = limitar(energia.current + Math.hypot(m.dx, m.dy) / 2200, 0, 1)
          }
          reiniciarAyuda()
        } else if (faseRef.current === 'calma') {
          movimiento.current += Math.hypot(m.dx, m.dy)
          if (movimiento.current > TEMBLOR_TOLERADO * 3 && !ocupado.current && !dichas.current.has('quieto')) {
            dichas.current.add('quieto')
            void voz.di('Do not move. Quiet.')
            // Se puede volver a decir, pero no cada vez que tiembla: se
            // rearma recién cuando ya lleva un rato quieto.
            window.setTimeout(() => dichas.current.delete('quieto'), 5000)
          }
        }
      },
      fin: () => {
        dedoAbajo.current = false
      },
    },
    fase !== 'fin',
  )

  useEffect(() => {
    void (async () => {
      const s = voz.nueva()
      if (!(await voz.pausa(350, s))) return
      if (!(await voz.di('Jesus is sleeping in the boat.', s))) return
      setPie('Shake your finger fast! Make the storm!')
      if (!(await voz.di('Shake your finger fast! Make the storm!', s))) return
      reiniciarAyuda()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Marco
      paso={ciclo * 2 + (fase === 'tormenta' ? 0 : 1)}
      total={CICLOS * 2}
      onPanel={onPanel}
      onInicio={onInicio}
    >
      <div className="mjx-pantalla">
        <p className="mjx-titulo">Calm the Storm</p>

        <div className="mjx-escena" ref={escena}>
          <div className={`mjx-mar ${calmo ? 'calmo' : ''}`} />

          <div className={`mjx-sol ${calmo ? 'visible' : ''}`}>🌅</div>

          <div className="mjx-nube" ref={nubes} style={{ left: '16%', top: '10%' }}>
            <span style={{ marginRight: '18vmin' }}>☁️</span>
            <span>🌧️</span>
          </div>

          {/* El mar. Dos capas de ola que se redibujan en cada frame. */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path ref={olaAlta} d="" fill="rgba(90, 140, 178, 0.55)" />
            <path ref={olaBaja} d="" fill="rgba(58, 106, 145, 0.75)" />
          </svg>

          <div className="mjx-barco" ref={barco} style={{ top: '58%' }}>
            ⛵
          </div>

          {/* El aro de la quietud. Solo existe en la mitad calma. */}
          {fase === 'calma' && (
            <>
              <svg className="mjx-aro" viewBox="0 0 100 100" aria-hidden>
                <circle className="fondo" cx="50" cy="50" r="44" strokeWidth="7" />
                <circle
                  ref={aro}
                  className="lleno"
                  cx="50"
                  cy="50"
                  r="44"
                  strokeWidth="7"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="mjx-aro-centro">✋</div>
            </>
          )}

          {fase === 'fin' && (
            <div className="mjx-final">
              <span>🕊️</span>
              <span className="leyenda">Do not be afraid. Jesus is with you.</span>
            </div>
          )}
        </div>

        <p className="mjx-pie">{pie}</p>
      </div>
    </Marco>
  )
}
