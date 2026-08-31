import { useCallback, useEffect, useRef, useState } from 'react'
import { Marco } from '../../componentes/Marco'
import { chispita, paz } from '../../audio/sonidos-extra'
import { distanciaASegmento, useCola, useGestoContinuo, useInactividad, useLocutor } from './motor/gestos'
import './motor/estilos.css'

/**
 * TRACE THE HOLY CROSS — el dedo traza la Señal de la Cruz.
 *
 * Por qué este juego y no otro: la Señal de la Cruz es la primera oración de
 * un católico y es ENTERAMENTE un gesto. No se aprende leyéndola ni oyéndola:
 * se aprende con la mano. Un juego de tocar botones no puede enseñarla; uno
 * donde el dedo recorre el camino frente → pecho → hombro → hombro, sí.
 *
 * Y de regalo trae el mejor vocabulario que existe para esta edad: las partes
 * del cuerpo. `forehead`, `chest`, `shoulder` no se enseñan con una tarjeta —
 * se enseñan tocándose, que es exactamente el Total Physical Response del §1.4
 * de la investigación. La palabra y el músculo entran juntos.
 *
 * EL ESPEJO. La figura de la pantalla es el reflejo de José, no alguien
 * mirándolo de frente. Por eso el hombro izquierdo está a la IZQUIERDA de la
 * pantalla: cuando él copie el gesto sobre su propio cuerpo, el lado le va a
 * coincidir. Con la convención contraria —una persona de frente, cuyo hombro
 * izquierdo cae a nuestra derecha— aprendería el gesto al revés, y en la Misa
 * se persignaría al revés. Es el único detalle de este archivo que hay que
 * respetar sí o sí.
 *
 * ES UN SOLO TRAZO, NO CUATRO TOQUES. La primera versión de este juego frenaba
 * el avance mientras sonaba cada verso: se tocaba la frente, se escuchaba "In
 * the name of the Father," y recién entonces se aceptaba el pecho. Probándolo
 * con un puntero de verdad quedó claro que estaba mal de raíz. Nadie se
 * persigna en cuatro toques separados: la mano baja de la frente al pecho y
 * cruza de un hombro al otro de corrido, en un segundo. Con el freno, José
 * hacía el gesto entero, la app le acreditaba solo la frente, y como el dedo
 * ya no se movía más tampoco llegaba ningún evento nuevo: la pantalla quedaba
 * trabada con el dedo encima.
 *
 * Ahora el dedo nunca espera. Cada punto que cruza se acredita al instante y
 * el verso se ENCOLA (ver `useCola`). Si traza la cruz de un tirón oye la
 * oración entera y seguida, que es como se reza; si va despacio oye un verso
 * por punto. Los dos caminos están bien porque el que manda es él.
 *
 * Y como el dedo manda muestras y no una línea continua, cada punto se mide
 * contra el SEGMENTO entre la muestra anterior y la actual: un trazo rápido no
 * puede saltar por encima de un blanco sin tocarlo.
 *
 * DOS VUELTAS, Y LA SEGUNDA CON MENOS AYUDA. En la primera el entrenador dice
 * a dónde va la mano; en la segunda solo queda la oración. El andamio se
 * retira cuando ya no hace falta, que es lo que separa enseñar de dictar.
 *
 * José no puede perder. No hay tiempo, no hay error, y lo que ya trazó se
 * queda trazado aunque levante el dedo.
 */

type Punto = {
  id: string
  /** Coordenadas dentro del cuadrado de 100 × 100 de la escena. */
  x: number
  y: number
  /** La orden del entrenador. Solo suena si se queda quieto, y solo la vuelta 1. */
  orden: string
  /** Dónde queda esa parte del cuerpo. Es la ayuda de la vuelta 2. */
  ayuda: string
  /** El verso de la oración que se gana al llegar. */
  verso: string
}

const PUNTOS: Punto[] = [
  {
    id: 'forehead',
    x: 50,
    y: 12,
    orden: 'Touch your forehead.',
    ayuda: 'Your forehead is up here.',
    verso: 'In the name of the Father,',
  },
  {
    id: 'chest',
    x: 50,
    y: 58,
    orden: 'Touch your chest.',
    ayuda: 'Your chest is right here.',
    verso: 'and of the Son,',
  },
  {
    // A la izquierda de la pantalla porque la escena es un ESPEJO. Ver arriba.
    id: 'left',
    x: 31,
    y: 43,
    orden: 'Touch your left shoulder.',
    ayuda: 'Your left shoulder is over here.',
    verso: 'and of the Holy Spirit.',
  },
  {
    id: 'right',
    x: 69,
    y: 43,
    orden: 'Touch your right shoulder.',
    ayuda: 'Your right shoulder is over here.',
    verso: 'Amen!',
  },
]

