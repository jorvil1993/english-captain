/**
 * EL MOTOR DE LOS JUEGOS DE MOVIMIENTO.
 *
 * Cinco juegos que se juegan con el dedo en movimiento comparten tres
 * problemas que nada del resto de la app tenía, y los tres se resuelven acá
 * una sola vez:
 *
 *   1. **La voz que sigue hablando cuando la pantalla ya no está.** Toda la
 *      app narra con `await decir(...)` dentro de funciones async. Si José
 *      toca la casita en medio de una secuencia, el componente se desmonta
 *      pero la cadena de `await` sigue corriendo en el aire —y varias
 *      terminan llamando a `onVolver()`, que hace navegar la app SOLA un
 *      segundo después de que el niño ya eligió otra cosa. `useLocutor` corta
 *      la cadena de raíz: al desmontar calla el audio y todas las esperas
 *      pendientes se resuelven en falso.
 *
 *   2. **El bucle de animación.** Estrellas que caen, olas que suben, cuerdas
 *      que vuelven a su sitio: eso no se hace con `setState` sesenta veces por
 *      segundo. `useBucle` da un `requestAnimationFrame` limpio con delta en
 *      segundos, y el que lo usa mueve el DOM por referencia.
 *
 *   3. **El dedo.** En una tablet, un arrastre que no bloquea el gesto del
 *      navegador termina haciendo scroll o zoom en vez de jugar, y si el dedo
 *      sale del elemento el arrastre se pierde a la mitad. `useGestoContinuo`
 *      usa Pointer Events con captura, así que una vez que el dedo bajó, el
 *      juego lo sigue hasta que se levante, aunque se salga de la pantalla.
 *
 * Nada de esto es específico de un juego: es la cañería.
 */

import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { callar, decir } from '../../../audio/voz'

// ── Cuentas chicas ────────────────────────────────────────────────────────

