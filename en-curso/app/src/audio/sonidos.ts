/**
 * Los sonidos de la app. Todos se sintetizan con WebAudio —cero archivos, cero
 * peso— y todos son POSITIVOS.
 *
 * No hay sonido de error, ni buzzer, ni nota triste, ni "uy, no". José no
 * tolera que se rían de él y su orgullo colérico convierte cualquier señal de
 * fallo en un portazo (perfil §1, "sensibilidad a la burla"). Cuando se
 * equivoca, la app no hace ningún ruido: simplemente vuelve a decir la frase
 * bien y sigue. Eso es todo el feedback negativo que existe acá.
 */

let ctx: AudioContext | null = null

function contexto(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function nota(frecuencia: number, comienzo: number, duracion: number, volumen = 0.18) {
  const c = contexto()
  if (!c) return
  const osc = c.createOscillator()
  const gan = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = frecuencia
  const t = c.currentTime + comienzo
  gan.gain.setValueAtTime(0, t)
  gan.gain.linearRampToValueAtTime(volumen, t + 0.02)
  gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion)
  osc.connect(gan).connect(c.destination)
  osc.start(t)
  osc.stop(t + duracion + 0.05)
}

/** Acierto: tres notas que suben. Discreto, no una tragamonedas. */
export function bien() {
  nota(523.25, 0, 0.16)
  nota(659.25, 0.1, 0.16)
  nota(783.99, 0.2, 0.28)
}

/** Toque neutro al elegir algo. */
export function toque() {
  nota(440, 0, 0.09, 0.1)
}

/** Fin de la sesión: un acorde cálido y ya. */
export function final() {
  nota(523.25, 0, 0.7, 0.12)
  nota(659.25, 0, 0.7, 0.1)
  nota(783.99, 0, 0.7, 0.09)
}

/** La campanita de la oración: una sola nota larga, para el silencio. */
export function campana() {
  nota(880, 0, 1.4, 0.1)
  nota(1318.5, 0, 1.1, 0.05)
}
