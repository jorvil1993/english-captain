import { useCallback, useEffect, useRef, useState } from 'react'
import { Marco } from '../../componentes/Marco'
import { florecer, paz, recoger } from '../../audio/sonidos-extra'
import { acercar, limitar, useBucle, useGestoContinuo, useInactividad, useLocutor } from './motor/gestos'
import { Fondo } from './motor/Fondo'
import './motor/estilos.css'

/**
 * GUARDIAN ANGEL CATCH — el ángel sigue al dedo y recoge las estrellas.
 *
 * Es el único de los cinco que pide reacción: algo cae y hay que llegar a
 * tiempo. Un niño colérico necesita eso —velocidad, cuerpo, urgencia— y hasta
 * ahora la app no se lo daba en ningún lado. La diferencia con un juego de
 * reflejos cualquiera está en lo que pasa cuando NO llega.
 *
 * LA ESTRELLA QUE SE CAE SE VUELVE FLOR. No hay estrella perdida, no hay
 * sonido feo, no hay contador de fallos, no hay nada que se ponga rojo. Donde
 * cayó, crece una flor y la maestra dice "A little flower for God!". Al final
 * el suelo queda lleno de flores y eso también es bonito. Es la regla 4 del
 * proyecto llevada hasta el final: José no pierde nunca, ni siquiera un poco,
 * ni siquiera en un juego de velocidad. Un niño que no tolera que se rían de
 * él no puede tener una pantalla que le marque los errores.
 *
 * EL INGLÉS ES LA JUGADA. Cuando aparece una estrella lejos del ángel, el
 * entrenador dice "Go left!" o "Go right!" — y José tiene que moverse para
 * allá o la pierde. `left` y `right` no se explican: se obedecen, y por eso se
 * aprenden. Es Total Physical Response con premio inmediato (§1.4).
 *
 * EL ÁNGEL VA SOLO POR EL EJE HORIZONTAL, a una altura fija. Si siguiera al
 * dedo en las dos direcciones bastaría con poner el dedo encima de la estrella
 * y no habría ni anticipación ni tiempo ni movimiento: el juego se resolvería
 * solo y no enseñaría ninguna dirección.
 */

type Estrella = {
  id: number
  /** Porcentaje del ancho de la escena. */
  x: number
  /** Porcentaje del alto. Arranca arriba de la escena, en negativo. */
  y: number
  /** Porcentaje de alto por segundo. */
  vel: number
}

/** La altura a la que vuela el ángel, en porcentaje de la escena. */
const ALTURA_ANGEL = 74

/** Ventana de captura: media franja de alto y medio ancho, en porcentaje. */
const ALCANCE_Y = 9
const ALCANCE_X = 12

/** El suelo. Más abajo de esto, la estrella se vuelve flor. */
const SUELO = 92

const META = 8

