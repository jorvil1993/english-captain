import { CROMOS, ORACIONES, TODAS_LAS_FRASES, UNIDADES } from './curso.ts'
import { CANCIONES_ALABANZA, HISTORIAS_BIBLICAS, OBJETOS_SAGRADOS, PEQUENAS_ORACIONES } from './catolico.ts'
import { FRASES_MINIJUEGOS } from './minijuegos.ts'
import { LINEAS_MINIJUEGOS_EXTRA } from './minijuegos-extra.ts'
import { FRASES_SUELTAS } from './frases-sueltas.ts'

export type Voz = 'maestra' | 'nino' | 'oracion' | 'coach' | 'espanol'

export type Linea = {
  texto: string
  voz: Voz
}

/** Frases fijas de la interfaz y del Rincón Católico. */
const INTERFAZ: Linea[] = [
  // Los saludos no contienen el nombre editable: así siempre tienen un MP3
  // natural, aunque papá cambie el perfil del niño.
  { texto: 'Good morning, Captain!', voz: 'maestra' },
  { texto: 'Good afternoon, Captain!', voz: 'maestra' },
  { texto: 'Good evening, Captain!', voz: 'maestra' },
  { texto: "Let's play!", voz: 'maestra' },
  { texto: "Let's learn something new!", voz: 'oracion' },
  { texto: 'Catholic Corner time!', voz: 'maestra' },
  { texto: 'What do we do first?', voz: 'maestra' },
  { texto: 'What is next, Captain?', voz: 'maestra' },
  { texto: 'And now, the last one!', voz: 'maestra' },
  { texto: 'Your turn!', voz: 'maestra' },
  { texto: 'Your mission!', voz: 'maestra' },
  { texto: 'Great job, Captain!', voz: 'maestra' },
  { texto: 'Yes!', voz: 'nino' },
  { texto: 'Bravo!', voz: 'nino' },
  { texto: 'You did it!', voz: 'nino' },
  { texto: 'NEW RECORD! You are fast!', voz: 'coach' },
  // Frases de títulos de las 4 secciones
  { texto: 'My Little Prayers', voz: 'oracion' },
  { texto: 'Bible Friends', voz: 'maestra' },
  { texto: 'Sing and Praise', voz: 'nino' },
  { texto: 'Holy Things and Church', voz: 'oracion' },
  { texto: 'Daily Captain Mission', voz: 'coach' },
  { texto: 'Choose a section!', voz: 'maestra' },
  { texto: 'Tap to complete the prayer!', voz: 'oracion' },
  { texto: 'Tap the elements to explore!', voz: 'maestra' },
  { texto: 'Play the instruments with the music!', voz: 'nino' },
  { texto: 'Explore the holy house of God!', voz: 'oracion' },
  { texto: 'Bless you!', voz: 'oracion' },
  { texto: 'Wonderful!', voz: 'nino' },
  { texto: 'Beautiful!', voz: 'oracion' },
  { texto: 'Great job!', voz: 'maestra' },
  { texto: 'Lion!', voz: 'maestra' },
  { texto: 'Sheep!', voz: 'maestra' },
  { texto: 'Dove!', voz: 'maestra' },
  { texto: 'Elephant!', voz: 'maestra' },
  // Frases de Fútbol Católico (Messi, Mbappé, Modrić, Dibu)
  { texto: 'Champions of Jesus', voz: 'coach' },
  { texto: 'Shoot and score!', voz: 'coach' },
  { texto: 'Pass to Messi!', voz: 'nino' },
  { texto: 'Pass to Mbappé!', voz: 'nino' },
  { texto: 'Pass to Luka!', voz: 'nino' },
  { texto: 'Dibu saves the ball!', voz: 'coach' },
  { texto: 'GOAL! Thank you, God!', voz: 'nino' },
  { texto: 'Great kick, Captain José!', voz: 'coach' },
  { texto: 'We play together with Jesus!', voz: 'oracion' },
  { texto: 'Be strong and brave!', voz: 'coach' },
  { texto: 'Glory to God!', voz: 'oracion' },
  { texto: 'Kick the ball!', voz: 'coach' },
  { texto: 'Goal!', voz: 'nino' },
  { texto: 'Pass!', voz: 'coach' },
  { texto: 'Save!', voz: 'coach' },
  { texto: 'Messi!', voz: 'nino' },
  { texto: 'Mbappé!', voz: 'nino' },
  { texto: 'Luka!', voz: 'nino' },
  { texto: 'Luka! Great team!', voz: 'nino' },
  { texto: 'Luka Modrić scores a goal!', voz: 'nino' },
  { texto: 'Dibu!', voz: 'coach' },
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
    lineas.push({ texto: `Yes! ${f.en}`, voz: 'maestra' })
    lineas.push({ texto: `es:${f.es}`, voz: 'espanol' })
    // El eco de la palabra sola en voz de niño: la maestra nombra, José repite.
    if (f.eco) lineas.push({ texto: f.eco, voz: 'nino' })
  }

  for (const u of UNIDADES) {
    for (const e of u.cuento.escenas) {
      e.en.forEach((linea) => lineas.push({ texto: linea, voz: 'maestra' }))
      lineas.push({ texto: e.en.join(' '), voz: 'maestra' })
      lineas.push({ texto: `es:${e.es}`, voz: 'espanol' })
      if (e.pregunta) lineas.push({ texto: e.pregunta.en, voz: 'maestra' })
    }
    u.cancion.versos.forEach((v) => lineas.push({ texto: v, voz: 'nino' }))
    lineas.push({ texto: u.mision.en, voz: 'maestra' })
    lineas.push({ texto: `es:${u.mision.es}`, voz: 'espanol' })
  }

  for (const o of ORACIONES) {
    lineas.push({ texto: o.titulo, voz: 'oracion' })
    o.versos.forEach((v) => lineas.push({ texto: v, voz: 'oracion' }))
  }

  for (const c of CROMOS) {
    lineas.push({ texto: c.en, voz: 'coach' })
    lineas.push({ texto: `es:${c.es}`, voz: 'espanol' })
  }

  // 1. My Little Prayers
  for (const p of PEQUENAS_ORACIONES) {
    lineas.push({ texto: p.audioInicio, voz: 'oracion' })
    for (const op of p.opciones) {
      lineas.push({ texto: op.en, voz: 'oracion' })
      lineas.push({ texto: op.fraseCompleta, voz: 'oracion' })
    }
  }

  // 2. Bible Friends
  for (const h of HISTORIAS_BIBLICAS) {
    lineas.push({ texto: h.titulo, voz: 'maestra' })
    for (const esc of h.escenas) {
      lineas.push({ texto: esc.titulo, voz: 'maestra' })
      lineas.push({ texto: esc.narracion, voz: 'maestra' })
      for (const el of esc.elementos) {
        lineas.push({ texto: el.nombre, voz: 'maestra' })
        lineas.push({ texto: el.sonidoOTexto, voz: 'maestra' })
      }
    }
  }

  // 3. Sing & Praise
  for (const c of CANCIONES_ALABANZA) {
    lineas.push({ texto: c.titulo, voz: 'nino' })
    for (const v of c.versos) {
      lineas.push({ texto: v, voz: 'nino' })
    }
  }

  // 4. Holy Things & Church
  for (const obj of OBJETOS_SAGRADOS) {
    lineas.push({ texto: obj.nombre, voz: 'oracion' })
    lineas.push({ texto: obj.orden, voz: 'oracion' })
    lineas.push({ texto: obj.respuesta, voz: 'oracion' })
  }

  // 5. Minijuegos Católicos
  for (const f of FRASES_MINIJUEGOS) {
    lineas.push({ texto: f, voz: 'oracion' })
  }

  // 6. Los cinco minijuegos de movimiento. Estos traen su propia voz por
  // frase —maestra, entrenador, niño u oración— en vez de una sola para
  // todos: quién dice qué es parte de lo que enseñan.
  for (const l of LINEAS_MINIJUEGOS_EXTRA) {
    lineas.push(l)
  }

  // 7. Las frases escritas dentro de una pantalla que ningún archivo de
  // contenido declaraba. Sin esto las dice el sintetizador del sistema; el
  // porqué, en `frases-sueltas.ts`.
  for (const l of FRASES_SUELTAS) {
    lineas.push(l)
  }

  return sinRepetir(lineas)
}
