/**
 * DATOS DE LAS 4 SECCIONES CATÓLICAS INTERACTIVAS
 *
 * 1. My Little Prayers (Completar oraciones con toques)
 * 2. Bible Friends (Historias táctiles interactivas)
 * 3. Sing & Praise (Canciones con pandereta y campana)
 * 4. Holy Things & Church (Descubrimiento y colocación de objetos sagrados)
 */

export type OpcionOracion = {
  id: string
  en: string
  fraseCompleta: string
  emoji: string
  img: string
}

export type PequenaOracion = {
  id: string
  inicio: string
  audioInicio: string
  opciones: OpcionOracion[]
}

export const PEQUENAS_ORACIONES: PequenaOracion[] = [
  {
    id: 'food',
    inicio: 'Thank you, God, for my...',
    audioInicio: 'Thank you, God, for my...',
    opciones: [
      { id: 'food', en: 'food', fraseCompleta: 'Thank you, God, for my food! Amen!', emoji: '🍎', img: 'u3-all-good' },
      { id: 'family', en: 'family', fraseCompleta: 'Thank you, God, for my family! Amen!', emoji: '👨‍👩‍👦', img: 'u4-family' },
    ],
  },
  {
    id: 'morning',
    inicio: 'Good morning, God, thank you for the...',
    audioInicio: 'Good morning, God, thank you for the...',
    opciones: [
      { id: 'sun', en: 'sun', fraseCompleta: 'Good morning, God, thank you for the sun! Amen!', emoji: '☀️', img: 'u3-sun' },
      { id: 'birds', en: 'birds', fraseCompleta: 'Good morning, God, thank you for the birds! Amen!', emoji: '🐦', img: 'u3-birds' },
    ],
  },
  {
    id: 'angel',
    inicio: 'Angel of God, please protect my...',
    audioInicio: 'Angel of God, please protect my...',
    opciones: [
      { id: 'home', en: 'home', fraseCompleta: 'Angel of God, please protect my home! Amen!', emoji: '🏠', img: 'u4-home' },
      { id: 'heart', en: 'heart', fraseCompleta: 'Angel of God, please protect my heart! Amen!', emoji: '❤️', img: 'u2-i-love-you' },
    ],
  },
  {
    id: 'jesus-love',
    inicio: 'Jesus, I love you with all my...',
    audioInicio: 'Jesus, I love you with all my...',
    opciones: [
      { id: 'heart', en: 'heart', fraseCompleta: 'Jesus, I love you with all my heart! Amen!', emoji: '💖', img: 'u2-i-love-you' },
      { id: 'strength', en: 'strength', fraseCompleta: 'Jesus, I love you with all my strength! Amen!', emoji: '💪', img: 'u5-brave' },
    ],
  },
]

export type ElementoBiblico = {
  id: string
  nombre: string
  sonidoOTexto: string
  emoji: string
  img: string
}

export type EscenaBiblica = {
  titulo: string
  narracion: string
  elementos: ElementoBiblico[]
}

export type HistoriaBiblica = {
  id: string
  titulo: string
  icono: string
  img: string
  escenas: EscenaBiblica[]
}

