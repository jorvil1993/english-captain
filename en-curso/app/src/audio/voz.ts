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
 *   2. **El sintetizador del sistema**, solo como red de emergencia si un mp3
 *      llegara a faltar (una frase nueva sin generar todavía).
 *
 * Esta segunda capa NO es la voz de la app. La voz del sistema en Windows y en
 * muchos Android es un motor viejo, robótico y con una pronunciación que no es
 * inglés de verdad — y la pronunciación que José va a copiar durante meses
 * tiene que ser nativa y estable (§1.9). Si escuchas la voz fea, es que falta
 * generar ese audio: corre el generador.
 *
 * Regla que no se rompe: el español NO es el idioma de la app. `decirEs()`
 * existe solo para el rescate breve cuando algo no se entiende (§4, "el
 * español entra como rescate, no como muleta").
 */

import { claveDe } from './clave'

type Fin = () => void

let vocesListas = false
let vozIngles: SpeechSynthesisVoice | null = null
let vozEspanol: SpeechSynthesisVoice | null = null
let desbloqueado = false
let reproduciendo: HTMLAudioElement | null = null
let preparando: Promise<void> | null = null
let turno = 0

/** Claves de audio que sí existen. Se llena en `prepararVoz()`. */
const mp3Disponibles = new Set<string>()

/** Cuántos mp3 hay. Lo usa el panel de papás para avisar si falta generarlos. */
export function audiosDisponibles(): number {
  return mp3Disponibles.size
}

function elegirVoces() {
  const voces = window.speechSynthesis?.getVoices() ?? []
  if (!voces.length) return

  // Preferimos voz local (funciona sin internet) y en-US antes que en-GB:
  // el inglés que José va a oír a su alrededor en Bolivia es americano.
  const puntaje = (v: SpeechSynthesisVoice) => {
    let p = 0
    if (v.lang.startsWith('en')) p += 10
    if (v.lang === 'en-US') p += 5
    if (v.localService) p += 4
    if (/female|samantha|karen|zira|aria|jenny/i.test(v.name)) p += 2
    return p
  }
  const ingles = voces.filter((v) => v.lang.startsWith('en'))
  vozIngles = ingles.sort((a, b) => puntaje(b) - puntaje(a))[0] ?? null

  const espanol = voces.filter((v) => v.lang.startsWith('es'))
  vozEspanol =
    espanol.find((v) => v.lang === 'es-US' || v.lang === 'es-419') ??
    espanol.find((v) => v.localService) ??
    espanol[0] ??
    null

  vocesListas = true
}

/**
 * Se llama una vez al arrancar. Descubre qué mp3 existen y prepara las voces.
 * `manifiesto` es la lista de claves con audio grabado (public/audio/audio.json).
 */
export function prepararVoz(): Promise<void> {
  if (preparando) return preparando

  preparando = (async () => {
    if ('speechSynthesis' in window) {
      elegirVoces()
      if (!vocesListas) {
        window.speechSynthesis.onvoiceschanged = elegirVoces
      }
    }
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
  if (desbloqueado || !('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance('')
  u.volume = 0
  window.speechSynthesis.speak(u)
  desbloqueado = true
}

export function callar() {
  turno += 1
  window.speechSynthesis?.cancel()
  if (reproduciendo) {
    reproduciendo.pause()
    reproduciendo.currentTime = 0
    reproduciendo = null
  }
}

function hablar(texto: string, idioma: 'en' | 'es'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      // Sin sintetizador dejamos el tiempo que tardaría en leerse, para que
      // la secuencia de la pantalla no se atropelle.
      setTimeout(resolve, Math.max(900, texto.length * 75))
      return
    }
    const u = new SpeechSynthesisUtterance(texto)
    if (idioma === 'en') {
      if (vozIngles) u.voice = vozIngles
      u.lang = vozIngles?.lang ?? 'en-US'
      // Lento y un semitono arriba: se acerca al habla dirigida al niño, que
      // es la que usa el método SparkLing (§1.7 de la investigación).
      u.rate = 0.82
      u.pitch = 1.15
    } else {
      if (vozEspanol) u.voice = vozEspanol
      u.lang = vozEspanol?.lang ?? 'es-419'
      u.rate = 0.95
      u.pitch = 1.0
    }
    let cerrado = false
    const fin: Fin = () => {
      if (cerrado) return
      cerrado = true
      resolve()
    }
    u.onend = fin
    u.onerror = fin
    // Chrome a veces se traga el onend en frases largas; red de seguridad.
    setTimeout(fin, 1200 + texto.length * 110)
    window.speechSynthesis.speak(u)
  })
}

function sonarMp3(clave: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio(`./audio/${clave}.mp3`)
    reproduciendo = a
    let cerrado = false
    const fin: Fin = () => {
      if (cerrado) return
      cerrado = true
      if (reproduciendo === a) reproduciendo = null
      clearTimeout(reserva)
      resolve()
    }
    a.onended = fin
    a.onerror = fin

    // RED DE SEGURIDAD, y no es teórica: si el mp3 se queda a medio cargar
    // —wifi flojo, primera visita antes de que el service worker lo tenga
    // cacheado— no llega ni `onended` ni `onerror`. La promesa no se resolvía
    // nunca y la pantalla se congelaba sin botón que tocar: exactamente el
    // "se escondió todo" que reportó Jorge el 2026-08-30 en "Here is the ball".
    // Ocho segundos es muchísimo para una frase de dos: si no terminó, algo
    // falló y la sesión tiene que seguir igual.
    const reserva = setTimeout(fin, 8000)

    void a.play().catch(fin)
  })
}

/**
 * Dice algo en inglés. `clave` es el id de la frase; si hay mp3 grabado con
 * ese nombre se usa ese, y si no lo dice el sintetizador.
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
  return hablar(texto, 'en')
}

/** El rescate en español. Corto, y solo cuando José lo pide. */
export async function decirEs(texto: string, clave?: string): Promise<void> {
  callar()
  const miTurno = turno
  await prepararVoz()
  if (miTurno !== turno) return
  const k = clave ?? claveDe(`es:${texto}`)
  if (mp3Disponibles.has(k)) return sonarMp3(k)
  return hablar(texto, 'es')
}

/** Una pausa explícita entre frases: el silencio también enseña. */
export function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