export function limitar(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

export function distancia(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx
  const dy = ay - by
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Distancia de un punto al SEGMENTO a-b (no a la recta infinita).
 *
 * Hace falta porque el dedo no manda su posición de forma continua: manda
 * muestras, y entre dos muestras hay un salto. Un trazo rápido puede pasar
 * limpiamente por encima de un blanco y que ninguna de las dos muestras caiga
 * dentro de él. Midiendo contra el segmento que las une, el blanco se da por
 * tocado igual — que es lo que de verdad pasó.
 */
export function distanciaASegmento(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const vx = bx - ax
  const vy = by - ay
  const largo = vx * vx + vy * vy
  if (largo === 0) return distancia(px, py, ax, ay)
  let t = ((px - ax) * vx + (py - ay) * vy) / largo
  t = t < 0 ? 0 : t > 1 ? 1 : t
  return distancia(px, py, ax + t * vx, ay + t * vy)
}

/** Interpolación suave hacia un objetivo, independiente de los fps. */
export function acercar(actual: number, objetivo: number, velocidad: number, dt: number): number {
  const k = 1 - Math.exp(-velocidad * dt)
  return actual + (objetivo - actual) * k
}

/** Un entero al azar entre min y max, los dos incluidos. */
export function alAzar(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Elige un elemento al azar de una lista. */
export function unoDe<T>(lista: readonly T[]): T {
  return lista[Math.floor(Math.random() * lista.length)]
}

// ── El locutor ────────────────────────────────────────────────────────────

export type Locutor = {
  /**
   * Abre una SERIE nueva y cancela la anterior: la voz se calla en el acto y
   * la secuencia que estuviera corriendo se muere en su próximo `await`.
   */
  nueva: () => number
  /** Dice una frase y espera. `false` si la pantalla se fue o la serie caducó. */
  di: (texto: string, serie?: number) => Promise<boolean>
  /** Un silencio, con la misma regla. */
  pausa: (ms: number, serie?: number) => Promise<boolean>
  /** ¿Sigue en pie esta serie? */
  vigente: (serie?: number) => boolean
  /** ¿Sigue viva la pantalla? */
  vivo: () => boolean
  /** Corta lo que se esté diciendo ahora mismo. */
  cortar: () => void
}

/**
 * La voz de una pantalla, atada a su ciclo de vida Y a lo que hace José.
 *
 * Resuelve dos cosas que se rompieron de verdad, no en teoría:
 *
 * 1. **La secuencia que sobrevive a la pantalla.** Toda la app narra con
 *    `await decir(...)` dentro de funciones async. Si José toca la casita en
 *    medio de una secuencia, el componente se desmonta pero la cadena de
 *    `await` sigue corriendo en el aire, y varias terminan llamando a
 *    `onVolver()`: la app navega SOLA un segundo después de que el niño ya
 *    eligió otra cosa.
 *
 * 2. **La app que ignora al niño mientras habla.** Este apareció probando los
 *    juegos con un puntero de verdad, y era el peor de los dos. Cada pantalla
 *    se ponía "ocupada" mientras narraba y descartaba lo que José hiciera
 *    entre tanto. En un juego de tocar casi no se nota; en uno de arrastrar,
 *    donde el dedo está apoyado todo el tiempo, es fatal: el niño lleva el pan
 *    hasta el nene con hambre mientras la maestra todavía está hablando, no
 *    pasa nada, y como ya no se mueve el dedo tampoco pasa nada después. La
 *    pantalla queda muerta con el dedo encima.
 *
 *    La regla que sale de ahí, y que vale para los cinco juegos: **lo que hace
 *    José siempre gana; si la app estaba hablando, la app se calla.** Se abre
 *    una serie nueva con `nueva()`, la anterior se apaga sola en su siguiente
 *    `await`, y el niño nunca espera a que un adulto termine la frase.
 *
 * Se usa siempre así, y los `if` no son opcionales:
 *
 *     const s = voz.nueva()
 *     if (!(await voz.di('Listen!', s))) return
 *     if (!(await voz.pausa(400, s))) return
 *     terminar()
 */
export function useLocutor(): Locutor {
  const vivo = useRef(true)
  const serieActual = useRef(0)

  useEffect(() => {
    vivo.current = true
    return () => {
      vivo.current = false
      callar()
    }
  }, [])

  const vigente = useCallback((serie?: number) => {
    if (!vivo.current) return false
    return serie === undefined || serie === serieActual.current
  }, [])

  const nueva = useCallback(() => {
    callar()
    serieActual.current += 1
    return serieActual.current
  }, [])

  const di = useCallback(
    async (texto: string, serie?: number) => {
      if (!vigente(serie)) return false
      await decir(texto)
      return vigente(serie)
    },
    [vigente],
  )

  const pausa = useCallback(
    (ms: number, serie?: number) => {
      return new Promise<boolean>((r) => {
        // No se limpia el temporizador a propósito: si la pantalla muere antes,
        // igual dispara y devuelve false. Limpiarlo dejaría la promesa colgada
        // para siempre y con ella la función que la esperaba.
        window.setTimeout(() => r(vigente(serie)), ms)
      })
    },
    [vigente],
  )

  return {
    nueva,
    di,
    pausa,
    vigente,
    vivo: () => vivo.current,
    cortar: () => callar(),
  }
}

// ── La cola de voz ────────────────────────────────────────────────────────

export type PasoDeCola = {
  /** Una frase en inglés. */
  di?: string
  /** Un silencio, en milisegundos. */
  espera?: number
  /** Algo que hacer justo en ese momento de la locución. */
  hacer?: () => void
}

/**
 * Una fila de cosas que decir, una detrás de otra, SIN frenar el juego.
 *
 * Nace de un error de diseño que solo se ve jugando. La primera versión de
 * "Trace the Holy Cross" hacía esto: se toca la frente, suena el verso, y
 * hasta que el verso no termina el juego no acepta el punto siguiente. Parece
 * razonable hasta que uno se acuerda de que la Señal de la Cruz **es un solo
 * trazo**: nadie se persigna en cuatro toques con pausas: la mano baja de la
 * frente al pecho y cruza de un hombro al otro de corrido. Un niño hace el
 * gesto entero en un segundo, la app le acredita el primer punto, y los otros
 * tres se pierden porque estaba hablando. Peor: si el dedo ya no se mueve más,
 * no llega ningún evento nuevo y la pantalla se queda trabada para siempre.
 *
 * La cola invierte el orden de mando. El dedo avanza cuando quiere y cada
 * logro **encola** lo que hay que decir; la voz corre detrás sin bloquear
 * nada. Si José traza la cruz de un tirón, oye la oración entera y seguida
 * —"In the name of the Father, and of the Son…"—, que es justamente como se
 * reza. Si va despacio, oye un verso por punto. Los dos caminos son correctos
 * porque el que manda es él.
 */
export function useCola(voz: Locutor) {
  const cola = useRef<PasoDeCola[]>([])
  const corriendo = useRef(false)

  const bombear = useCallback(async () => {
    if (corriendo.current) return
    corriendo.current = true
    while (cola.current.length) {
      const paso = cola.current.shift()!
      if (paso.hacer) paso.hacer()
      if (paso.di && !(await voz.di(paso.di))) break
      if (paso.espera && !(await voz.pausa(paso.espera))) break
    }
    corriendo.current = false
  }, [voz])

  /** Agrega al final. Las cadenas se toman como frases. */
  const encolar = useCallback(
    (...pasos: (string | PasoDeCola)[]) => {
      for (const p of pasos) cola.current.push(typeof p === 'string' ? { di: p } : p)
      void bombear()
    },
    [bombear],
  )

  /** Tira lo que quede por decir y calla. Se usa cuando algo grande cambia. */
  const vaciar = useCallback(() => {
    cola.current = []
    voz.cortar()
  }, [voz])

  useEffect(() => () => {
    cola.current = []
  }, [])

  return {
    encolar,
    vaciar,
    /** ¿Queda algo por decir? Sirve para no pisar la locución con una ayuda. */
    hablando: () => corriendo.current || cola.current.length > 0,
  }
}

// ── El bucle ──────────────────────────────────────────────────────────────

/**
 * Un `requestAnimationFrame` que se apaga solo.
 *
 * `dt` viene en SEGUNDOS y viene recortado a 50 ms. Ese recorte importa: si la
 * tablet se bloquea o José cambia de app, al volver el navegador entrega un
 * salto de varios segundos de golpe y sin el tope las estrellas aparecerían
 * ya en el suelo, la ola desbordaría y el juego se sentiría roto.
 */
export function useBucle(fn: (dt: number) => void, activo = true) {
  const guardado = useRef(fn)
  guardado.current = fn

  useEffect(() => {
    if (!activo) return
    let id = 0
    let previo = performance.now()

    const paso = (ahora: number) => {
      const dt = Math.min((ahora - previo) / 1000, 0.05)
      previo = ahora
      guardado.current(dt)
      id = requestAnimationFrame(paso)
    }

    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [activo])
}

// ── El dedo ───────────────────────────────────────────────────────────────

export type Punto = {
  /** Píxeles dentro del elemento. */
  x: number
  y: number
  /** Lo mismo en 0..1 — lo que se usa para posicionar en porcentaje. */
  nx: number
  ny: number
  /** Tamaño del elemento en ese momento. */
  ancho: number
  alto: number
}

export type Movimiento = {
  /** Desplazamiento desde el evento anterior, en píxeles. */
  dx: number
  dy: number
  /** Píxeles por segundo. Es lo que mide "qué tan fuerte agita". */
  velocidad: number
}

export type Manejadores = {
  inicio?: (p: Punto) => void
  mover?: (p: Punto, m: Movimiento) => void
  fin?: (p: Punto) => void
}

/**
 * Sigue el dedo dentro de un elemento, de principio a fin.
 *
 * Tres decisiones que parecen detalles y no lo son:
 *
 * · `setPointerCapture`: en cuanto el dedo baja, ese elemento se queda con
 *   TODOS los eventos de ese dedo hasta que se levante. Sin esto, arrastrar
 *   una rebanada de pan un centímetro fuera de la canasta cancela el arrastre
 *   y el pan se queda pegado a media pantalla.
 *
 * · `passive: false` + `preventDefault`: sin eso, arrastrar hacia abajo en un
 *   navegador móvil es "recargar la página" y arrastrar al costado es "volver
 *   atrás". El juego perdería el dedo justo cuando lo necesita.
 *
 * · Solo un dedo a la vez: José juega con las dos manos y apoya la palma. El
 *   primer dedo que baja es el que manda; los demás se ignoran hasta que ese
 *   se levante.
 */
export function useGestoContinuo(
  ref: RefObject<HTMLElement | null>,
  manejadores: Manejadores,
  activo = true,
) {
  const guardado = useRef(manejadores)
  guardado.current = manejadores

  useEffect(() => {
    const el = ref.current
    if (!el || !activo) return

    let dedo: number | null = null
    let ux = 0
    let uy = 0
    let ut = 0

    const leer = (e: PointerEvent): Punto => {
      const c = el.getBoundingClientRect()
      const x = e.clientX - c.left
      const y = e.clientY - c.top
      return {
        x,
        y,
        nx: c.width ? x / c.width : 0,
        ny: c.height ? y / c.height : 0,
        ancho: c.width,
        alto: c.height,
      }
    }

    const abajo = (e: PointerEvent) => {
      if (dedo !== null) return
      dedo = e.pointerId
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        // Algún navegador viejo sin captura: se sigue igual, solo con menos red.
      }
      e.preventDefault()
      const p = leer(e)
      ux = p.x
      uy = p.y
      ut = e.timeStamp
      guardado.current.inicio?.(p)
    }

    const mover = (e: PointerEvent) => {
      if (dedo !== e.pointerId) return
      e.preventDefault()
      const p = leer(e)
      const dx = p.x - ux
      const dy = p.y - uy
      const dt = Math.max((e.timeStamp - ut) / 1000, 0.001)
      ux = p.x
      uy = p.y
      ut = e.timeStamp
      guardado.current.mover?.(p, {
        dx,
        dy,
        velocidad: Math.sqrt(dx * dx + dy * dy) / dt,
      })
    }

    const arriba = (e: PointerEvent) => {
      if (dedo !== e.pointerId) return
      dedo = null
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        // Ya se soltó sola.
      }
      guardado.current.fin?.(leer(e))
    }

    el.addEventListener('pointerdown', abajo, { passive: false })
    el.addEventListener('pointermove', mover, { passive: false })
    el.addEventListener('pointerup', arriba)
    el.addEventListener('pointercancel', arriba)

    return () => {
      el.removeEventListener('pointerdown', abajo)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', arriba)
      el.removeEventListener('pointercancel', arriba)
    }
  }, [ref, activo])
}

// ── El andamiaje auditivo ─────────────────────────────────────────────────

/**
 * Si José se queda quieto, la app vuelve a decirle qué hacer. Y se lo vuelve a
 * decir, y otra vez, mientras siga sin hacer nada.
 *
 * No es un apuro ni un reproche: es la única forma de que un niño que no lee
 * pueda destrabarse solo. `reiniciar()` se llama con cada cosa que hace, así
 * que la ayuda solo aparece cuando de verdad se quedó mirando.
 *
 * SE REARMA SOLA, y eso importa más de lo que parece. La primera versión
 * disparaba una única vez: si José se distraía en el momento justo y no oía la
 * pista, la pantalla se quedaba muda para siempre y él sin manera de saber qué
 * hacer —no puede leer el pie de pantalla, no puede preguntarle a la app, y no
 * hay nadie más—. Un niño que no lee necesita que la ayuda vuelva.
 */
export function useInactividad(ms: number, alQuedarseQuieto: () => void, activo = true) {
  const guardado = useRef(alQuedarseQuieto)
  guardado.current = alQuedarseQuieto
  const temporizador = useRef<number | null>(null)

  const limpiar = useCallback(() => {
    if (temporizador.current !== null) {
      window.clearTimeout(temporizador.current)
      temporizador.current = null
    }
  }, [])

  const reiniciar = useCallback(() => {
    limpiar()
    if (!activo) return
    const armar = () => {
      temporizador.current = window.setTimeout(() => {
        guardado.current()
        armar()
      }, ms)
    }
    armar()
  }, [limpiar, ms, activo])

  useEffect(() => limpiar, [limpiar])

  return { reiniciar, limpiar }
}
