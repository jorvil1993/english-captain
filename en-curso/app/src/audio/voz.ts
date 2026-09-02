/**
 * El motor de voz.
 *
 * Dos capas, en este orden:
 *
 *   1. **El audio grabado.** Cada frase tiene su mp3 en `public/audio/`,
 *      generado con voces neuronales de verdad (`en-curso/artes/generar_voces.mjs`)
 *      y empaquetado dentro de la app. Es lo que José oye siempre. Cuatro
 *      voces distintas —maestra, niño, oración y entrenador— porque el método
 *      SparkLing usa varios hablantes a propósito (§1.7 de la investigación).
 *      El archivo se encuentra solo, por el hash del texto: ver `clave.ts`.
 *   2. **Silencio seguro**, únicamente si un mp3 llegara a faltar. Nunca se
 *      sustituye por el sintetizador del sistema: una voz robótica no es una
 *      alternativa aceptable para un niño que está copiando pronunciación.
 *
 * Regla que no se rompe: el español NO es el idioma de la app. `decirEs()`
 * existe solo para el rescate breve cuando algo no se entiende (§4, "el
 * español entra como rescate, no como muleta").
 */

import { claveDe } from './clave'

type Fin = () => void

let desbloqueado = false
let reproduciendo: HTMLAudioElement | null = null
let finalizarAudioActual: Fin | null = null
let preparando: Promise<void> | null = null
let turno = 0

/** Claves de audio que sí existen. Se llena en `prepararVoz()`. */
const mp3Disponibles = new Set<string>()

/**
 * Se llama una vez al arrancar. Descubre qué mp3 existen.
 * `manifiesto` es la lista de claves con audio grabado (public/audio/audio.json).
 */
export function prepararVoz(): Promise<void> {
  if (preparando) return preparando

  preparando = (async () => {
    try {
      const r = await fetch('./audio/audio.json')
      if (r.ok) {
        const claves: string[] = await r.json()
        claves.forEach((c) => mp3Disponibles.add(c))
      }
    } catch {
      // La instalación normal incluye este manifiesto. Si llegara a fallar,
      // `decir` conserva la red de emergencia sin bloquear la sesión.
    }
  })()

  return preparando
}

/**
 * iOS y Android no dejan sonar nada hasta que el usuario toca la pantalla.
 * Se llama desde el primer toque real de José (el botón de empezar).
 */
export function desbloquearAudio() {
  if (desbloqueado) return
  // La primera pulsación ya habilita los MP3 en iOS/Android. No pronunciamos
  // una cadena vacía con Web Speech porque eso reintroduce voces del sistema.
  desbloqueado = true
}

export function callar() {
  turno += 1
  if (reproduciendo) {
    reproduciendo.pause()
    reproduciendo.currentTime = 0
  }
  // Una repetición pulsada por José no puede dejar esperando diez segundos a
  // la secuencia anterior. Resolvemos su promesa ahora mismo y el nuevo audio
  // toma el turno, sin voces encimadas ni una pantalla congelada.
  finalizarAudioActual?.()
  finalizarAudioActual = null
  reproduciendo = null
}

function sonarMp3(clave: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio(`./audio/${clave}.mp3`)
    // El habla dirigida a un niño pequeño necesita respiración real. El
    // navegador mantiene el tono de la voz al reducir la velocidad.
    a.defaultPlaybackRate = 0.82
    a.playbackRate = 0.82
    ;(a as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true
    reproduciendo = a
    let cerrado = false
    const fin: Fin = () => {
      if (cerrado) return
      cerrado = true
      if (reproduciendo === a) reproduciendo = null
      if (finalizarAudioActual === fin) finalizarAudioActual = null
      clearTimeout(reserva)
      resolve()
    }
    finalizarAudioActual = fin
    a.onended = fin
    a.onerror = fin

    // RED DE SEGURIDAD, y no es teórica: si el mp3 se queda a medio cargar
    // —wifi flojo, primera visita antes de que el service worker lo tenga
    // cacheado— no llega ni `onended` ni `onerror`. La promesa no se resolvía
    // nunca y la pantalla se congelaba sin botón que tocar: exactamente el
    // "se escondió todo" que reportó Jorge el 2026-08-30 en "Here is the ball".
    // Ocho segundos es muchísimo para una frase de dos: si no terminó, algo
    // falló y la sesión tiene que seguir igual.
    const reserva = setTimeout(fin, 10000)

    void a.play().catch(fin)
  })
}

/**
 * Dice algo en inglés. Si faltara su MP3 se registra el error y conserva el
 * ritmo de la actividad, pero jamás usa un sintetizador robótico.
 */
export async function decir(texto: string, clave?: string): Promise<void> {
  callar()
  const miTurno = turno
  // Nunca usamos el sintetizador sólo porque el manifiesto todavía estaba
  // llegando: ésa era la carrera que dejaba oír la voz robótica al arrancar.
  await prepararVoz()
  if (miTurno !== turno) return
  const k = clave ?? claveDe(texto)
  if (mp3Disponibles.has(k)) return sonarMp3(k)
  console.error(`Audio nativo faltante: ${texto}`)
  return esperar(Math.max(900, texto.length * 95))
}

/** El rescate en español. Corto, y solo cuando José lo pide. */
export async function decirEs(texto: string, clave?: string): Promise<void> {
  callar()
  const miTurno = turno
  await prepararVoz()
  if (miTurno !== turno) return
  const k = clave ?? claveDe(`es:${texto}`)
  if (mp3Disponibles.has(k)) return sonarMp3(k)
  console.error(`Audio nativo faltante: es:${texto}`)
  return esperar(Math.max(900, texto.length * 95))
}

/** Una pausa explícita entre frases: el silencio también enseña. */
export function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