export const HISTORIAS_BIBLICAS: HistoriaBiblica[] = [
  {
    id: 'noah',
    titulo: "Noah's Ark",
    icono: '🚢',
    img: 'noah-ark',
    escenas: [
      {
        titulo: "The Animals in the Ark",
        narracion: "The Ark is safe on the water. Tap the animals!",
        elementos: [
          { id: 'lion', nombre: 'Lion', sonidoOTexto: 'Lion! Roar!', emoji: '🦁', img: 'u5-no-fear' },
          { id: 'dove', nombre: 'Dove', sonidoOTexto: 'Dove! Coo-coo!', emoji: '🕊️', img: 'u6-peace' },
          { id: 'sheep', nombre: 'Sheep', sonidoOTexto: 'Sheep! Baa!', emoji: '🐑', img: 'u2-sheep' },
        ],
      },
      {
        titulo: "The Olive Branch",
        narracion: "The gentle dove brings green leaves! The rain is over.",
        elementos: [
          { id: 'dove-fly', nombre: 'Fly, gentle dove!', sonidoOTexto: 'Fly, gentle dove!', emoji: '🕊️', img: 'u6-peace' },
          { id: 'green-tree', nombre: 'Green trees are back!', sonidoOTexto: 'Green trees are back!', emoji: '🌳', img: 'u3-trees' },
        ],
      },
      {
        titulo: "God's Rainbow",
        narracion: "Look! God makes a beautiful rainbow in the sky!",
        elementos: [
          { id: 'rainbow', nombre: 'Rainbow! Red, yellow, green, blue!', sonidoOTexto: 'Rainbow! Red, yellow, green, blue!', emoji: '🌈', img: 'u3-beautiful' },
          { id: 'thank-god-noah', nombre: 'Thank you, God!', sonidoOTexto: 'Thank you, God!', emoji: '🙏', img: 'u3-thank-god' },
        ],
      },
    ],
  },
  {
    id: 'baby-jesus',
    titulo: 'Baby Jesus',
    icono: '👶',
    img: 'u4-jesus',
    escenas: [
      {
        titulo: 'The Bright Star',
        narracion: 'Look up! A bright golden star shines over Bethlehem.',
        elementos: [
          { id: 'star-nativity', nombre: 'Bright Star!', sonidoOTexto: 'Bright Star!', emoji: '⭐', img: 'u3-stars' },
          { id: 'sheep-nativity', nombre: 'Little Lamb!', sonidoOTexto: 'Little Lamb! Baa!', emoji: '🐑', img: 'u2-sheep' },
        ],
      },
      {
        titulo: 'The Holy Family',
        narracion: 'In the cozy manger, Mary and Saint Joseph smile.',
        elementos: [
          { id: 'mary-nativity', nombre: 'Mother Mary!', sonidoOTexto: 'Mother Mary!', emoji: '🌹', img: 'u4-mary' },
          { id: 'joseph-nativity', nombre: 'Saint Joseph!', sonidoOTexto: 'Saint Joseph!', emoji: '🪵', img: 'u4-joseph' },
          { id: 'baby-jesus-nativity', nombre: 'Baby Jesus!', sonidoOTexto: 'Baby Jesus! Welcome!', emoji: '👶', img: 'u4-jesus' },
        ],
      },
      {
        titulo: 'Praising God',
        narracion: 'Angels sing in the sky: Glory to God in the highest!',
        elementos: [
          { id: 'angels-sing', nombre: 'Glory to God!', sonidoOTexto: 'Glory to God in the highest!', emoji: '👼', img: 'u5-glory-god' },
          { id: 'peace-earth', nombre: 'Peace on earth!', sonidoOTexto: 'Peace on earth!', emoji: '🕊️', img: 'u6-peace' },
        ],
      },
    ],
  },
  {
    id: 'creation',
    titulo: "God's Creation",
    icono: '🌎',
    img: 'world-globe',
    escenas: [
      {
        titulo: 'Sun and Waters',
        narracion: 'God made the brilliant sun and the clear blue water.',
        elementos: [
          { id: 'sun-create', nombre: 'Shining Sun!', sonidoOTexto: 'Shining Sun! Warm and bright!', emoji: '☀️', img: 'u3-sun' },
          { id: 'water-create', nombre: 'Blue Water!', sonidoOTexto: 'Blue Water! Splash!', emoji: '💧', img: 'u3-water' },
        ],
      },
      {
        titulo: 'Trees and Birds',
        narracion: 'God made the leafy trees and the singing birds.',
        elementos: [
          { id: 'trees-create', nombre: 'Green Trees!', sonidoOTexto: 'Green Trees!', emoji: '🌳', img: 'u3-trees' },
          { id: 'birds-create', nombre: 'Singing Birds!', sonidoOTexto: 'Singing Birds! Tweet tweet!', emoji: '🐦', img: 'u3-birds' },
        ],
      },
      {
        titulo: 'Everything is Good',
        narracion: 'God looked at everything, and it was very good!',
        elementos: [
          { id: 'all-good-create', nombre: 'God is good!', sonidoOTexto: 'God is good! Everything is good!', emoji: '👍', img: 'u3-all-good' },
          { id: 'praise-create', nombre: 'Thank you, God!', sonidoOTexto: 'Thank you, God, for our world!', emoji: '🙏', img: 'u3-thank-god' },
        ],
      },
    ],
  },
]

export type VocabularioCancion = {
  id: string
  palabra: string
  audio: string
  emoji: string
  img: string
}

export type CancionAlabanza = {
  id: string
  titulo: string
  emoji: string
  img: string
  archivoAudio: string
  versos: string[]
  vocabulario: VocabularioCancion[]
}

