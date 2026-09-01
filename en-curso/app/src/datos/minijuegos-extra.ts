/**
 * LOS 5 MINI JUEGOS DE MOVIMIENTO.
 *
 * Por qué existen aparte de `minijuegos.ts`: los cinco primeros se juegan
 * todos igual —se toca una cosa y pasa algo—. Está bien para empezar, pero un
 * niño de cuatro años colérico se aburre de tocar en tres días, y sobre todo
 * el toque no le enseña nada al cuerpo. Estos cinco no se tocan: se ARRASTRAN,
 * se TRAZAN, se AGITAN, se SOSTIENEN QUIETOS y se TIRAN. Cada uno entrena una
 * habilidad motora distinta, y cada habilidad va pegada a una frase en inglés
 * y a una verdad de la fe:
 *
 *   trace   el dedo sigue un camino    → la Señal de la Cruz + partes del cuerpo
 *   loaves  arrastrar y soltar         → los panes y los peces + contar 1-5
 *   angel   perseguir con el dedo      → el Ángel de la Guarda + left/right
 *   storm   agitar y después quedarse  → Jesús calma la tempestad + la calma
 *           quieto
 *   bells   tirar de la cuerda y       → las campanas llaman a Misa +
 *           repetir lo que sonó          big/middle/little
 *
 * Las reglas de la app siguen mandando: José nunca pierde, nada suena a error,
 * y todo lo que se dice tiene su mp3 grabado. Por eso las frases viven acá y
 * no dentro de cada pantalla — `corpus.ts` las junta y `generar_voces.mjs` las
 * graba solas.
 */

export type MinijuegoExtraId = 'trace' | 'loaves' | 'angel' | 'storm' | 'bells'

export type MinijuegoExtraInfo = {
  id: MinijuegoExtraId
  titulo: string
  emoji: string
  img: string
  /** Para papá, en la tarjeta y en el panel. José nunca lee esto. */
  descripcion: string
  /** Qué hace el dedo. Es lo que distingue a estos cinco de los otros cinco. */
  gesto: string
  /** Qué se lleva en inglés. */
  aprende: string
}

export const LISTA_MINIJUEGOS_EXTRA: MinijuegoExtraInfo[] = [
  {
    id: 'trace',
    titulo: 'Trace the Holy Cross',
    emoji: '✝️',
    img: 'u6-cross',
    descripcion: 'Traza con el dedo la Señal de la Cruz sobre el cuerpo.',
    gesto: 'Arrastrar el dedo siguiendo un camino de luz',
    aprende: 'forehead · chest · left shoulder · right shoulder · Amen',
  },
  {
    id: 'loaves',
    titulo: 'Loaves and Fishes',
    emoji: '🍞',
    img: 'u3-all-good',
    descripcion: 'Reparte pan y pescado a los niños con hambre.',
    gesto: 'Arrastrar y soltar sobre el niño correcto',
    aprende: 'one · two · three · four · five · bread · fish · Thank you!',
  },
  {
    id: 'angel',
    titulo: 'Guardian Angel Catch',
    emoji: '👼',
    img: 'u5-angel',
    descripcion: 'Sigue la luz del Ángel de la Guarda para no perderte.',
    gesto: 'Mover el dedo al compás de la luz suave',
    aprende: 'follow · light · left · right · I am safe! · Amen',
  },
  {
    id: 'storm',
    titulo: 'Calm the Storm',
    emoji: '🌊',
    img: 'u3-water',
    descripcion: 'Agita la tormenta y quédate quieto cuando Jesús dice paz.',
    gesto: 'Agitar rápido y frenar en seco con la mano quieta',
    aprende: 'wind · storm · Peace! · quiet · thank you, Jesus',
  },
  {
    id: 'bells',
    titulo: 'Ring the Church Bells',
    emoji: '🔔',
    img: 'u6-bell',
    descripcion: 'Tira de la cuerda de la campana y repite la melodía.',
    gesto: 'Tirar hacia abajo con fuerza y soltar',
    aprende: 'ding dong · big bell · little bell · come to church',
  },
]

type Voz = 'maestra' | 'nino' | 'oracion' | 'coach' | 'espanol'
type Linea = { texto: string; voz: Voz }

/**
 * Todo lo que estas cinco pantallas dicen en voz alta.
 *
 * La voz de cada línea no es decorativa: la maestra explica, el coach da la
 * orden al cuerpo, el niño celebra y la voz de oración reza. Varios hablantes
 * para la misma lengua es lo que hace el método SparkLing a propósito
 * (§1.7 de la investigación): un solo timbre enseña una sola forma de decirlo.
 */
