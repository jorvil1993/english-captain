import type { Cancion, Cromo, Cuento, Frase, Oracion, Unidad } from './tipos'

/**
 * EL CONTENIDO.
 *
 * Tres reglas que cumplen todas las unidades:
 *
 *  1. Frases enteras y útiles, nunca listas de palabras (§1.1).
 *  2. Las mismas frases atraviesan los tres hilos —vida, fe, fútbol— para que
 *     el bloque se despiece solo: "Here is the ball" / "Here is the sheep".
 *  3. Cada unidad apunta a UNA de las cuatro virtudes que los papás
 *     priorizaron (perfil §5), y la virtud se muestra en la historia, no se
 *     predica. Don Bosco vía el padre Paulo: a esta edad no es "bueno o malo",
 *     es "feo o lindo".
 *
 * La unidad 1 va de fútbol y de perder bien a propósito: es el gancho más
 * fuerte que tiene José y a la vez su punto más flojo (odia perder, perfil §1).
 * El gimnasio y el imán son la misma cancha.
 */

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 1 · THE BIG GAME · fortaleza
// ─────────────────────────────────────────────────────────────────────────────

const frasesU1: Frase[] = [
  { id: 'u1-ball', en: 'Here is the ball.', es: 'Aquí está la pelota.', ordenEn: 'Show me the ball!', gesto: 'Señala la pelota con el dedo.', img: 'u1-ball', emoji: '⚽', hilo: 'futbol' },
  { id: 'u1-run', en: 'Run!', es: '¡Corre!', ordenEn: 'Run!', gesto: 'Corre en el mismo sitio.', img: 'u1-run', emoji: '🏃', hilo: 'futbol' },
  { id: 'u1-jump', en: 'Jump!', es: '¡Salta!', ordenEn: 'Jump!', gesto: 'Salta con los dos pies.', img: 'u1-jump', emoji: '🤸', hilo: 'futbol' },
  { id: 'u1-kick', en: 'Kick the ball!', es: '¡Patea la pelota!', ordenEn: 'Kick the ball!', gesto: 'Patea con el pie, sin pelota.', img: 'u1-kick', emoji: '🦵', hilo: 'futbol' },
  { id: 'u1-stop', en: 'Stop!', es: '¡Para!', ordenEn: 'Stop!', gesto: 'Quédate quieto con la mano arriba.', img: 'u1-stop', emoji: '✋', hilo: 'futbol' },
  { id: 'u1-goal', en: 'Goal!', es: '¡Gol!', ordenEn: 'Say: goal!', gesto: 'Los dos brazos arriba.', img: 'u1-goal', emoji: '🥅', hilo: 'futbol' },
  { id: 'u1-i-can', en: 'I can do it!', es: '¡Yo puedo!', ordenEn: 'Say: I can do it!', gesto: 'Los dos puños al pecho, fuerte.', img: 'u1-i-can', emoji: '💪', hilo: 'futbol' },
  { id: 'u1-good-game', en: 'Good game!', es: '¡Buen partido!', ordenEn: 'Say: good game!', gesto: 'Choca los cinco.', img: 'u1-good-game', emoji: '🤝', hilo: 'futbol' },
]

const cuentoU1: Cuento = {
  titulo: 'The Big Game',
  escenas: [
    { img: 'u1-c1', emoji: '🏟️', en: ['This is Captain José.', 'Today is the big game!'], es: 'Este es el capitán José. ¡Hoy es el partido grande!' },
    {
      img: 'u1-c2', emoji: '⚽', en: ['Here is the ball.'], es: 'Aquí está la pelota.',
      pregunta: { en: 'Where is the ball?', opciones: [{ fraseId: 'u1-ball', correcta: true }, { fraseId: 'u1-jump', correcta: false }] },
    },
    { img: 'u1-c3', emoji: '🏃', en: ['Run, José! Run!', 'Jump!'], es: '¡Corre, José, corre! ¡Salta!' },
    {
      img: 'u1-c4', emoji: '🥅', en: ['Kick the ball!', 'GOAL!'], es: '¡Patea la pelota! ¡Gol!',
      pregunta: { en: 'What do we say?', opciones: [{ fraseId: 'u1-goal', correcta: true }, { fraseId: 'u1-stop', correcta: false }] },
    },
    // Acá pierde. Se nombra la emoción y no se la juzga — es el paso 1 del
    // protocolo del padre Paulo (nombrar → bajar → gestionar), puesto en un
    // cuento en vez de en un sermón.
    { img: 'u1-c5', emoji: '😞', en: ['The other team scores.', 'One... two.', 'José is sad.'], es: 'El otro equipo mete dos goles. José está triste.' },
    {
      img: 'u1-c6', emoji: '🤝', en: ['But José is strong.', 'He says: Good game!'], es: 'Pero José es fuerte. Dice: ¡buen partido!',
      pregunta: { en: 'What does a strong captain say?', opciones: [{ fraseId: 'u1-good-game', correcta: true }, { fraseId: 'u1-kick', correcta: false }] },
    },
  ],
}

