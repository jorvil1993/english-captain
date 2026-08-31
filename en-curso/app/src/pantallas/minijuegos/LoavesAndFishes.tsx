import { useCallback, useEffect, useRef, useState } from 'react'
import { Marco } from '../../componentes/Marco'
import { servir, paz, chispita } from '../../audio/sonidos-extra'
import { useGestoContinuo, useInactividad, useLocutor } from './motor/gestos'
import { Fondo } from './motor/Fondo'
import './motor/estilos.css'

/**
 * LOAVES AND FISHES — arrastrar la comida hasta el niño que la pidió.
 *
 * El milagro de los panes y los peces es la catequesis más fácil de jugar que
 * existe, porque el gesto del milagro ES el gesto del juego: agarrar comida y
 * dársela a alguien. José no lee sobre compartir; comparte cinco veces
 * seguidas con el dedo.
 *
 * LA CANASTA NO SE VACÍA NUNCA, y eso no es una comodidad de programador: es
 * el milagro. En el evangelio la comida alcanza para todos y sobran doce
 * canastas. Si la canasta se agotara, el juego contaría la historia al revés.
 *
 * QUÉ SE APRENDE DE INGLÉS. Dos cosas, y las dos se entienden sin traducir:
 *   · `bread` y `fish` — dos sustantivos que se distinguen por lo que hace la
 *     mano. José toma el pan cuando oye "bread" y el pescado cuando oye
 *     "fish"; el significado cae solo por coincidencia repetida, que es
 *     aprendizaje trans-situacional puro (§1.1 de la investigación).
 *   · Contar `one` … `five` — y contar de verdad, porque el número lo dice la
 *     app cuando ya hay esa cantidad de niños servidos. Un número dicho sobre
 *     una cantidad que se ve es lo único que enseña a contar a esta edad; una
 *     lista recitada no.
 *
 * SIN CASTIGO, PERO CON ENSEÑANZA. Si agarra el pescado cuando le pidieron
 * pan, la app no dice que se equivocó: dice "Fish!" —le pone el nombre a lo
 * que efectivamente tiene en la mano, que es información nueva y gratis— y
 * vuelve a pedir el pan. Si suelta la comida en el aire o sobre otro niño, la
 * comida vuelve a la canasta sin ruido y sin comentario.
 *
 * Y EL DEDO NUNCA ESPERA A QUE LA MAESTRA TERMINE. Agarrar y soltar funcionan
 * siempre, incluso mientras la app está hablando; una entrega buena la
 * interrumpe en el acto. La versión anterior se ponía "ocupada" mientras
 * narraba y descartaba lo que José hiciera en esos seis segundos: él llevaba
 * el pan hasta el nene, lo soltaba encima, y no pasaba nada. Se vio jugando
 * con un puntero de verdad. La regla vive en `useLocutor`.
 */

type Vianda = 'bread' | 'fish'

const EMOJI: Record<Vianda, string> = { bread: '🍞', fish: '🐟' }
const NOMBRE: Record<Vianda, string> = { bread: 'Bread!', fish: 'Fish!' }
const ORDEN: Record<Vianda, string> = {
  bread: 'Drag the bread to the child!',
  fish: 'Drag the fish to the child!',
}
const ENTREGA: Record<Vianda, string> = {
  bread: 'One bread for you!',
  fish: 'One fish for you!',
}

const CUENTA = ['One!', 'Two!', 'Three!', 'Four!', 'Five!']

type Comensal = {
  id: string
  /** Porcentaje del ancho y del alto de la escena. */
  x: number
  y: number
  cara: string
  quiere: Vianda
}

/** Cinco niños en arco, y el orden en que se les sirve es el del arreglo. */
const COMENSALES: Comensal[] = [
  { id: 'c1', x: 13, y: 66, cara: '🧒', quiere: 'bread' },
  { id: 'c2', x: 31, y: 57, cara: '👦', quiere: 'fish' },
  { id: 'c3', x: 50, y: 53, cara: '👧', quiere: 'bread' },
  { id: 'c4', x: 69, y: 57, cara: '🧒', quiere: 'fish' },
  { id: 'c5', x: 87, y: 66, cara: '👦', quiere: 'bread' },
]

/** Las dos viandas de la canasta, en porcentaje de la escena. */
const CANASTA: { tipo: Vianda; x: number; y: number }[] = [
  { tipo: 'bread', x: 40, y: 86 },
  { tipo: 'fish', x: 60, y: 86 },
]

