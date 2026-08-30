/**
 * Las grabaciones de José.
 *
 * Se quedan en memoria del aparato, se escuchan el mismo día y no salen de
 * ahí: no hay servidor, no hay nube, no hay nada que subir. Es la voz de un
 * niño de 4 años.
 *
 * Para qué existen: José necesita público. No juega solo, y lo que lo mueve es
 * que lo vean y lo aplaudan (perfil §1, lenguaje del amor: tiempo de juego +
 * palabras de afirmación). El personaje le da audiencia inmediata; esto le da
 * audiencia DIFERIDA — "guardado para mostrárselo a papá" — que es lo que
 * sostiene la actividad cuando papá no está en la habitación.
 *
 * Lo que NO hacen: calificar. El reconocimiento de voz automático no es fiable
 * en menores de 6 años (§1.8), y decirle "mal" a este niño en particular sería
 * cerrarle la puerta. Se graba, se escucha, se aplaude. Siempre.
 */

export type Grabacion = {
  fraseId: string
  en: string
  url: string
  cuando: number
}

const grabaciones: Grabacion[] = []

export function guardarGrabacion(g: Grabacion) {
  grabaciones.push(g)
}

export function grabacionesDeHoy(): Grabacion[] {
  return [...grabaciones]
}

export function hayMicrofono(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'
}

/** Graba `ms` milisegundos y devuelve la url del audio, o null si no se pudo. */
export async function grabar(ms: number): Promise<string | null> {
  if (!hayMicrofono()) return null
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    return null
  }
  return new Promise((resolve) => {
    const trozos: BlobPart[] = []
    const rec = new MediaRecorder(stream)
    rec.ondataavailable = (e) => trozos.push(e.data)
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      if (!trozos.length) return resolve(null)
      resolve(URL.createObjectURL(new Blob(trozos, { type: rec.mimeType || 'audio/webm' })))
    }
    rec.start()
    setTimeout(() => rec.state !== 'inactive' && rec.stop(), ms)
  })
}

export function reproducir(url: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio(url)
    a.onended = () => resolve()
    a.onerror = () => resolve()
    void a.play().catch(() => resolve())
  })
}