export function GuardianAngelCatch({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const escena = useRef<HTMLDivElement>(null)
  const angel = useRef<HTMLDivElement>(null)
  const voz = useLocutor()

  const [recogidas, setRecogidas] = useState(0)
  const [flores, setFlores] = useState<{ id: number; x: number }[]>([])
  const [enCaida, setEnCaida] = useState<{ id: number; x: number }[]>([])
  const [terminado, setTerminado] = useState(false)
  const [pie, setPie] = useState('')

  // Todo lo que cambia sesenta veces por segundo vive en referencias: pasarlo
  // por `useState` obligaría a React a rehacer la pantalla en cada frame.
  const estrellas = useRef<Estrella[]>([])
  const nodos = useRef(new Map<number, HTMLDivElement | null>())
  const posAngel = useRef(50)
  const destinoAngel = useRef(50)
  const proximaEn = useRef(1.1)
  const contador = useRef(0)
  const recogidasRef = useRef(0)
  const nacidas = useRef(0)
  const fin = useRef(false)

  const { reiniciar: reiniciarAyuda } = useInactividad(6500, () => {
    if (!fin.current) void voz.di('Move the angel with your finger!')
  })

  const guardarNodo = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) nodos.current.set(id, el)
    else nodos.current.delete(id)
  }, [])

  const cerrar = useCallback(async () => {
    // Dos estrellas pueden entrar al alcance del ángel en el MISMO cuadro: el
    // bucle recorre todas las que caen y la octava no corta el recorrido. Sin
    // esta guarda, la novena volvería a cerrar el juego y José oiría la
    // despedida dos veces, encimada.
    if (fin.current) return
    setTerminado(true)
    fin.current = true
    paz()
    setPie('All the stars are home! Amen!')
    if (!(await voz.di('All the stars are home! Amen!'))) return
    if (!(await voz.pausa(300))) return
    if (!(await voz.di('My angel takes care of me.'))) return
    if (!(await voz.pausa(250))) return
    if (!(await voz.di('Ever this day be at my side!'))) return
    if (!(await voz.pausa(500))) return
    if (!(await voz.di('Good job! God loves you!'))) return
    if (!(await voz.pausa(700))) return
    onVolver()
  }, [onVolver, voz])

  useBucle((dt) => {
    if (fin.current) return

    // ── El ángel persigue al dedo, pero con inercia ──────────────────────
    // El seguimiento suave (y no pegar el ángel al dedo) es lo que hace que
    // haya que ANTICIPARSE. Además evita el tirón brusco que a este niño le
    // molesta: el ángel llega, no salta.
    posAngel.current = acercar(posAngel.current, destinoAngel.current, 11, dt)
    if (angel.current) angel.current.style.left = `${posAngel.current}%`

    // ── Nacen estrellas ─────────────────────────────────────────────────
    proximaEn.current -= dt
    // Sin tope de estrellas: se siguen sembrando hasta que junte las ocho. Un
    // tope dejaría el juego trabado para siempre justo con el niño al que más
    // le cuesta atinar, que es exactamente al que no se le puede trabar.
    if (proximaEn.current <= 0 && estrellas.current.length < 3) {
      const id = ++contador.current
      const x = 10 + Math.random() * 80
      // Sube poquísimo con el avance: se nota que va más rápido pero nunca
      // llega a ser imposible. Al ritmo del §1.10: nada de vértigo.
      const vel = 21 + recogidasRef.current * 1.6 + Math.random() * 5
      estrellas.current.push({ id, x, y: -10, vel })
      nacidas.current += 1
      setEnCaida((v) => [...v, { id, x }])

      // La orden en inglés, solo cuando la estrella cae claramente a un lado:
      // decir "go left" para algo que está enfrente enseñaría lo contrario.
      const lejos = x - posAngel.current
      if (nacidas.current % 2 === 1 && Math.abs(lejos) > 22) {
        void voz.di(lejos < 0 ? 'Go left!' : 'Go right!')
      }
      proximaEn.current = Math.max(1.15, 2.0 - recogidasRef.current * 0.09)
    }

    // ── Caen, y se resuelven ────────────────────────────────────────────
    const quedan: Estrella[] = []
    for (const e of estrellas.current) {
      e.y += e.vel * dt
      const nodo = nodos.current.get(e.id)
      if (nodo) nodo.style.top = `${e.y}%`

      const aLaAltura = Math.abs(e.y - ALTURA_ANGEL) <= ALCANCE_Y
      const alAlcance = Math.abs(e.x - posAngel.current) <= ALCANCE_X

      if (aLaAltura && alAlcance) {
        recoger()
        recogidasRef.current += 1
        const n = recogidasRef.current
        setRecogidas(n)
        setEnCaida((v) => v.filter((s) => s.id !== e.id))
        reiniciarAyuda()
        if (n >= META) {
          void cerrar()
        } else if (n % 3 === 0) {
          void voz.di('You caught it!')
        } else if (n % 3 === 1 && n > 1) {
          void voz.di('One more star!')
        } else if (n % 3 === 2) {
          void voz.di('The angel is fast!')
        }
        continue
      }

      if (e.y >= SUELO) {
        // No se perdió: floreció.
        florecer()
        setEnCaida((v) => v.filter((s) => s.id !== e.id))
        // Solo las últimas: si la tablet se queda abierta media hora sin que
        // nadie juegue, un jardín sin tope sería un nodo nuevo cada segundo y
        // medio, para siempre. Veinticuatro flores ya se ven como un jardín.
        setFlores((v) => [...v, { id: e.id, x: e.x }].slice(-24))
        if (e.id % 3 === 0) void voz.di('A little flower for God!')
        continue
      }

      quedan.push(e)
    }
    estrellas.current = quedan
  }, !terminado)

  useGestoContinuo(
    escena,
    {
      inicio: (p) => {
        reiniciarAyuda()
        destinoAngel.current = limitar(p.nx * 100, 6, 94)
      },
      mover: (p) => {
        destinoAngel.current = limitar(p.nx * 100, 6, 94)
      },
    },
    !terminado,
  )

  useEffect(() => {
    void (async () => {
      if (!(await voz.pausa(350))) return
      if (!(await voz.di('Angel of God, my guardian dear!'))) return
      setPie('Move the angel with your finger!')
      if (!(await voz.di('Move the angel with your finger!'))) return
      if (!(await voz.di('Catch the falling stars!'))) return
      setPie('Catch the star!')
      reiniciarAyuda()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Marco paso={recogidas} total={META} onPanel={onPanel} onInicio={onInicio}>
      <div className="mjx-pantalla">
        <p className="mjx-titulo">Guardian Angel Catch</p>

        <div className="mjx-escena" ref={escena}>
          <div className="mjx-cielo" />
          <Fondo img="mjx-dawn-sky" anclaje="abajo" />
          <div className="mjx-suelo" />

          {flores.map((f) => (
            <span
              key={f.id}
              className="mjx-cae"
              style={{ left: `${f.x}%`, top: '93%', opacity: 0.95 }}
            >
              🌼
            </span>
          ))}

          {enCaida.map((e) => (
            <div
              key={e.id}
              className="mjx-cae"
              ref={(el) => guardarNodo(e.id, el)}
              style={{ left: `${e.x}%`, top: '-10%' }}
            >
              ⭐
            </div>
          ))}

          <div className="mjx-angel" ref={angel} style={{ left: '50%', top: `${ALTURA_ANGEL}%` }}>
            👼
          </div>

          {terminado && (
            <div className="mjx-final">
              <span>👼</span>
              <span className="leyenda">Angel of God, my guardian dear!</span>
            </div>
          )}
        </div>

        <div className="mjx-marcador" aria-hidden>
          {Array.from({ length: META }, (_, i) => (
            <span key={i} className={`mjx-ficha ${i < recogidas ? 'llena' : ''}`}>
              ⭐
            </span>
          ))}
        </div>

        <p className="mjx-pie">{pie}</p>
      </div>
    </Marco>
  )
}
