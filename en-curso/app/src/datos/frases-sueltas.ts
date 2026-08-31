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
  // Bienvenida — el botón que abre los mini juegos.
  { texto: 'Catholic Minigames', voz: 'maestra' },

  // Holy Things & Church
  { texto: 'Great job, Captain! God bless you!', voz: 'maestra' },

  // My Little Prayers
  { texto: 'Bless you, Captain!', voz: 'oracion' },

  // Sing & Praise
  { texto: 'Learn the words!', voz: 'maestra' },

  // Creation Tap & Bloom
  { texto: 'God made the world! Tap to create!', voz: 'maestra' },
  { texto: 'God saw that it was good! Amen!', voz: 'oracion' },

  // Morning & Night Blessings
  { texto: 'Good morning, God! Open the window!', voz: 'oracion' },
  { texto: 'Sun! Good morning, world! Thank you, Jesus!', voz: 'nino' },
  { texto: 'Bless my day! Amen!', voz: 'oracion' },
  { texto: 'Good night, Jesus! Look at the stars!', voz: 'oracion' },
  { texto: 'Angel of God, protect me through the night!', voz: 'oracion' },
  { texto: 'Good night, little Captain! God bless you! Amen!', voz: 'oracion' },
]