const cancionU1: Cancion = {
  titulo: 'Run and Kick',
  versos: ['Run, run, run!', 'Jump, jump, jump!', 'Kick the ball!', 'Goal, goal, GOAL!', 'Good game, good game!', 'I can do it!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 2 · THE LOST SHEEP · piedad
// El corazón de la Catequesis del Buen Pastor para 3-6 años: el Pastor que
// llama a cada oveja POR SU NOMBRE (Cavalletti). Es, además, la imagen que
// justifica que la app le hable a José por su nombre (§1.2, contingencia).
// ─────────────────────────────────────────────────────────────────────────────

const frasesU2: Frase[] = [
  { id: 'u2-shepherd', en: 'Jesus is the Good Shepherd.', es: 'Jesús es el Buen Pastor.', ordenEn: 'Show me the Shepherd!', gesto: 'Las dos manos en el corazón.', img: 'u2-shepherd', emoji: '🐑', hilo: 'fe' },
  { id: 'u2-sheep', en: 'Here is the sheep.', es: 'Aquí está la oveja.', ordenEn: 'Show me the sheep!', gesto: 'Señala la oveja.', img: 'u2-sheep', emoji: '🐏', hilo: 'fe' },
  { id: 'u2-my-name', en: 'He calls me by my name.', es: 'Él me llama por mi nombre.', ordenEn: 'Say your name!', gesto: 'Señálate el pecho.', img: 'u2-my-name', emoji: '🙋', hilo: 'fe' },
  { id: 'u2-come', en: 'Come!', es: '¡Ven!', ordenEn: 'Come!', gesto: 'Llama con la mano.', img: 'u2-come', emoji: '👋', hilo: 'fe' },
  { id: 'u2-follow', en: 'Follow me.', es: 'Sígueme.', ordenEn: 'Follow me!', gesto: 'Camina en el mismo sitio.', img: 'u2-follow', emoji: '👣', hilo: 'fe' },
  { id: 'u2-lost', en: 'The sheep is lost.', es: 'La oveja está perdida.', ordenEn: 'Look for the sheep!', gesto: 'Mira a un lado y al otro.', img: 'u2-lost', emoji: '🔍', hilo: 'fe' },
  { id: 'u2-found', en: 'He finds the sheep!', es: '¡Encuentra la oveja!', ordenEn: 'Say: he finds the sheep!', gesto: 'Abre bien los brazos.', img: 'u2-found', emoji: '🤗', hilo: 'fe' },
  { id: 'u2-i-love-you', en: 'I love you.', es: 'Te quiero.', ordenEn: 'Say: I love you!', gesto: 'Abrázate tú mismo.', img: 'u2-i-love-you', emoji: '❤️', hilo: 'fe' },
]

const cuentoU2: Cuento = {
  titulo: 'The Lost Sheep',
  escenas: [
    { img: 'u2-c1', emoji: '🐑', en: ['Jesus is the Good Shepherd.', 'He has one hundred sheep.'], es: 'Jesús es el Buen Pastor. Tiene cien ovejas.' },
    {
      img: 'u2-c2', emoji: '👋', en: ['He calls them by name.', 'Come! Come!'], es: 'Las llama por su nombre. ¡Ven! ¡Ven!',
      pregunta: { en: 'Who calls the sheep?', opciones: [{ fraseId: 'u2-shepherd', correcta: true }, { fraseId: 'u2-sheep', correcta: false }] },
    },
    { img: 'u2-c3', emoji: '🔍', en: ['One sheep is lost.', 'The sheep is alone.'], es: 'Una oveja se perdió. Está solita.' },
    { img: 'u2-c4', emoji: '👣', en: ['The Shepherd goes.', 'He looks and looks and looks.'], es: 'El Pastor sale a buscarla. Busca y busca y busca.' },
    {
      img: 'u2-c5', emoji: '🤗', en: ['He finds the sheep!'], es: '¡La encuentra!',
      pregunta: { en: 'Who finds the sheep?', opciones: [{ fraseId: 'u2-shepherd', correcta: true }, { fraseId: 'u2-lost', correcta: false }] },
    },
    { img: 'u2-c6', emoji: '❤️', en: ['He carries the sheep home.', 'The Shepherd loves his sheep.', 'He knows your name too.'], es: 'La lleva a casa en sus hombros. El Pastor ama a sus ovejas. También sabe tu nombre.' },
  ],
}

const cancionU2: Cancion = {
  titulo: 'Come and Follow',
  versos: ['Come, come, follow me.', 'I know your name.', 'Come, come, follow me.', 'The Good Shepherd loves you.'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 3 · A DAY WITH MOM · obediencia y respeto
// Trae "I am sorry" a propósito: el antídoto que el padre Paulo señala para el
// punto ciego colérico es practicar en pequeño "me equivoqué, perdón", sin
// agregar excusas (perfil §1).
// ─────────────────────────────────────────────────────────────────────────────

const frasesU3: Frase[] = [
  { id: 'u3-good-morning', en: 'Good morning!', es: '¡Buenos días!', ordenEn: 'Say: good morning!', gesto: 'Saluda con la mano bien alto.', img: 'u3-good-morning', emoji: '🌅', hilo: 'vida' },
  { id: 'u3-good-night', en: 'Good night!', es: '¡Buenas noches!', ordenEn: 'Say: good night!', gesto: 'Las manos juntas en la mejilla.', img: 'u3-good-night', emoji: '🌙', hilo: 'vida' },
  { id: 'u3-how-are-you', en: 'How are you?', es: '¿Cómo estás?', ordenEn: 'Ask: how are you?', gesto: 'Abre las dos manos.', img: 'u3-how-are-you', emoji: '🙂', hilo: 'vida' },
  { id: 'u3-im-happy', en: 'I am happy!', es: '¡Estoy feliz!', ordenEn: 'Say: I am happy!', gesto: 'Sonríe bien grande.', img: 'u3-im-happy', emoji: '😄', hilo: 'vida' },
  { id: 'u3-please', en: 'Milk, please.', es: 'Leche, por favor.', ordenEn: 'Say: please!', gesto: 'Junta las manos y pide.', img: 'u3-please', emoji: '🥛', hilo: 'vida' },
  { id: 'u3-thank-you', en: 'Thank you!', es: '¡Gracias!', ordenEn: 'Say: thank you!', gesto: 'La mano del pecho hacia adelante.', img: 'u3-thank-you', emoji: '🙏', hilo: 'vida' },
  { id: 'u3-im-sorry', en: 'I am sorry.', es: 'Perdón.', ordenEn: 'Say: I am sorry.', gesto: 'La mano en el corazón, despacio.', img: 'u3-im-sorry', emoji: '💗', hilo: 'vida' },
  { id: 'u3-i-love-you-mom', en: 'I love you, mom.', es: 'Te quiero, mamá.', ordenEn: 'Say: I love you, mom!', gesto: 'Un abrazo grande.', img: 'u3-i-love-you-mom', emoji: '🤱', hilo: 'vida' },
]

const cuentoU3: Cuento = {
  titulo: 'A Day with Mom',
  escenas: [
    { img: 'u3-c1', emoji: '🌅', en: ['The sun is up.', 'Good morning, José!'], es: 'Salió el sol. ¡Buenos días, José!' },
    {
      img: 'u3-c2', emoji: '🙂', en: ['Good morning, mom!', 'How are you?'], es: '¡Buenos días, mamá! ¿Cómo estás?',
      pregunta: { en: 'What do we say in the morning?', opciones: [{ fraseId: 'u3-good-morning', correcta: true }, { fraseId: 'u3-good-night', correcta: false }] },
    },
    { img: 'u3-c3', emoji: '🥛', en: ['Breakfast!', 'Milk, please.', 'Thank you, mom!'], es: '¡El desayuno! Leche, por favor. ¡Gracias, mamá!' },
    { img: 'u3-c4', emoji: '💧', en: ['Oh no.', 'The milk falls.'], es: 'Ay, no. Se cae la leche.' },
    {
      img: 'u3-c5', emoji: '💗', en: ['José says: I am sorry.'], es: 'José dice: perdón.',
      pregunta: { en: 'What does José say?', opciones: [{ fraseId: 'u3-im-sorry', correcta: true }, { fraseId: 'u3-im-happy', correcta: false }] },
    },
    { img: 'u3-c6', emoji: '🤱', en: ['Mom hugs José.', 'I love you, mom.', 'Good night!'], es: 'Mamá abraza a José. Te quiero, mamá. ¡Buenas noches!' },
  ],
}

const cancionU3: Cancion = {
  titulo: 'Good Morning',
  versos: ['Good morning, good morning,', 'good morning to you!', 'How are you? How are you?', 'I am happy, thank you!'],
}

// ─────────────────────────────────────────────────────────────────────────────

export const UNIDADES: Unidad[] = [
  {
    id: 'u1', numero: 1, titulo: 'The Big Game — perder bien', hilo: 'futbol', virtud: 'fortaleza',
    frases: frasesU1, cuento: cuentoU1, cancion: cancionU1,
    mision: { en: "Say 'good game' to papá.", es: "Dile 'good game' a papá cuando termine un partido.", emoji: '🤝' },
  },
  {
    id: 'u2', numero: 2, titulo: 'The Lost Sheep — el Buen Pastor', hilo: 'fe', virtud: 'piedad',
    frases: frasesU2, cuento: cuentoU2, cancion: cancionU2,
    mision: { en: "Say 'thank you, God' at dinner.", es: "Di 'thank you, God' en la cena, en voz alta.", emoji: '🙏' },
  },
  {
    id: 'u3', numero: 3, titulo: 'A Day with Mom — cortesía y perdón', hilo: 'vida', virtud: 'obediencia',
    frases: frasesU3, cuento: cuentoU3, cancion: cancionU3,
    mision: { en: "Say 'good morning' to mamá.", es: "Mañana salúdala con 'good morning, mom'.", emoji: '🌅' },
  },
]

/**
 * Las oraciones. Rotan una por sesión.
 *
 * Todas por debajo de los 20 segundos y todas con gesto. José no rechaza rezar:
 * rechaza el formato largo, quieto y presionado (perfil §1). El molde que sí le
 * funciona —el rosario en el auto— es breve, compartido, pegado a una
 * actividad y sin exigencia. Este es ese molde.
 */
export const ORACIONES: Oracion[] = [
  { id: 'o-cross', titulo: 'Sign of the Cross', versos: ['In the name of the Father,', 'and of the Son,', 'and of the Holy Spirit.', 'Amen.'], gesto: 'Haz la señal de la cruz.', emoji: '✝️', img: 'o-cross' },
  { id: 'o-angel', titulo: 'Guardian Angel', versos: ['Angel of God,', 'my guardian dear,', 'be at my side today,', 'to light and guard me.', 'Amen.'], gesto: 'Las manos juntas.', emoji: '👼', img: 'o-angel' },
  { id: 'o-grace', titulo: 'Grace before meals', versos: ['Bless us, O Lord,', 'and these your gifts.', 'Amen.'], gesto: 'Las manos juntas sobre la mesa.', emoji: '🍞', img: 'o-grace' },
  { id: 'o-hail-mary', titulo: 'Hail Mary (breve)', versos: ['Hail Mary, full of grace,', 'the Lord is with thee.', 'Holy Mary, Mother of God,', 'pray for us.', 'Amen.'], gesto: 'Las manos juntas, mirando arriba.', emoji: '🌹', img: 'o-hail-mary' },
  { id: 'o-glory', titulo: 'Glory Be', versos: ['Glory be to the Father,', 'and to the Son,', 'and to the Holy Spirit.', 'Amen.'], gesto: 'Una pequeña inclinación de cabeza.', emoji: '⭐', img: 'o-glory' },
]

/**
 * Los cromos: jugadores reales con su foto real.
 *
 * Es el gancho, no el contenido — aparecen al final del reto, uno por sesión,
 * y siempre dicen una frase que YA está en la unidad. Las fotos son
 * fotografías reales con licencia libre (Wikimedia Commons), no caras
 * generadas: es la imagen de personas de verdad y no se inventa.
 */
export const CROMOS: Cromo[] = [
  { id: 'c-messi', nombre: 'Messi', en: 'Messi kicks the ball!', es: '¡Messi patea la pelota!', img: 'c-messi', emoji: '🐐', credito: 'Wikimedia Commons' },
  { id: 'c-mbappe', nombre: 'Mbappé', en: 'Mbappé runs fast!', es: '¡Mbappé corre rápido!', img: 'c-mbappe', emoji: '⚡', credito: 'Wikimedia Commons' },
  { id: 'c-yamal', nombre: 'Lamine Yamal', en: 'Lamine Yamal scores a goal!', es: '¡Lamine Yamal mete un gol!', img: 'c-yamal', emoji: '✨', credito: 'Wikimedia Commons' },
]

/** Índice plano de todas las frases, para el motor de repaso. */
export const TODAS_LAS_FRASES: Frase[] = UNIDADES.flatMap((u) => u.frases)

export function fraseDe(id: string): Frase {
  const f = TODAS_LAS_FRASES.find((x) => x.id === id)
  if (!f) throw new Error(`Frase desconocida: ${id}`)
  return f
}
