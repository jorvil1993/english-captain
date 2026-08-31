/**
 * DATOS DE LOS 5 MINI JUEGOS CATÓLICOS (4 AÑOS)
 */

export type MinijuegoInfo = {
  id: 'champions' | 'altar' | 'noah' | 'nativity' | 'creation' | 'routine'
  titulo: string
  emoji: string
  img: string
  descripcion: string
}

export const LISTA_MINIJUEGOS: MinijuegoInfo[] = [
  {
    id: 'champions',
    titulo: 'Champions of Jesus',
    emoji: '⚽',
    img: 'c-messi',
    descripcion: 'Fútbol con Messi, Mbappé, Lamine y Dibu dando gracias a Dios.',
  },
  {
    id: 'altar',
    titulo: 'Light the Altar',
    emoji: '🕯️',
    img: 'altar-scene',
    descripcion: 'Enciende las velas del altar para Jesús.',
  },
  {
    id: 'noah',
    titulo: "Noah's Pair Match",
    emoji: '🚢',
    img: 'noah-ark',
    descripcion: 'Guía a los animales al Arca de Noé.',
  },
  {
    id: 'nativity',
    titulo: 'Dress the Nativity',
    emoji: '⭐',
    img: 'nativity-stable',
    descripcion: 'Coloca las figuras en el Pesebre de Belén.',
  },
  {
    id: 'creation',
    titulo: 'Creation Tap & Bloom',
    emoji: '🌸',
    img: 'u3-flowers',
    descripcion: 'Haz florecer el hermoso jardín de Dios.',
  },
  {
    id: 'routine',
    titulo: 'Morning & Night Blessings',
    emoji: '🌙',
    img: 'u5-angel',
    descripcion: 'La rutina de oración de la mañana y la noche.',
  },
]

export const FRASES_MINIJUEGOS = [
  // 1. Light the Altar
  'Light the Altar',
  'Tap the candles to light the altar!',
  'Candle!',
  'Light!',
  'Fire!',
  'Holy Cross!',
  'Let your light shine!',
  'Thank you, Jesus! Amen!',

  // 2. Noah's Pair Match
  "Noah's Pair Match",
  'Find the lion!',
  'Find the sheep!',
  'Find the dove!',
  'Find the elephant!',
  'Lion! Roar!',
  'Sheep! Baa!',
  'Dove! Coo-coo!',
  'Elephant! Pawoo!',
  'The dove flies high!',
  'Rainbow! Red, yellow, green, blue!',
  'All safe in the Ark! Good job!',

  // 3. Dress the Nativity
  'Dress the Nativity',
  'Put the Holy Family in the stable!',
  'Place Mother Mary!',
  'Place Saint Joseph!',
  'Place Baby Jesus in the manger!',
  'Put the star in the sky!',
  'Mother Mary!',
  'Saint Joseph!',
  'Baby Jesus!',
  'Big shining star!',
  'Welcome, Baby Jesus! Glory to God!',

  // 4. Creation Tap & Bloom
  'Creation Tap and Bloom',
  'Tap to make the garden bloom!',
  'Flower! Beautiful flower!',
  'Sun! God made the sun!',
  'Water! Splash splash!',
  'Green tree! God made the trees!',
  'Singing birds! Tweet tweet!',
  'Swimming fish! Splash!',
  'Everything God made is good and beautiful!',

  // 5. Morning & Night Blessings
  'Morning and Night Blessings',
  'Good morning, God! Thank you for this day!',
  'Open the curtains! Hello, sunshine!',
  'Hands together: Good morning, Jesus!',
  'Good night, little Captain!',
  'Look at the moon and stars!',
  'Angel of God, protect me. Amen!',
  'Sleep in peace. God loves you!',

  // Refuerzo general
  'Good job! God loves you!',
  'Bless you, little Captain!',
  'You did it! Wonderful!',
]