export const CANCIONES_ALABANZA: CancionAlabanza[] = [
  {
    id: 'light',
    titulo: 'This Little Light of Mine',
    emoji: '🕯️',
    img: 'u5-light',
    archivoAudio: './audio/cancion_light.mp3',
    versos: [
      "This little light of mine, I'm gonna let it shine!",
      "This little light of mine, I'm gonna let it shine!",
      'Let it shine, let it shine, let it shine!',
    ],
    vocabulario: [
      { id: 'v-light', palabra: 'Light', audio: 'Candle! Light!', emoji: '🕯️', img: 'u5-light' },
      { id: 'v-shine', palabra: 'Shine', audio: 'Let your light shine!', emoji: '✨', img: 'shine-rays' },
      { id: 'v-star', palabra: 'Star', audio: 'Bright Star!', emoji: '⭐', img: 'star-solo' },
      { id: 'v-heart', palabra: 'Heart', audio: 'Jesus, I love you with all my heart! Amen!', emoji: '💖', img: 'heart-love' },
    ],
  },
  {
    id: 'hands',
    titulo: "He's Got the Whole World in His Hands",
    emoji: '🌎',
    img: 'world-globe',
    archivoAudio: './audio/cancion_world.mp3',
    versos: [
      "He's got the whole world in His hands,",
      "He's got the sun and the rain in His hands,",
      "He's got the little tiny baby in His hands,",
    ],
    vocabulario: [
      { id: 'v-world', palabra: 'World', audio: 'Thank you, God, for our world!', emoji: '🌎', img: 'world-globe' },
      { id: 'v-sun', palabra: 'Sun', audio: 'Sun! God made the sun!', emoji: '☀️', img: 'u3-sun' },
      { id: 'v-rain', palabra: 'Rain', audio: 'Water! Splash splash!', emoji: '🌧️', img: 'rain-drops' },
      { id: 'v-baby', palabra: 'Baby', audio: 'Baby Jesus!', emoji: '👶', img: 'u4-jesus' },
    ],
  },
  {
    id: 'loves-me',
    titulo: 'Jesus Loves Me',
    emoji: '❤️',
    img: 'u4-jesus',
    archivoAudio: './audio/cancion_lovesme.mp3',
    versos: [
      'Jesus loves me, this I know,',
      'For the Bible tells me so.',
      'Little ones to Him belong, yes, Jesus loves me!',
    ],
    vocabulario: [
      { id: 'v-jesus', palabra: 'Jesus', audio: 'Thank you, Jesus! Amen!', emoji: '👶', img: 'u4-jesus' },
      { id: 'v-bible', palabra: 'Bible', audio: 'Open the Word of God!', emoji: '📖', img: 'u6-bible' },
      { id: 'v-little', palabra: 'Little', audio: 'Good night, little Captain!', emoji: '🧒', img: 'u5-angel' },
      { id: 'v-love', palabra: 'Love', audio: 'God loves you!', emoji: '❤️', img: 'heart-love' },
    ],
  },
]

export type ObjetoSagrado = {
  id: string
  nombre: string
  orden: string
  respuesta: string
  emoji: string
  img: string
}

export const OBJETOS_SAGRADOS: ObjetoSagrado[] = [
  {
    id: 'cross',
    nombre: 'Holy Cross',
    orden: 'Tap the Holy Cross!',
    respuesta: 'Bless you! Amen!',
    emoji: '✝️',
    img: 'u6-cross',
  },
  {
    id: 'candle',
    nombre: 'Candle',
    orden: 'Light the holy candle!',
    respuesta: 'Shine your light! Beautiful!',
    emoji: '🕯️',
    img: 'u5-light',
  },
  {
    id: 'bible',
    nombre: 'Holy Bible',
    orden: 'Open the Word of God!',
    respuesta: 'God speaks with love! Great job!',
    emoji: '📖',
    img: 'u6-bible',
  },
  {
    id: 'bell',
    nombre: 'Church Bell',
    orden: 'Ring the church bell: ding-dong!',
    respuesta: 'Ding-dong! Ring the bell for God!',
    emoji: '🔔',
    img: 'u6-bell',
  },
  {
    id: 'angel',
    nombre: 'Guardian Angel',
    orden: 'Wave to your Guardian Angel!',
    respuesta: 'The angel protects you! Bless you!',
    emoji: '👼',
    img: 'u5-angel',
  },
  {
    id: 'flower',
    nombre: 'Flower',
    orden: 'Give a flower to Mother Mary!',
    respuesta: 'Mother Mary loves you! Wonderful!',
    emoji: '🌸',
    img: 'u3-flowers',
  },
  {
    id: 'church',
    nombre: 'House of God',
    orden: 'Welcome to the House of God!',
    respuesta: 'Peace be with you! Amen!',
    emoji: '⛪',
    img: 'u6-church',
  },
]
