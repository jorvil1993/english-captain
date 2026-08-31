/**
 * Los sonidos de la app. WebAudio + MP3s reales para instrumentos y animales.
 * Cero sonidos de error o penalización.
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

function nota(frecuencia: number, comienzo: number, duracion: number, volumen = 0.18, tipo: OscillatorType = 'sine') {
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
  nota(659.25, 0.1, 0.7, 0.1)
  nota(783.99, 0, 0.7, 0.09)
}

/** La campanita de la oración: una sola nota larga, para el silencio. */
export function campana() {
  nota(880, 0, 1.4, 0.1)
  nota(1318.5, 0, 1.1, 0.05)
}

/** Campana de iglesia resonante (ding-dong). */
export function campanaIglesia() {
  nota(523.25, 0, 1.8, 0.2)
  nota(1046.5, 0.02, 1.4, 0.12)
  nota(1567.98, 0.04, 1.0, 0.08)
}

/** Pandereta / Tambourine: repique rítmico alegre. */
export function pandereta() {
  nota(1760, 0, 0.08, 0.15, 'triangle')
  nota(2093, 0.02, 0.07, 0.12, 'triangle')
  nota(2637, 0.04, 0.06, 0.1, 'sine')
}

/** Estrellitas brillantes / Bendición. */
export function estrellitas() {
  nota(659.25, 0, 0.12, 0.12)
  nota(783.99, 0.08, 0.12, 0.12)
  nota(987.77, 0.16, 0.14, 0.14)
  nota(1318.5, 0.24, 0.35, 0.16)
}

/** Patada de balón: impacto grave seco y satisfactorio. */
export function patadaBalon() {
  nota(150, 0, 0.12, 0.35, 'triangle')
  nota(90, 0.02, 0.15, 0.3, 'sine')
}

/** Celebración de Gol: fanfarria triunfal y bendición. */
export function golCelebracion() {
  patadaBalon()
  nota(523.25, 0.05, 0.18, 0.22)
  nota(659.25, 0.15, 0.18, 0.22)
  nota(783.99, 0.25, 0.22, 0.25)
  nota(1046.5, 0.35, 0.5, 0.28)
}

/** Reproduce el efecto de sonido real del animal (MP3). */
export function sonidoAnimal(animal: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(`./audio/animal_${animal}.mp3`)
      audio.onended = () => resolve()
      audio.onerror = () => resolve()
      void audio.play().catch(() => resolve())
    } catch {
      resolve()
    }
  })
}