export const LINEAS_MINIJUEGOS_EXTRA: Linea[] = [
  // ── 1 · Trace the Holy Cross ──────────────────────────────────────────
  { texto: 'Trace the Holy Cross', voz: 'oracion' },
  { texto: 'Let us make the Sign of the Cross!', voz: 'oracion' },
  { texto: 'Slide your finger to the light!', voz: 'coach' },
  { texto: 'Touch your forehead.', voz: 'coach' },
  { texto: 'In the name of the Father,', voz: 'oracion' },
  { texto: 'Touch your chest.', voz: 'coach' },
  { texto: 'and of the Son,', voz: 'oracion' },
  { texto: 'Touch your left shoulder.', voz: 'coach' },
  { texto: 'and of the Holy Spirit.', voz: 'oracion' },
  { texto: 'Touch your right shoulder.', voz: 'coach' },
  { texto: 'Amen!', voz: 'oracion' },
  { texto: 'Your forehead is up here.', voz: 'maestra' },
  { texto: 'Your chest is right here.', voz: 'maestra' },
  { texto: 'Your left shoulder is over here.', voz: 'maestra' },
  { texto: 'Your right shoulder is over here.', voz: 'maestra' },
  { texto: 'Keep your finger on the light.', voz: 'coach' },
  { texto: 'This is the Sign of the Cross!', voz: 'oracion' },
  { texto: 'Now do it on your own body!', voz: 'coach' },
  { texto: 'Beautiful! You made the Sign of the Cross!', voz: 'maestra' },

  // ── 2 · Loaves and Fishes ─────────────────────────────────────────────
  { texto: 'Loaves and Fishes', voz: 'maestra' },
  { texto: 'The children are hungry!', voz: 'maestra' },
  { texto: 'Five loaves and two fish.', voz: 'maestra' },
  { texto: 'Drag the bread to the child!', voz: 'coach' },
  { texto: 'Drag the fish to the child!', voz: 'coach' },
  { texto: 'Take the food with your finger!', voz: 'coach' },
  { texto: 'Bread!', voz: 'maestra' },
  { texto: 'Fish!', voz: 'maestra' },
  { texto: 'One!', voz: 'nino' },
  { texto: 'Two!', voz: 'nino' },
  { texto: 'Three!', voz: 'nino' },
  { texto: 'Four!', voz: 'nino' },
  { texto: 'Five!', voz: 'nino' },
  { texto: 'One bread for you!', voz: 'maestra' },
  { texto: 'One fish for you!', voz: 'maestra' },
  { texto: 'Yummy! Thank you!', voz: 'nino' },
  { texto: 'The basket is never empty!', voz: 'maestra' },
  { texto: 'Jesus gives food to everyone.', voz: 'oracion' },
  { texto: 'Everybody is full! Thank you, Jesus!', voz: 'oracion' },

  // ── 3 · Guardian Angel Catch ──────────────────────────────────────────
  { texto: 'Guardian Angel Catch', voz: 'oracion' },
  { texto: 'Angel of God, my guardian dear!', voz: 'oracion' },
  { texto: 'Move the angel with your finger!', voz: 'coach' },
  { texto: 'Guide the angel with your finger!', voz: 'coach' },
  { texto: 'Guide the angel!', voz: 'coach' },
  { texto: 'Catch the falling stars!', voz: 'coach' },
  { texto: 'Catch the star!', voz: 'coach' },
  { texto: 'You caught it!', voz: 'nino' },
  { texto: 'One more star!', voz: 'nino' },
  { texto: 'The angel is fast!', voz: 'coach' },
  { texto: 'A little flower for God!', voz: 'maestra' },
  { texto: 'My angel takes care of me.', voz: 'oracion' },
  { texto: 'Ever this day be at my side!', voz: 'oracion' },
  { texto: 'All the stars are home! Amen!', voz: 'oracion' },

  // ── 4 · Calm the Storm ────────────────────────────────────────────────
  { texto: 'Calm the Storm', voz: 'maestra' },
  { texto: 'Jesus is sleeping in the boat.', voz: 'maestra' },
  { texto: 'Shake your finger fast! Make the storm!', voz: 'coach' },
  { texto: 'The wind is blowing! Woo, woo!', voz: 'coach' },
  { texto: 'Faster! Big waves!', voz: 'coach' },
  { texto: 'Shake, shake, shake!', voz: 'coach' },
  { texto: 'Wake up, Jesus! Help us!', voz: 'nino' },
  { texto: 'Peace! Be still!', voz: 'oracion' },
  { texto: 'Now hold your finger very still.', voz: 'oracion' },
  { texto: 'Do not move. Quiet.', voz: 'oracion' },
  { texto: 'Still. Very still.', voz: 'oracion' },
  { texto: 'The wind stops.', voz: 'oracion' },
  { texto: 'The sea is calm.', voz: 'oracion' },
  { texto: 'Do not be afraid. Jesus is with you.', voz: 'oracion' },
  { texto: 'You are calm, like the sea. Amen!', voz: 'oracion' },

  // ── 5 · Ring the Church Bells ─────────────────────────────────────────
  { texto: 'Ring the Church Bells', voz: 'maestra' },
  { texto: 'Pull the rope with your finger!', voz: 'coach' },
  { texto: 'Pull down! Down, down!', voz: 'coach' },
  { texto: 'Big bell!', voz: 'maestra' },
  { texto: 'Middle bell!', voz: 'maestra' },
  { texto: 'Little bell!', voz: 'maestra' },
  { texto: 'Ding, dong! Ding, dong!', voz: 'nino' },
  { texto: 'Listen!', voz: 'maestra' },
  { texto: 'Now you! Do the same!', voz: 'coach' },
  { texto: 'Yes! The same bells!', voz: 'nino' },
  { texto: 'Listen again!', voz: 'maestra' },
  { texto: 'The bells call us to church.', voz: 'oracion' },
  { texto: 'It is time for Holy Mass!', voz: 'oracion' },
  { texto: 'Come to church! Come and pray!', voz: 'oracion' },
  { texto: 'You rang all the bells! Wonderful!', voz: 'nino' },

  // ── Cierre compartido ─────────────────────────────────────────────────
  { texto: 'Good job! God loves you!', voz: 'oracion' },
]