/**
 * Doce unidades de radio sobre cien. Es un blanco enorme a propósito: el dedo
 * de un niño de cuatro años tapa más pantalla que el punto al que apunta, y
 * un blanco chico convierte una oración en una prueba de puntería.
 */
const TOLERANCIA = 12

const VUELTAS = 2

export function TraceTheCross({ onVolver, onPanel }: { onVolver: () => void; onPanel: () => void }) {
  const escena = useRef<HTMLDivElement>(null)
  const rastro = useRef<SVGLineElement>(null)
  const voz = useLocutor()
  const cola = useCola(voz)

  const [paso, setPaso] = useState(0)
  const [terminado, setTerminado] = useState(false)
  const [pie, setPie] = useState('')

  // Lo que leen los manejadores del dedo, que no se rehacen en cada render.
  const pasoRef = useRef(0)
  const vueltaRef = useRef(0)
  const finRef = useRef(false)
  /** La muestra anterior del dedo, para medir contra el segmento recorrido. */
  const previo = useRef<{ x: number; y: number } | null>(null)

  const objetivo = PUNTOS[paso]

  /**
   * Si se queda quieto, se le recuerda a dónde va la mano. En la primera
   * vuelta es la orden ("Touch your chest."); en la segunda, la pista de dónde
   * queda esa parte del cuerpo, que es una frase distinta para la misma idea:
   * oír lo mismo dicho de dos maneras es lo que despega el significado de la
   * fórmula.
   */
  const { reiniciar: reiniciarAyuda, limpiar: limpiarAyuda } = useInactividad(5000, () => {
    const p = PUNTOS[pasoRef.current]
    if (!p || finRef.current || cola.hablando()) return
    const frase = vueltaRef.current === 0 ? p.orden : p.ayuda
    setPie(frase)
    cola.encolar(frase)
  })

  /** Lleva el rastro del dedo desde el último punto logrado hasta donde está. */
  const pintarRastro = useCallback((x: number | null, y: number | null) => {
    const linea = rastro.current
    if (!linea) return
    if (x === null || y === null || pasoRef.current === 0 || pasoRef.current >= PUNTOS.length) {
      linea.setAttribute('opacity', '0')
      return
    }
    const desde = PUNTOS[pasoRef.current - 1]
    linea.setAttribute('x1', String(desde.x))
    linea.setAttribute('y1', String(desde.y))
    linea.setAttribute('x2', String(x))
    linea.setAttribute('y2', String(y))
    linea.setAttribute('opacity', '1')
  }, [])

  /** Cruzó el punto que tocaba. Nada de esto bloquea al dedo. */
  const conquistar = useCallback(
    (indice: number) => {
      if (finRef.current || pasoRef.current !== indice) return
      chispita()
      limpiarAyuda()

      const punto = PUNTOS[indice]
      const siguiente = indice + 1
      pasoRef.current = siguiente
      setPaso(siguiente)
      setPie(punto.verso)
      pintarRastro(null, null)
      cola.encolar(punto.verso)

      if (siguiente < PUNTOS.length) {
        reiniciarAyuda()
        return
      }

      // Cruz completa.
      paz()
      if (vueltaRef.current + 1 < VUELTAS) {
        vueltaRef.current += 1
        cola.encolar(
          { espera: 250 },
          'This is the Sign of the Cross!',
          { espera: 300 },
          'Let us make the Sign of the Cross!',
          // La cruz se borra recién acá, cuando la voz ya invitó a rehacerla:
          // si se borrara al instante, José vería desaparecer su trazo sin
          // entender por qué.
          {
            hacer: () => {
              pasoRef.current = 0
              setPaso(0)
              setPie('')
              reiniciarAyuda()
            },
          },
        )
        return
      }

      finRef.current = true
      setTerminado(true)
      setPie('Beautiful! You made the Sign of the Cross!')
      cola.encolar(
        { espera: 300 },
        'Beautiful! You made the Sign of the Cross!',
        { espera: 400 },
        'Now do it on your own body!',
        { espera: 1400 },
        'Good job! God loves you!',
        { espera: 700 },
        { hacer: onVolver },
      )
    },
    [cola, limpiarAyuda, onVolver, pintarRastro, reiniciarAyuda],
  )

  /** ¿El trazo pasó por el punto de turno? */
  const revisar = useCallback(
    (nx: number, ny: number) => {
      if (finRef.current) return
      const x = nx * 100
      const y = ny * 100
      const antes = previo.current ?? { x, y }
      previo.current = { x, y }

      const punto = PUNTOS[pasoRef.current]
      if (!punto) return
      // Contra el segmento recorrido, no contra la muestra: ver la cabecera.
      if (distanciaASegmento(punto.x, punto.y, antes.x, antes.y, x, y) <= TOLERANCIA) {
        conquistar(pasoRef.current)
      } else {
        pintarRastro(x, y)
      }
    },
    [conquistar, pintarRastro],
  )

  useGestoContinuo(
    escena,
    {
      inicio: (p) => {
        previo.current = null
        reiniciarAyuda()
        revisar(p.nx, p.ny)
      },
      mover: (p) => revisar(p.nx, p.ny),
      fin: () => {
        previo.current = null
        pintarRastro(null, null)
        // Levantó el dedo con la cruz a medio hacer. No es un error —lo que
        // trazó se le queda— pero conviene decirle que el trazo es uno solo,
        // porque el gesto de verdad no se hace en pedacitos.
        const enMitad = pasoRef.current > 0 && pasoRef.current < PUNTOS.length
        if (enMitad && !finRef.current && !cola.hablando()) {
          cola.encolar('Keep your finger on the light.')
        }
      },
    },
    !terminado,
  )

  // La presentación. Se dice una sola vez, al entrar.
  useEffect(() => {
    setPie(PUNTOS[0].orden)
    cola.encolar(
      { espera: 350 },
      'Let us make the Sign of the Cross!',
      { espera: 200 },
      'Slide your finger to the light!',
      PUNTOS[0].orden,
      { hacer: reiniciarAyuda },
    )
    // Solo al montar: la secuencia de apertura no se repite nunca.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Los tramos ya trazados, en orden. */
  const hechos = PUNTOS.slice(0, paso)

  return (
    <Marco paso={paso} total={PUNTOS.length} onPanel={onPanel} onInicio={onVolver}>
      <div className="mjx-pantalla">
        <p className="mjx-titulo">Trace the Holy Cross</p>

        <div className="mjx-escena cuadrada" ref={escena}>
          <svg className="mjx-cuerpo" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {/* La silueta: la cabeza, el cuello y el torso de un niño. Sin
                cara, para que José se vea a sí mismo y no a otro. */}
            <g fill="#f2e3c8" stroke="#d9c19a" strokeWidth="1.2">
              {/* La cabeza llega hasta y=5,5: por eso el punto de la FRENTE
                  está en y=12, en el tercio de arriba. Con la cabeza más baja
                  la "frente" caía en el medio de la cara y el gesto que José
                  copiaba sobre su cuerpo era el equivocado. */}
              <circle cx="50" cy="19" r="13.5" />
              <rect x="45.5" y="29.5" width="9" height="10" rx="4.5" />
              {/* Los hombros son las esquinas redondeadas del tronco, no dos
                  bolas pegadas al costado: con bolas, la silueta se leía como
                  un osito de peluche y no como un niño. */}
              <circle cx="32" cy="43" r="7.5" />
              <circle cx="68" cy="43" r="7.5" />
              <path d="M32 43 Q32 37 40 36.5 L60 36.5 Q68 37 68 43 L68 84 Q68 90 61 90 L39 90 Q32 90 32 84 Z" />
            </g>

            {/* Los tramos ya recorridos: la cruz que se va dibujando en oro. */}
            {hechos.slice(1).map((p, i) => {
              const desde = hechos[i]
              return (
                <line
                  key={p.id}
                  x1={desde.x}
                  y1={desde.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--oro)"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              )
            })}

            {/* El rastro vivo, del último punto logrado al dedo. */}
            <line
              ref={rastro}
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              stroke="var(--oro)"
              strokeWidth="3.4"
              strokeLinecap="round"
              opacity="0"
            />

            {/* Los puntos ya conquistados. */}
            {hechos.map((p) => (
              <circle key={p.id} cx={p.x} cy={p.y} r="3.6" fill="var(--verde-claro)" />
            ))}

            {/* El punto de turno: late, con halo, y es lo único que se mueve. */}
            {objetivo && !terminado && (
              <g>
                <circle
                  className="mjx-halo"
                  cx={objetivo.x}
                  cy={objetivo.y}
                  r="6"
                  fill="none"
                  stroke="var(--oro)"
                  strokeWidth="1.6"
                />
                <circle
                  className="mjx-guia"
                  style={{ ['--r' as string]: '5.4px' }}
                  cx={objetivo.x}
                  cy={objetivo.y}
                  r="5.4"
                  fill="var(--oro)"
                />
              </g>
            )}
          </svg>

          {terminado && (
            <div className="mjx-final">
              <span>✝️</span>
              <span className="leyenda">Amen!</span>
            </div>
          )}
        </div>

        <p className="mjx-pie">{pie}</p>
      </div>
    </Marco>
  )
}