export function LoavesAndFishes({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const escena = useRef<HTMLDivElement>(null)
  const mano = useRef<HTMLDivElement>(null)
  const voz = useLocutor()

  const [servidos, setServidos] = useState<string[]>([])
  const [enMano, setEnMano] = useState<Vianda | null>(null)
  const [terminado, setTerminado] = useState(false)
  const [pie, setPie] = useState('')

  const indiceRef = useRef(0)
  const enManoRef = useRef<Vianda | null>(null)
  const finRef = useRef(false)
  const narrando = useRef(false)
  /** Dónde poner la comida en cuanto React la monte pegada al dedo. */
  const posicionInicial = useRef({ x: 0, y: 0 })

  const objetivo = COMENSALES[servidos.length] as Comensal | undefined

  const { reiniciar: reiniciarAyuda, limpiar: limpiarAyuda } = useInactividad(7000, () => {
    const c = COMENSALES[indiceRef.current]
    if (c && !narrando.current && !finRef.current) void voz.di(ORDEN[c.quiere])
  })

  /** Mueve la comida que va pegada al dedo. Sin pasar por React: es cada frame. */
  const moverMano = useCallback((x: number, y: number) => {
    const el = mano.current
    if (!el) return
    el.style.left = `${x}px`
    el.style.top = `${y}px`
  }, [])

  useEffect(() => {
    if (enMano) moverMano(posicionInicial.current.x, posicionInicial.current.y)
  }, [enMano, moverMano])

  /** El radio del blanco, en píxeles: generoso, medido sobre el lado corto. */
  const radio = (ancho: number, alto: number) => Math.min(ancho, alto) * 0.19

  const entregar = useCallback(
    async (comensal: Comensal, indice: number) => {
      // Ese niño ya comió. No debería poder pasar —solo hay un dedo y una
      // entrega por soltada— pero si alguna vez pasara, se contaría dos veces
      // el mismo plato y la cuenta en inglés saltaría un número.
      if (indiceRef.current !== indice) return
      // La serie nueva calla lo que la maestra estuviera diciendo: José
      // acaba de hacer algo y lo que hizo manda.
      const s = voz.nueva()
      narrando.current = true
      limpiarAyuda()
      servir()

      const cuantos = indice + 1
      setServidos((v) => [...v, comensal.id])
      indiceRef.current = cuantos

      // El número se dice DESPUÉS de que el niño ya está servido, para que
      // José vea la cantidad mientras la oye.
      setPie(CUENTA[indice])
      if (!(await voz.di(CUENTA[indice], s))) return
      setPie(ENTREGA[comensal.quiere])
      if (!(await voz.di(ENTREGA[comensal.quiere], s))) return
      if (!(await voz.di('Yummy! Thank you!', s))) return

      const siguiente = COMENSALES[cuantos]
      if (siguiente) {
        if (cuantos === 1) {
          // Una sola vez, justo cuando podría preocuparle que se acabe.
          setPie('The basket is never empty!')
          if (!(await voz.di('The basket is never empty!', s))) return
        }
        setPie(ORDEN[siguiente.quiere])
        if (!(await voz.di(ORDEN[siguiente.quiere], s))) return
        narrando.current = false
        reiniciarAyuda()
        return
      }

      // Todos comieron.
      finRef.current = true
      setTerminado(true)
      paz()
      setPie('Jesus gives food to everyone.')
      if (!(await voz.di('Jesus gives food to everyone.', s))) return
      if (!(await voz.pausa(300, s))) return
      setPie('Everybody is full! Thank you, Jesus!')
      if (!(await voz.di('Everybody is full! Thank you, Jesus!', s))) return
      if (!(await voz.pausa(600, s))) return
      if (!(await voz.di('Good job! God loves you!', s))) return
      if (!(await voz.pausa(700, s))) return
      onVolver()
    },
    [limpiarAyuda, onVolver, reiniciarAyuda, voz],
  )

  /** Soltó lo que tenía: o llegó a destino, o vuelve a la canasta. */
  const soltar = useCallback(
    (x: number, y: number, ancho: number, alto: number) => {
      const llevaba = enManoRef.current
      enManoRef.current = null
      setEnMano(null)
      if (!llevaba || finRef.current) return

      const indice = indiceRef.current
      const comensal = COMENSALES[indice]
      if (!comensal) return

      const cx = (comensal.x / 100) * ancho
      const cy = (comensal.y / 100) * alto
      const cerca = Math.hypot(x - cx, y - cy) <= radio(ancho, alto)

      if (cerca && llevaba === comensal.quiere) {
        void entregar(comensal, indice)
      } else {
        // No pasó nada malo. La comida vuelve sola y se recuerda el pedido.
        reiniciarAyuda()
      }
    },
    [entregar, reiniciarAyuda],
  )

  useGestoContinuo(
    escena,
    {
      inicio: (p) => {
        if (finRef.current) return
        reiniciarAyuda()
        const r = radio(p.ancho, p.alto)
        // ¿Bajó el dedo sobre alguna de las dos viandas de la canasta?
        for (const v of CANASTA) {
          const vx = (v.x / 100) * p.ancho
          const vy = (v.y / 100) * p.alto
          if (Math.hypot(p.x - vx, p.y - vy) <= r) {
            chispita()
            posicionInicial.current = { x: p.x, y: p.y }
            enManoRef.current = v.tipo
            setEnMano(v.tipo)
            // Se le pone nombre a lo que agarró, sea lo pedido o no — pero
            // sin pisar a la maestra si está contando: agarrar siempre
            // funciona, y la etiqueta puede esperar al silencio.
            if (!narrando.current) void voz.di(NOMBRE[v.tipo])
            return
          }
        }
      },
      mover: (p) => {
        if (enManoRef.current) moverMano(p.x, p.y)
      },
      fin: (p) => soltar(p.x, p.y, p.ancho, p.alto),
    },
    !terminado,
  )

  useEffect(() => {
    void (async () => {
      const s = voz.nueva()
      narrando.current = true
      if (!(await voz.pausa(350, s))) return
      if (!(await voz.di('The children are hungry!', s))) return
      if (!(await voz.di('Five loaves and two fish.', s))) return
      if (!(await voz.di('Take the food with your finger!', s))) return
      setPie(ORDEN[COMENSALES[0].quiere])
      if (!(await voz.di(ORDEN[COMENSALES[0].quiere], s))) return
      narrando.current = false
      reiniciarAyuda()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Marco paso={servidos.length} total={COMENSALES.length} onPanel={onPanel} onInicio={onInicio}>
      <div className="mjx-pantalla">
        <p className="mjx-titulo">Loaves and Fishes</p>

        <div className="mjx-escena" ref={escena}>
          <div className="mjx-cielo" />
          <Fondo img="mjx-hillside" anclaje="abajo" />

          {COMENSALES.map((c) => {
            const servido = servidos.includes(c.id)
            const esperando = !servido && objetivo?.id === c.id && !terminado
            return (
              <div
                key={c.id}
                className={`mjx-comensal ${servido ? 'servido' : ''} ${esperando ? 'esperando' : ''}`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                {/* Lo que pide va ARRIBA de la cabeza, como un globo de
                    pensamiento: José no lee, así que el pedido tiene que
                    verse. Lo que ya recibió va abajo, como un plato servido. */}
                <span className="pedido">{esperando ? EMOJI[c.quiere] : ''}</span>
                <span className="cara">{servido ? '😋' : c.cara}</span>
                <span className="plato">{servido ? EMOJI[c.quiere] : ''}</span>
              </div>
            )
          })}

          <div className="mjx-canasta" />
          {CANASTA.map((v) => (
            <span
              key={v.tipo}
              className={`mjx-vianda ${objetivo?.quiere === v.tipo && !terminado ? 'activa' : ''}`}
              style={{ left: `${v.x}%`, top: `${v.y}%` }}
            >
              {EMOJI[v.tipo]}
            </span>
          ))}

          {enMano && (
            <div className="mjx-en-mano" ref={mano}>
              {EMOJI[enMano]}
            </div>
          )}

          {terminado && (
            <div className="mjx-final">
              <span>🧺</span>
              <span className="leyenda">Thank you, Jesus!</span>
            </div>
          )}
        </div>

        <div className="mjx-marcador" aria-hidden>
          {COMENSALES.map((c) => (
            <span key={c.id} className={`mjx-ficha ${servidos.includes(c.id) ? 'llena' : ''}`}>
              🍽️
            </span>
          ))}
        </div>

        <p className="mjx-pie">{pie}</p>
      </div>
    </Marco>
  )
}
