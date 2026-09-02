/**
 * FRASES QUE LA APP DICE Y QUE NINGÚN ARCHIVO DE CONTENIDO DECLARABA.
 *
 * Cómo aparecieron: `en-curso/artes/comprobar_frases.mjs` lee todas las
 * pantallas, saca las cadenas que van a `decir(...)` y las compara contra los
 * mp3 que hay en disco. Salieron doce que se dicen a diario y que no tenían
 * grabación —el saludo del menú de minijuegos, la bendición de la noche, el
 * "God saw that it was good" del jardín de la Creación—, así que hasta hoy las
 * decía el sintetizador del sistema.
 *
 * Por qué importa y no es un detalle: la voz del sistema en Windows y en la
 * mayoría de los Android es un motor viejo cuyo inglés no es inglés. José no
 * distingue una voz de otra; copia la que oye, y la oye todos los días durante
 * meses. Una frase sin grabar no se nota mirando la pantalla —se nota solo
 * escuchándola— y por eso pasó desapercibida.
 *
 * Están juntas acá, y no repartidas en los archivos de cada pantalla, por una
 * razón: las pantallas donde se dicen son de otro agente y no hay por qué
 * tocarlas para arreglar esto. Basta con DECLARAR la frase; el generador la
 * graba y la app la encuentra sola por el hash del texto.
 *
 * Lo ideal es que este archivo se vacíe: cada frase debería vivir en el
 * archivo de contenido de su pantalla. Mientras tanto, esto es mejor que la
 * voz robótica.
 */

type Voz = 'maestra' | 'nino' | 'oracion' | 'coach' | 'espanol'
type Linea = { texto: string; voz: Voz }

export const FRASES_SUELTAS: Linea[] = [
  // Holy Things & Church
  { texto: 'Great job, Captain! God bless you!', voz: 'maestra' },

  // My Little Prayers
  { texto: 'Bless you, Captain!', voz: 'oracion' },

  // Sing & Praise
  { texto: 'Learn the words!', voz: 'maestra' },
  { texto: 'Candle! Light!', voz: 'nino' },
  { texto: 'God loves you!', voz: 'nino' },

  // Creation Tap & Bloom
  { texto: 'God made the world! Tap to create!', voz: 'maestra' },
  { texto: 'God saw that it was good! Amen!', voz: 'oracion' },

  // Morning & Night Blessings
  { texto: 'Creation Tap & Bloom', voz: 'oracion' },
  { texto: 'Morning & Night Blessings', voz: 'oracion' },
  { texto: 'Good morning, God! Open the window!', voz: 'oracion' },
  { texto: 'Sun! Good morning, world! Thank you, Jesus!', voz: 'nino' },
  { texto: 'Bless my day! Amen!', voz: 'oracion' },
  { texto: 'Good night, Jesus! Look at the stars!', voz: 'oracion' },
  { texto: 'Angel of God, protect me through the night!', voz: 'oracion' },
  { texto: 'Good night, little Captain! God bless you! Amen!', voz: 'oracion' },

  // Champions of Jesus — las pantallas juntan dos frases en una sola locución.
  // Declararlas completas evita que esos momentos de fútbol caigan al TTS del
  // aparato, que es la voz robótica que José estaba oyendo.
  { texto: 'Shoot and score! Kick the ball!', voz: 'coach' },
  { texto: 'We play together with Jesus! Pass to Messi!', voz: 'nino' },
  { texto: 'Dibu saves the ball! Be strong and brave!', voz: 'coach' },
  { texto: 'Great kick, Captain José! Glory to God!', voz: 'coach' },
  { texto: 'One team with Jesus! Great job!', voz: 'oracion' },
  { texto: 'Save! Dibu saves the ball!', voz: 'coach' },
  { texto: 'Be strong and brave! God is our shield! Amen!', voz: 'oracion' },

  // Light the Altar
  { texto: 'Let your light shine! Light the candle!', voz: 'oracion' },
  // Estas líneas viven en el arreglo dinámico de velas, no como llamadas
  // directas a `decir(...)`; por eso el comprobador anterior no las veía y
  // terminaban en la voz robótica del dispositivo.
  { texto: 'Light the candle!', voz: 'coach' },
  { texto: 'Light! Shine bright!', voz: 'nino' },
  { texto: 'Light another candle!', voz: 'coach' },
  { texto: 'Fire! Warm and bright!', voz: 'nino' },
  { texto: 'Light the altar candle!', voz: 'coach' },
]
