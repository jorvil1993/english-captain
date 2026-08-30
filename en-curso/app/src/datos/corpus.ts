import { CROMOS, ORACIONES, TODAS_LAS_FRASES, UNIDADES } from './curso.ts'

/**
 * TODO lo que la app puede llegar a decir, en una sola lista.
 *
 * De acá sale el audio: el generador (`en-curso/artes/generar_voces.mjs`)
 * importa este archivo, le pide a edge-tts un mp3 por línea y los deja en
 * `public/audio/`. Después la app los encuentra sola por el hash del texto
 * (ver `audio/clave.ts`), sin que ninguna pantalla tenga que saber nada.
 *
 * Cuatro voces distintas y no una. El método SparkLing —el estudio de Madrid
 * con niños hispanohablantes— usa a propósito **varios hablantes** además de
 * habla dirigida al niño y respuesta contingente (§1.7 de la investigación).
 * Oír la misma frase en dos bocas distintas es lo que evita que José aprenda
 * "el sonido que hace la tablet" en vez de la frase.
 *
 *   maestra   — la que narra, pregunta y modela. La voz principal.
 *   nino      — un niño. Canta y celebra: José oye a un par, no solo a un adulto.
 *   oracion   — la de rezar. Más lenta y más baja; el formato importa.
 *   coach     — el entrenador. Las órdenes del cuerpo y el fútbol.
 *   espanol   — el rescate. Solo cuando él lo pide.
 */

export type Voz = 'maestra' | 'nino' | 'oracion' | 'coach' | 'espanol'

export type Linea = {
  texto: string
  voz: Voz
}

/** El nombre por defecto. Si en el panel se cambia, esas frases caen al
 *  sintetizador hasta que se vuelva a generar el audio. */
export const NOMBRE = 'José'

/** Frases fijas de la interfaz, las que no salen del contenido. */
const INTERFAZ: Linea[] = [
  { texto: `Good morning, Captain ${NOMBRE}!`, voz: 'maestra' },
  { texto: `Good afternoon, Captain ${NOMBRE}!`, voz: 'maestra' },
  { texto: `Good evening, Captain ${NOMBRE}!`, voz: 'maestra' },
  { texto: "Let's play!", voz: 'maestra' },
  { texto: 'What do we do first?', voz: 'maestra' },
  { texto: 'And now, the last one!', voz: 'maestra' },
  { texto: 'Your turn!', voz: 'maestra' },
  { texto: 'Your mission!', voz: 'maestra' },
  { texto: `Great job, Captain ${NOMBRE}!`, voz: 'maestra' },
  { texto: 'See you tomorrow!', voz: 'maestra' },
  // Las celebraciones las dice el niño: un par que aplaude pesa más que un
  // adulto que aprueba, y José se mueve por reconocimiento (perfil §1).
  { texto: 'Yes!', voz: 'nino' },
  { texto: 'Bravo!', voz: 'nino' },
  { texto: 'You did it!', voz: 'nino' },
  { texto: 'NEW RECORD! You are fast!', voz: 'coach' },
]

function sinRepetir(lineas: Linea[]): Linea[] {
  const vistas = new Set<string>()
  const salida: Linea[] = []
  for (const l of lineas) {
    const texto = l.texto.trim().replace(/\s+/g, ' ')
    if (!texto || vistas.has(texto)) continue
    vistas.add(texto)
    salida.push({ ...l, texto })
  }
  return salida
}

export function corpus(): Linea[] {
  const lineas: Linea[] = [...INTERFAZ]

  for (const f of TODAS_LAS_FRASES) {
    lineas.push({ texto: f.en, voz: 'maestra' })
    lineas.push({ texto: f.ordenEn, voz: 'coach' })
    // "Yes! <frase>" es una sola cosa dicha de corrido cuando acierta en el
    // cuento; si no estuviera acá, esa celebración caería al sintetizador.
    lineas.push({ texto: `Yes! ${f.en}`, voz: 'maestra' })
    lineas.push({ texto: `es:${f.es}`, voz: 'espanol' })
  }

  for (const u of UNIDADES) {
    for (const e of u.cuento.escenas) {
      e.en.forEach((linea) => lineas.push({ texto: linea, voz: 'maestra' }))
      // La escena entera junta: así la lee el cuento cuando no hay pregunta.
      lineas.push({ texto: e.en.join(' '), voz: 'maestra' })
      lineas.push({ texto: `es:${e.es}`, voz: 'espanol' })
      if (e.pregunta) lineas.push({ texto: e.pregunta.en, voz: 'maestra' })
    }
    u.cancion.versos.forEach((v) => lineas.push({ texto: v, voz: 'nino' }))
    lineas.push({ texto: u.mision.en, voz: 'maestra' })
    lineas.push({ texto: `es:${u.mision.es}`, voz: 'espanol' })
  }

  for (const o of ORACIONES) {
    o.versos.forEach((v) => lineas.push({ texto: v, voz: 'oracion' }))
  }

  for (const c of CROMOS) {
    lineas.push({ texto: c.en, voz: 'coach' })
    lineas.push({ texto: `es:${c.es}`, voz: 'espanol' })
  }

  return sinRepetir(lineas)
}
