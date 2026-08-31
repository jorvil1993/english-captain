/**
 * Los sonidos que necesitan los cinco juegos de movimiento.
 *
 * Archivo aparte de `sonidos.ts` a propósito: aquel tiene los sonidos de
 * evento —suena una vez y termina—. Estos cinco juegos piden algo distinto,
 * sonido CONTINUO que responde al dedo mientras se mueve: el viento que sube
 * cuando José agita más fuerte, la cuerda que cruje mientras la estira. Un
 * sonido que dura y que se modula no se puede escribir como una notita suelta,
 * necesita nodos vivos que alguien tenga que apagar.
 *
 * Las reglas de la app se respetan igual:
 *   · CERO sonidos de error o de castigo. No hay ninguno acá, ni lo habrá.
 *   · Volúmenes bajos. La tablet se usa cerca de la cara y a menudo sin
 *     auriculares; nada acá pasa de 0,22 de ganancia.
 *   · Nada estridente ni brusco: todo entra con rampa y sale con rampa. Un
 *     ataque seco sobresalta, y a este niño el sobresalto le arruina la
 *     sesión entera.
 */

let ctx: AudioContext | null = null

function contexto(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function nota(
  frecuencia: number,
  comienzo: number,
  duracion: number,
  volumen = 0.16,
  tipo: OscillatorType = 'sine',
) {
  const c = contexto()
  if (!c) return
  const osc = c.createOscillator()
  const gan = c.createGain()
  osc.type = tipo
  osc.frequency.value = frecuencia
  const t = c.currentTime + comienzo
  gan.gain.setValueAtTime(0, t)
  gan.gain.linearRampToValueAtTime(volumen, t + 0.02)
  gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion)
  osc.connect(gan).connect(c.destination)
  osc.start(t)
  osc.stop(t + duracion + 0.05)
}

/**
 * Una campana de iglesia afinada.
 *
 * Una campana de verdad no es una nota: es un golpe de metal con parciales que
 * no son múltiplos exactos de la fundamental (por eso una campana suena a
 * campana y no a flauta). Se imita con cuatro osciladores en proporciones
 * inarmónicas y decaimientos distintos —el agudo se apaga rápido, el grave
 * queda zumbando—. Es lo que hace que las tres campanas del juego se
 * distingan de verdad como grande, mediana y chica, y no solo como
 * "más aguda".
 */
export function campanaTono(fundamental: number, volumen = 0.2) {
  nota(fundamental, 0, 2.6, volumen * 0.9)
  nota(fundamental * 2.0, 0.005, 1.9, volumen * 0.5)
  nota(fundamental * 2.76, 0.01, 1.1, volumen * 0.28)
  nota(fundamental * 5.4, 0.012, 0.5, volumen * 0.12)
}

/** Las tres campanas del campanario. Graves = grandes. */
export const CAMPANAS = {
  big: 196.0, // Sol2  — la grande, profunda
  middle: 293.66, // Re3  — la mediana
  little: 440.0, // La3  — la chiquita
}

/** Un toque suave mientras el dedo recorre el camino de luz. */
export function chispita() {
  nota(1174.66, 0, 0.09, 0.07, 'sine')
}

/** El destello al recoger una estrella: dos notas que suben, cortitas. */
export function recoger() {
  nota(880, 0, 0.1, 0.11)
  nota(1318.51, 0.06, 0.16, 0.1)
}

/** La flor que nace donde cayó una estrella. Nunca es un error: es otra cosa linda. */
export function florecer() {
  nota(587.33, 0, 0.22, 0.07, 'triangle')
  nota(880, 0.09, 0.28, 0.05, 'triangle')
}

/** El plato de comida que llega a su destino: un "toc" cálido y redondo. */
export function servir() {
  nota(392, 0, 0.14, 0.12, 'triangle')
  nota(523.25, 0.07, 0.22, 0.1, 'sine')
}

/** El acorde de la paz: cuando el mar se aquieta. Largo y abierto. */
export function paz() {
  nota(261.63, 0, 2.2, 0.09)
  nota(392.0, 0.12, 2.2, 0.07)
  nota(523.25, 0.24, 2.4, 0.06)
  nota(783.99, 0.36, 2.0, 0.04)
}

/**
 * EL VIENTO DE LA TORMENTA.
 *
 * Ruido blanco pasado por un filtro pasabanda que se abre y se cierra: eso es
 * el viento. La gracia es que `nivel()` lo controla en vivo, así que mientras
 * José agita el dedo el viento sube con él y cuando se queda quieto baja solo.
 * Ese lazo —mi mano cambia lo que oigo, al instante— es la mitad del juego:
 * el niño entiende la causa sin que nadie se la explique.
 *
 * Devuelve un mando con `nivel` y `parar`. HAY QUE LLAMAR A `parar()` al salir
 * de la pantalla, o el ruido sigue sonando encima del resto de la app.
 */
export function viento() {
  const c = contexto()
  if (!c) {
    return { nivel: () => {}, parar: () => {} }
  }

  // Dos segundos de ruido en bucle: suficiente para que no se oiga el empalme.
  const muestras = c.sampleRate * 2
  const buffer = c.createBuffer(1, muestras, c.sampleRate)
  const datos = buffer.getChannelData(0)
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1

  const fuente = c.createBufferSource()
  fuente.buffer = buffer
  fuente.loop = true

  const filtro = c.createBiquadFilter()
  filtro.type = 'bandpass'
  filtro.frequency.value = 380
  filtro.Q.value = 0.8

  const gan = c.createGain()
  gan.gain.value = 0

  fuente.connect(filtro).connect(gan).connect(c.destination)
  fuente.start()

  let vivo = true

  return {
    /** 0 = calma total, 1 = tormenta. Se puede llamar en cada frame. */
    nivel(v: number) {
      if (!vivo) return
      const n = Math.max(0, Math.min(1, v))
      const t = c.currentTime
      // Rampas cortas en vez de saltos: sin esto el viento chasquea.
      gan.gain.linearRampToValueAtTime(n * 0.16, t + 0.08)
      filtro.frequency.linearRampToValueAtTime(320 + n * 900, t + 0.12)
    },
    parar() {
      if (!vivo) return
      vivo = false
      const t = c.currentTime
      gan.gain.linearRampToValueAtTime(0, t + 0.4)
      try {
        fuente.stop(t + 0.5)
      } catch {
        // Ya estaba parada: no pasa nada.
      }
    },
  }
}

/** Una ola que rompe. Corta, grave y suave: nunca asusta. */
export function ola(fuerza = 1) {
  const c = contexto()
  if (!c) return
  const muestras = Math.floor(c.sampleRate * 0.5)
  const buffer = c.createBuffer(1, muestras, c.sampleRate)
  const datos = buffer.getChannelData(0)
  for (let i = 0; i < muestras; i++) {
    // El ruido se apaga solo hacia el final: es el agua retirándose.
    datos[i] = (Math.random() * 2 - 1) * (1 - i / muestras)
  }
  const fuente = c.createBufferSource()
  fuente.buffer = buffer
  const filtro = c.createBiquadFilter()
  filtro.type = 'lowpass'
  filtro.frequency.value = 700 + fuerza * 500
  const gan = c.createGain()
  const t = c.currentTime
  gan.gain.setValueAtTime(0, t)
  gan.gain.linearRampToValueAtTime(0.1 * fuerza, t + 0.05)
  gan.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
  fuente.connect(filtro).connect(gan).connect(c.destination)
  fuente.start(t)
  fuente.stop(t + 0.5)
}
