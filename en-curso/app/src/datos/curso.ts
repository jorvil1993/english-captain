import type { Cancion, Cromo, Cuento, Frase, Oracion, Unidad } from './tipos'

/**
 * EL CONTENIDO EDUCATIVO Y ESPIRITUAL — 7 UNIDADES
 *
 * Tres reglas que cumplen todas las unidades:
 *  1. Frases enteras y útiles, nunca listas de palabras aisladas (§1.1).
 *  2. Unidades católicas basadas en la Catequesis del Buen Pastor y pedagogía Don Bosco.
 *  3. Cada unidad fomenta una virtud concreta y tiene un gesto corporal (TPR).
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
    { img: 'u1-c3', emoji: '🏃', en: ['Run, José! Run!', 'Jump!', 'Stop!'], es: '¡Corre, José, corre! ¡Salta! ¡Para!' },
    {
      img: 'u1-c4', emoji: '🥅', en: ['Kick the ball!', 'GOAL!'], es: '¡Patea la pelota! ¡Gol!',
      pregunta: { en: 'Where is the goal?', opciones: [{ fraseId: 'u1-goal', correcta: true }, { fraseId: 'u1-stop', correcta: false }] },
    },
    { img: 'u1-c5', emoji: '💪', en: ['Play with all your heart!', 'I can do it!'], es: '¡Juega con todo el corazón! ¡Yo puedo!' },
    {
      img: 'u1-c6', emoji: '🤝', en: ['We are good friends.', 'Good game!'], es: 'Somos buenos amigos. ¡Buen partido!',
      pregunta: { en: 'Show me: Good game!', opciones: [{ fraseId: 'u1-good-game', correcta: true }, { fraseId: 'u1-kick', correcta: false }] },
    },
  ],
}

const cancionU1: Cancion = {
  titulo: 'Run and Kick',
  versos: ['Run, run, run!', 'Jump, jump, jump!', 'Kick the ball!', 'Goal, goal, GOAL!', 'Good game, good game!', 'I can do it!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 2 · THE LOST SHEEP · piedad
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
      pregunta: { en: 'Show me the Shepherd!', opciones: [{ fraseId: 'u2-shepherd', correcta: true }, { fraseId: 'u2-sheep', correcta: false }] },
    },
    { img: 'u2-c3', emoji: '🔍', en: ['One sheep is lost.', 'The sheep is alone.'], es: 'Una oveja se perdió. Está solita.' },
    { img: 'u2-c4', emoji: '👣', en: ['The Shepherd goes.', 'He looks and looks and looks.'], es: 'El Pastor sale a buscarla. Busca y busca y busca.' },
    {
      img: 'u2-c5', emoji: '🤗', en: ['He finds the sheep!'], es: '¡La encuentra!',
      pregunta: { en: 'Where is the Good Shepherd?', opciones: [{ fraseId: 'u2-shepherd', correcta: true }, { fraseId: 'u2-lost', correcta: false }] },
    },
    { img: 'u2-c6', emoji: '❤️', en: ['He carries the sheep home.', 'The Shepherd loves his sheep.', 'He knows your name too.'], es: 'La lleva a casa en sus hombros. El Pastor ama a sus ovejas. También sabe tu nombre.' },
  ],
}

const cancionU2: Cancion = {
  titulo: 'Come and Follow',
  versos: ['Come, come, follow me.', 'I know your name.', 'Come, come, follow me.', 'The Good Shepherd loves you.'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 3 · GOD MADE THE WORLD · gratitud y asombro
// ─────────────────────────────────────────────────────────────────────────────

const frasesU3: Frase[] = [
  { id: 'u3-sun', en: 'God made the sun.', es: 'Dios hizo el sol.', ordenEn: 'Look at the sun!', gesto: 'Abre los brazos en círculo arriba.', img: 'u3-sun', emoji: '☀️', hilo: 'fe' },
  { id: 'u3-stars', en: 'Look at the stars!', es: '¡Mira las estrellas!', ordenEn: 'Reach for the stars!', gesto: 'Ponte de puntillas y estira las manos.', img: 'u3-stars', emoji: '✨', hilo: 'fe' },
  { id: 'u3-water', en: 'Thank you for the water.', es: 'Gracias por el agua.', ordenEn: 'Drink the water!', gesto: 'Haz el gesto de beber con dos manos.', img: 'u3-water', emoji: '💧', hilo: 'fe' },
  { id: 'u3-trees', en: 'I see the green trees.', es: 'Veo los árboles verdes.', ordenEn: 'Touch the ground!', gesto: 'Agáchate y toca el suelo.', img: 'u3-trees', emoji: '🌳', hilo: 'fe' },
  { id: 'u3-birds', en: 'The birds sing to God.', es: 'Los pajaritos le cantan a Dios.', ordenEn: 'Fly like a bird!', gesto: 'Mueve los brazos como alas.', img: 'u3-birds', emoji: '🐦', hilo: 'fe' },
  { id: 'u3-beautiful', en: 'The world is beautiful.', es: 'El mundo es hermoso.', ordenEn: 'Say: God is good!', gesto: 'Las dos manos al corazón y sonríe.', img: 'u3-beautiful', emoji: '🌸', hilo: 'fe' },
  { id: 'u3-thank-god', en: 'Thank you, God!', es: '¡Gracias, Dios!', ordenEn: 'Say: thank you, God!', gesto: 'Junta las manos y mira arriba.', img: 'u3-thank-god', emoji: '🙏', hilo: 'fe' },
  { id: 'u3-all-good', en: 'Everything is good.', es: 'Todo es bueno.', ordenEn: 'Thumbs up!', gesto: 'Pulgares arriba con las dos manos.', img: 'u3-all-good', emoji: '👍', hilo: 'fe' },
]

const cuentoU3: Cuento = {
  titulo: 'God Made the World',
  escenas: [
    { img: 'u3-c1', emoji: '☀️', en: ['In the beginning, God made the light.', 'God made the sun!'], es: 'Al principio, Dios hizo la luz. ¡Dios hizo el sol!' },
    {
      img: 'u3-c2', emoji: '✨', en: ['Look up at the night sky.', 'Look at the stars!'], es: 'Mira arriba al cielo de noche. ¡Mira las estrellas!',
      pregunta: { en: 'Show me the stars!', opciones: [{ fraseId: 'u3-stars', correcta: true }, { fraseId: 'u3-trees', correcta: false }] },
    },
    { img: 'u3-c3', emoji: '💧', en: ['God made the blue water and the oceans.'], es: 'Dios hizo el agua azul y los océanos.' },
    {
      img: 'u3-c4', emoji: '🐦', en: ['Listen!', 'The birds sing to God.'], es: '¡Escucha! Los pajaritos le cantan a Dios.',
      pregunta: { en: 'Show me the birds!', opciones: [{ fraseId: 'u3-birds', correcta: true }, { fraseId: 'u3-sun', correcta: false }] },
    },
    { img: 'u3-c5', emoji: '🌳', en: ['I see the green trees and flowers.', 'The world is beautiful.'], es: 'Veo los árboles verdes y flores. El mundo es hermoso.' },
    {
      img: 'u3-c6', emoji: '🙏', en: ['God made it all for us.', 'Everything is good.', 'José says: Thank you, God!'], es: 'Dios hizo todo para nosotros. Todo es bueno. José dice: ¡Gracias, Dios!',
      pregunta: { en: 'Show me: Thank you, God!', opciones: [{ fraseId: 'u3-thank-god', correcta: true }, { fraseId: 'u3-all-good', correcta: false }] },
    },
  ],
}

const cancionU3: Cancion = {
  titulo: 'God Made the Sun',
  versos: ['God made the sun,', 'God made the sea,', 'God made the birds,', 'and God made me!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 4 · THE HOLY FAMILY · amor familiar y piedad
// ─────────────────────────────────────────────────────────────────────────────

const frasesU4: Frase[] = [
  { id: 'u4-jesus', en: 'Jesus is the Son of God.', es: 'Jesús es el Hijo de Dios.', ordenEn: 'Show me Jesus!', gesto: 'Inclina la cabeza con reverencia.', img: 'u4-jesus', emoji: '👶', hilo: 'fe' },
  { id: 'u4-mary', en: 'Mary is the Mother of Jesus.', es: 'María es la Madre de Jesús.', ordenEn: 'Show me Mary!', gesto: 'Manos juntas con dulzura.', img: 'u4-mary', emoji: '🌹', hilo: 'fe' },
  { id: 'u4-joseph', en: 'Saint Joseph is strong.', es: 'San José es fuerte y bueno.', ordenEn: 'Show me Saint Joseph!', gesto: 'Brazos fuertes y sonríe.', img: 'u4-joseph', emoji: '🪵', hilo: 'fe' },
  { id: 'u4-family', en: 'They are the Holy Family.', es: 'Ellos son la Sagrada Familia.', ordenEn: 'Give a big hug!', gesto: 'Abraza fuerte con los dos brazos.', img: 'u4-family', emoji: '👨‍👩‍👦', hilo: 'fe' },
  { id: 'u4-home', en: 'Love in our home.', es: 'Amor en nuestra casa.', ordenEn: 'Say: I love my family!', gesto: 'Dibuja un corazón en el aire.', img: 'u4-home', emoji: '🏠', hilo: 'vida' },
  { id: 'u4-help', en: 'I can help at home.', es: 'Yo puedo ayudar en casa.', ordenEn: 'Help pick up!', gesto: 'Gesto de recoger cosas del suelo.', img: 'u4-help', emoji: '🧹', hilo: 'vida' },
  { id: 'u4-pray', en: 'We pray together.', es: 'Oramos juntos.', ordenEn: 'Pray with me!', gesto: 'Junta las manos en oración.', img: 'u4-pray', emoji: '🙏', hilo: 'fe' },
  { id: 'u4-bless', en: 'God bless our home.', es: 'Dios bendiga nuestro hogar.', ordenEn: 'Say: God bless you!', gesto: 'Abre los brazos dando bendición.', img: 'u4-bless', emoji: '✨', hilo: 'fe' },
]

const cuentoU4: Cuento = {
  titulo: 'The Holy Family in Nazareth',
  escenas: [
    { img: 'u4-c1', emoji: '🏠', en: ['In a small house in Nazareth,', 'there is a holy home.'], es: 'En una casita de Nazaret, hay un santo hogar.' },
    {
      img: 'u4-c2', emoji: '🌹', en: ['Mary loves baby Jesus.', 'She sings sweet songs.'], es: 'María ama al niño Jesús. Le canta dulces canciones.',
      pregunta: { en: 'Show me Mother Mary!', opciones: [{ fraseId: 'u4-mary', correcta: true }, { fraseId: 'u4-joseph', correcta: false }] },
    },
    { img: 'u4-c3', emoji: '🪵', en: ['Saint Joseph works with wood.', 'Saint Joseph is strong and kind.'], es: 'San José trabaja con la madera. San José es fuerte y bondadoso.' },
    {
      img: 'u4-c4', emoji: '👶', en: ['Little Jesus helps Joseph.', 'I can help at home too!'], es: 'El pequeño Jesús ayuda a José. ¡Yo también puedo ayudar en casa!',
      pregunta: { en: 'Show me Baby Jesus!', opciones: [{ fraseId: 'u4-jesus', correcta: true }, { fraseId: 'u4-family', correcta: false }] },
    },
    { img: 'u4-c5', emoji: '🙏', en: ['At night, the Holy Family prays together.'], es: 'De noche, la Sagrada Familia reza junta.' },
    {
      img: 'u4-c6', emoji: '👨‍👩‍👦', en: ['Jesus, Mary and Joseph,', 'God bless our home!'], es: 'Jesús, María y José, ¡Dios bendiga nuestro hogar!',
      pregunta: { en: 'Show me the Holy Family!', opciones: [{ fraseId: 'u4-family', correcta: true }, { fraseId: 'u4-help', correcta: false }] },
    },
  ],
}

const cancionU4: Cancion = {
  titulo: 'Jesus, Mary, Joseph',
  versos: ['Jesus, Mary, Joseph dear,', 'be in my heart and always near.', 'Bless my father, bless my mother,', 'love each other like a brother.'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 5 · HOLY ANGELS & HEROES · valentía y protección
// ─────────────────────────────────────────────────────────────────────────────

const frasesU5: Frase[] = [
  { id: 'u5-angel', en: 'My Guardian Angel is here.', es: 'Mi Ángel de la Guarda está aquí.', ordenEn: 'Show your angel wings!', gesto: 'Abre los brazos grandes como alas.', img: 'u5-angel', emoji: '👼', hilo: 'fe' },
  { id: 'u5-michael', en: 'Saint Michael, protect us!', es: '¡San Miguel, protégenos!', ordenEn: 'Stand like a hero!', gesto: 'Párate firme con el escudo arriba.', img: 'u5-michael', emoji: '🛡️', hilo: 'fe' },
  { id: 'u5-brave', en: 'I am brave with God.', es: 'Soy valiente con Dios.', ordenEn: 'Stand strong!', gesto: 'Pisa fuerte y pon puño firme.', img: 'u5-brave', emoji: '💪', hilo: 'fe' },
  { id: 'u5-no-fear', en: 'Do not be afraid.', es: 'No tengas miedo.', ordenEn: 'Say: I am not afraid!', gesto: 'Mano al frente con seguridad.', img: 'u5-no-fear', emoji: '🦁', hilo: 'fe' },
  { id: 'u5-light', en: 'Shine your light!', es: '¡Brilla tu luz!', ordenEn: 'Turn on the light!', gesto: 'Abre y cierra las manos como estrellitas.', img: 'u5-light', emoji: '🕯️', hilo: 'fe' },
  { id: 'u5-guide', en: 'Guide my steps today.', es: 'Guía mis pasos hoy.', ordenEn: 'March forward!', gesto: 'Marcha en tu sitio como soldado de Dios.', img: 'u5-guide', emoji: '👣', hilo: 'fe' },
  { id: 'u5-friend', en: 'The angel is my friend.', es: 'El ángel es mi amigo.', ordenEn: 'Wave to your angel!', gesto: 'Saluda al aire con la mano.', img: 'u5-friend', emoji: '👋', hilo: 'fe' },
  { id: 'u5-glory-god', en: 'Glory to God!', es: '¡Gloria a Dios!', ordenEn: 'Jump for joy!', gesto: 'Da un salto de alegría con brazos arriba.', img: 'u5-glory-god', emoji: '⭐', hilo: 'fe' },
]

const cuentoU5: Cuento = {
  titulo: 'The Brave Guardian Angel',
  escenas: [
    { img: 'u5-c1', emoji: '👼', en: ['God gives each child an angel.', 'My Guardian Angel is here.'], es: 'Dios le da un ángel a cada niño. Mi Ángel Custodio está aquí.' },
    {
      img: 'u5-c2', emoji: '🛡️', en: ['Saint Michael is a brave warrior of God.', 'He protects us.'], es: 'San Miguel es un guerrero valiente de Dios. Nos protege.',
      pregunta: { en: 'Show me Saint Michael!', opciones: [{ fraseId: 'u5-michael', correcta: true }, { fraseId: 'u5-light', correcta: false }] },
    },
    { img: 'u5-c3', emoji: '🦁', en: ['When the dark comes, José remembers:', 'Do not be afraid.'], es: 'Cuando llega la oscuridad, José recuerda: No tengas miedo.' },
    {
      img: 'u5-c4', emoji: '💪', en: ['With God and my angel,', 'I am brave with God!'], es: 'Con Dios y mi ángel, ¡soy valiente con Dios!',
      pregunta: { en: 'Show me: I am brave!', opciones: [{ fraseId: 'u5-brave', correcta: true }, { fraseId: 'u5-friend', correcta: false }] },
    },
    { img: 'u5-c5', emoji: '👣', en: ['The angel walks beside José every day.', 'Shine your light!', 'Guide my steps today.'], es: 'El ángel camina junto a José todos los días. ¡Brilla tu luz! Guía mis pasos hoy.' },
    {
      img: 'u5-c6', emoji: '⭐', en: ['The angel is my friend.', 'Together we say: Glory to God!'], es: 'El ángel es mi amigo. Juntos decimos: ¡Gloria a Dios!',
      pregunta: { en: 'Show me: Glory to God!', opciones: [{ fraseId: 'u5-glory-god', correcta: true }, { fraseId: 'u5-no-fear', correcta: false }] },
    },
  ],
}

const cancionU5: Cancion = {
  titulo: 'Angel by My Side',
  versos: ['Angel of light, angel of love,', 'sent to me from heaven above.', 'Guard me through the day and night,', 'keep me always in God\'s light.'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 6 · THE HOUSE OF GOD · reverencia y respeto sagrado
// ─────────────────────────────────────────────────────────────────────────────

const frasesU6: Frase[] = [
  { id: 'u6-church', en: 'This is the Church.', es: 'Esta es la Iglesia.', ordenEn: 'Show me the Church!', gesto: 'Junta las puntas de los dedos como tejado.', img: 'u6-church', emoji: '⛪', hilo: 'fe' },
  // Primero se ve UNA vela sin altar, cruz ni decoración. Recién en la
  // lección siguiente se une a "altar" y se usa en el juego de encenderla.
  { id: 'u6-candle', en: 'Here is the candle.', es: 'Aquí está la vela.', ordenEn: 'Show me the candle!', gesto: 'Haz una llamita suave con una mano.', img: 'u6-candle', emoji: '🕯️', hilo: 'fe' },
  { id: 'u6-altar', en: 'Look at the holy altar.', es: 'Mira el santo altar.', ordenEn: 'Look at the altar!', gesto: 'Manos abiertas hacia adelante con respeto.', img: 'u6-altar', emoji: '🕯️', hilo: 'fe' },
  { id: 'u6-cross', en: 'I see the holy cross.', es: 'Veo la santa cruz.', ordenEn: 'Make the Sign of the Cross!', gesto: 'Haz la señal de la cruz.', img: 'u6-cross', emoji: '✝️', hilo: 'fe' },
  { id: 'u6-bible', en: 'The Bible is the Word of God.', es: 'La Biblia es la Palabra de Dios.', ordenEn: 'Open the holy Book!', gesto: 'Abre las palmas juntas como un libro.', img: 'u6-bible', emoji: '📖', hilo: 'fe' },
  { id: 'u6-bell', en: 'The church bell rings: ding-dong!', es: 'La campana suena: ¡ding-dong!', ordenEn: 'Ring the bell!', gesto: 'Gesto de tirar de la campana.', img: 'u6-bell', emoji: '🔔', hilo: 'fe' },
  { id: 'u6-quiet', en: 'Quiet, Jesus is here.', es: 'Silencio, Jesús está aquí.', ordenEn: 'Shh, quiet and listen!', gesto: 'Dedo en los labios y escucha.', img: 'u6-quiet', emoji: '🤫', hilo: 'fe' },
  { id: 'u6-bread', en: 'Jesus gives us the Bread of Life.', es: 'Jesús nos da el Pan de Vida.', ordenEn: 'Receive the gift!', gesto: 'Pon una mano sobre la otra con respeto.', img: 'u6-bread', emoji: '🍞', hilo: 'fe' },
  { id: 'u6-peace', en: 'Peace be with you!', es: '¡La paz esté contigo!', ordenEn: 'Give peace!', gesto: 'Estira la mano para dar la paz sonriendo.', img: 'u6-peace', emoji: '🕊️', hilo: 'fe' },
]

const cuentoU6: Cuento = {
  titulo: 'Visiting Jesus in the Church',
  escenas: [
    { img: 'u6-c1', emoji: '⛪', en: ['The church bells ring: ding-dong!', 'This is the Church, God\'s house.'], es: 'Las campanas suenan: ¡ding-dong! Esta es la Iglesia, la casa de Dios.' },
    {
      img: 'u6-c2', emoji: '🤫', en: ['We walk in gently.', 'Quiet, Jesus is here.'], es: 'Entramos con suavidad. Silencio, Jesús está aquí.',
      pregunta: { en: 'Show me: Quiet, Jesus is here.', opciones: [{ fraseId: 'u6-quiet', correcta: true }, { fraseId: 'u6-bell', correcta: false }] },
    },
    { img: 'u6-c3', emoji: '✝️', en: ['José makes the Sign of the Cross.', 'I see the holy cross.'], es: 'José hace la señal de la cruz. Veo la santa cruz.' },
    {
      img: 'u6-c4', emoji: '📖', en: ['The priest reads the holy book.', 'The Bible is the Word of God.', 'Jesus gives us the Bread of Life.'], es: 'El sacerdote lee el libro sagrado. La Biblia es la Palabra de Dios. Jesús nos da el Pan de Vida.',
      pregunta: { en: 'Show me the Bible!', opciones: [{ fraseId: 'u6-bible', correcta: true }, { fraseId: 'u6-altar', correcta: false }] },
    },
    { img: 'u6-c5', emoji: '🕯️', en: ['Here is the candle on the holy altar.', 'The candle shines.'], es: 'Aquí está la vela sobre el santo altar. La vela brilla.' },
    {
      img: 'u6-c6', emoji: '🕊️', en: ['We turn to our brothers and say:', 'Peace be with you!'], es: 'Nos volvemos hacia nuestros hermanos y decimos: ¡La paz esté contigo!',
      pregunta: { en: 'Show me: Peace be with you!', opciones: [{ fraseId: 'u6-peace', correcta: true }, { fraseId: 'u6-cross', correcta: false }] },
    },
  ],
}

const cancionU6: Cancion = {
  titulo: 'Ding Dong, Hear the Bell',
  versos: ['Ding dong, ding dong, hear the bell!', 'God loves everyone so well.', 'Peace, peace, peace to you,', 'Jesus loves and blesses you!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 7 · A DAY WITH MOM & PAPÁ · cortesía, perdón y amor
// ─────────────────────────────────────────────────────────────────────────────

const frasesU7: Frase[] = [
  { id: 'u7-good-morning', en: 'Good morning!', es: '¡Buenos días!', ordenEn: 'Say: good morning!', gesto: 'Saluda con la mano bien alto.', img: 'u7-good-morning', emoji: '🌅', hilo: 'vida' },
  { id: 'u7-good-night', en: 'Good night!', es: '¡Buenas noches!', ordenEn: 'Say: good night!', gesto: 'Las manos juntas en la mejilla.', img: 'u7-good-night', emoji: '🌙', hilo: 'vida' },
  { id: 'u7-how-are-you', en: 'How are you?', es: '¿Cómo estás?', ordenEn: 'Ask: how are you?', gesto: 'Abre las dos manos.', img: 'u7-how-are-you', emoji: '🙂', hilo: 'vida' },
  { id: 'u7-im-happy', en: 'I am happy!', es: '¡Estoy feliz!', ordenEn: 'Say: I am happy!', gesto: 'Sonríe bien grande.', img: 'u7-im-happy', emoji: '😄', hilo: 'vida' },
  { id: 'u7-please', en: 'Milk, please.', es: 'Leche, por favor.', ordenEn: 'Say: please!', gesto: 'Junta las manos y pide.', img: 'u7-please', emoji: '🥛', hilo: 'vida' },
  { id: 'u7-thank-you', en: 'Thank you!', es: '¡Gracias!', ordenEn: 'Say: thank you!', gesto: 'La mano del pecho hacia adelante.', img: 'u7-thank-you', emoji: '🙏', hilo: 'vida' },
  { id: 'u7-im-sorry', en: 'I am sorry.', es: 'Perdón.', ordenEn: 'Say: I am sorry.', gesto: 'La mano en el corazón, despacio.', img: 'u7-im-sorry', emoji: '💗', hilo: 'vida' },
  { id: 'u7-i-love-you-all', en: 'I love you, mom and dad.', es: 'Los quiero, mamá y papá.', ordenEn: 'Say: I love you!', gesto: 'Un abrazo grande.', img: 'u7-i-love-you-all', emoji: '🤱', hilo: 'vida' },
]

const cuentoU7: Cuento = {
  titulo: 'A Day with Mom and Papá',
  escenas: [
    { img: 'u7-c1', emoji: '🌅', en: ['The sun is up.', 'Good morning, José!'], es: 'Salió el sol. ¡Buenos días, José!' },
    {
      img: 'u7-c2', emoji: '🙂', en: ['Good morning, mom and dad!', 'How are you?', 'I am happy!'], es: '¡Buenos días, mamá y papá! ¿Cómo están? ¡Estoy feliz!',
      pregunta: { en: 'Show me: Good morning!', opciones: [{ fraseId: 'u7-good-morning', correcta: true }, { fraseId: 'u7-good-night', correcta: false }] },
    },
    { img: 'u7-c3', emoji: '🥛', en: ['Breakfast!', 'Milk, please.', 'Thank you!'], es: '¡El desayuno! Leche, por favor. ¡Gracias!' },
    { img: 'u7-c4', emoji: '💧', en: ['Oh no.', 'The milk falls.'], es: 'Ay, no. Se cae la leche.' },
    {
      img: 'u7-c5', emoji: '💗', en: ['José says: I am sorry.'], es: 'José dice: perdón.',
      pregunta: { en: 'Show me: I am sorry.', opciones: [{ fraseId: 'u7-im-sorry', correcta: true }, { fraseId: 'u7-im-happy', correcta: false }] },
    },
    { img: 'u7-c6', emoji: '🤱', en: ['Mom and dad hug José.', 'I love you, mom and dad.', 'Good night!'], es: 'Mamá y papá abrazan a José. Los quiero. ¡Buenas noches!' },
  ],
}

const cancionU7: Cancion = {
  titulo: 'Good Morning to You',
  versos: ['Good morning, good morning,', 'good morning to you!', 'How are you? How are you?', 'I am happy, thank you!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 8 · COLOURS · gratitud y asombro por lo que Dios pintó
// ─────────────────────────────────────────────────────────────────────────────
// El hilo "vida diaria" de la investigación (§"Los tres hilos") pedía colores,
// números, cuerpo y casa, y hasta acá casi no existían. `eco` es la palabra
// sola en voz de niño: la maestra nombra, José repite (método SparkLing, §1.7).

const frasesU8: Frase[] = [
  { id: 'u8-red', en: 'The ball is red.', es: 'La pelota es roja.', ordenEn: 'Show me something red!', gesto: 'Señala algo rojo en la pantalla o en el cuarto.', img: 'v-color-red', emoji: '🔴', hilo: 'vida', eco: 'Red!' },
  { id: 'u8-blue', en: 'The sky is blue.', es: 'El cielo es azul.', ordenEn: 'Show me something blue!', gesto: 'Señala algo azul.', img: 'v-color-blue', emoji: '🔵', hilo: 'vida', eco: 'Blue!' },
  { id: 'u8-yellow', en: 'The sun is yellow.', es: 'El sol es amarillo.', ordenEn: 'Show me something yellow!', gesto: 'Señala algo amarillo.', img: 'v-color-yellow', emoji: '🟡', hilo: 'vida', eco: 'Yellow!' },
  { id: 'u8-green', en: 'The grass is green.', es: 'El pasto es verde.', ordenEn: 'Show me something green!', gesto: 'Señala algo verde.', img: 'v-color-green', emoji: '🟢', hilo: 'vida', eco: 'Green!' },
  { id: 'u8-orange', en: 'The orange is orange.', es: 'La naranja es de color naranja.', ordenEn: 'Show me something orange!', gesto: 'Señala algo naranja.', img: 'v-color-orange', emoji: '🟠', hilo: 'vida', eco: 'Orange!' },
  { id: 'u8-purple', en: 'The flower is purple.', es: 'La flor es morada.', ordenEn: 'Show me something purple!', gesto: 'Señala algo morado.', img: 'v-color-purple', emoji: '🟣', hilo: 'vida', eco: 'Purple!' },
  { id: 'u8-black', en: 'The night is black.', es: 'La noche es negra.', ordenEn: 'Show me something black!', gesto: 'Señala algo negro.', img: 'v-color-black', emoji: '⚫', hilo: 'vida', eco: 'Black!' },
  { id: 'u8-white', en: 'The cloud is white.', es: 'La nube es blanca.', ordenEn: 'Show me something white!', gesto: 'Señala algo blanco.', img: 'v-color-white', emoji: '⚪', hilo: 'vida', eco: 'White!' },
]

const cuentoU8: Cuento = {
  titulo: "God's Colours",
  escenas: [
    { img: 'u8-c1', emoji: '🌈', en: ['José opens the window.', 'God made a world full of colours!'], es: 'José abre la ventana. ¡Dios hizo un mundo lleno de colores!' },
    {
      img: 'u8-c2', emoji: '🔴', en: ['My jersey is red and white.', 'The ball is red.', 'The sky is blue.'], es: 'Mi camiseta es roja y blanca. La pelota es roja. El cielo es azul.',
      pregunta: { en: 'Show me something red!', opciones: [{ fraseId: 'u8-red', correcta: true }, { fraseId: 'u8-blue', correcta: false }] },
    },
    {
      img: 'u8-c3', emoji: '🟢', en: ['The grass is green.', 'The sun is yellow.'], es: 'El pasto es verde. El sol es amarillo.',
      pregunta: { en: 'Show me something green!', opciones: [{ fraseId: 'u8-green', correcta: true }, { fraseId: 'u8-yellow', correcta: false }] },
    },
    {
      img: 'u8-c4', emoji: '🟣', en: ['An orange is orange.', 'A flower is purple.'], es: 'Una naranja es de color naranja. Una flor es morada.',
      pregunta: { en: 'Show me something purple!', opciones: [{ fraseId: 'u8-purple', correcta: true }, { fraseId: 'u8-orange', correcta: false }] },
    },
    { img: 'u8-c5', emoji: '🎨', en: ['So many colours!', 'Red, blue, yellow, green.', 'God is a wonderful painter.'], es: '¡Cuántos colores! Rojo, azul, amarillo, verde. Dios es un pintor maravilloso.' },
    {
      img: 'u8-c6', emoji: '⭐', en: ['Now the sky is black.', 'One white star shines.', 'Thank you, God, for all the colours!'], es: 'Ahora el cielo es negro. Brilla una estrella blanca. ¡Gracias, Dios, por todos los colores!',
      pregunta: { en: 'Show me something white!', opciones: [{ fraseId: 'u8-white', correcta: true }, { fraseId: 'u8-black', correcta: false }] },
    },
  ],
}

const cancionU8: Cancion = {
  titulo: 'Colours Everywhere',
  versos: ['Red and yellow,', 'green and blue,', 'God made colours', 'just for you!', 'Orange, purple,', 'black and white —', 'all the colours', 'shining bright!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 9 · ONE TO TEN · dominio propio (contar despacio y con calma)
// ─────────────────────────────────────────────────────────────────────────────
// La cifra es la tarjeta (José ya lee números); `refuerzoImg` muestra esa
// cantidad en pelotas al acertar, para cerrar el lazo símbolo→cantidad. No es
// un premio (§1.3): es contenido, y solo aparece en los números.

const frasesU9: Frase[] = [
  { id: 'u9-1', en: 'One.', es: 'Uno.', ordenEn: 'Show me one finger!', gesto: 'Muestra un dedo.', img: 'v-num-1', emoji: '1️⃣', hilo: 'vida', eco: 'One!', refuerzoImg: 'v-count-1' },
  { id: 'u9-2', en: 'Two.', es: 'Dos.', ordenEn: 'Show me two fingers!', gesto: 'Muestra dos dedos.', img: 'v-num-2', emoji: '2️⃣', hilo: 'vida', eco: 'Two!', refuerzoImg: 'v-count-2' },
  { id: 'u9-3', en: 'Three.', es: 'Tres.', ordenEn: 'Show me three fingers!', gesto: 'Muestra tres dedos.', img: 'v-num-3', emoji: '3️⃣', hilo: 'vida', eco: 'Three!', refuerzoImg: 'v-count-3' },
  { id: 'u9-4', en: 'Four.', es: 'Cuatro.', ordenEn: 'Show me four fingers!', gesto: 'Muestra cuatro dedos.', img: 'v-num-4', emoji: '4️⃣', hilo: 'vida', eco: 'Four!', refuerzoImg: 'v-count-4' },
  { id: 'u9-5', en: 'Five.', es: 'Cinco.', ordenEn: 'Show me five fingers!', gesto: 'Muestra la mano abierta, cinco dedos.', img: 'v-num-5', emoji: '5️⃣', hilo: 'vida', eco: 'Five!', refuerzoImg: 'v-count-5' },
  { id: 'u9-6', en: 'Six.', es: 'Seis.', ordenEn: 'Show me six fingers!', gesto: 'Cinco dedos de una mano y uno de la otra.', img: 'v-num-6', emoji: '6️⃣', hilo: 'vida', eco: 'Six!', refuerzoImg: 'v-count-6' },
  { id: 'u9-7', en: 'Seven.', es: 'Siete.', ordenEn: 'Show me seven fingers!', gesto: 'Cinco dedos y dos de la otra mano.', img: 'v-num-7', emoji: '7️⃣', hilo: 'vida', eco: 'Seven!', refuerzoImg: 'v-count-7' },
  { id: 'u9-8', en: 'Eight.', es: 'Ocho.', ordenEn: 'Show me eight fingers!', gesto: 'Cinco dedos y tres de la otra mano.', img: 'v-num-8', emoji: '8️⃣', hilo: 'vida', eco: 'Eight!', refuerzoImg: 'v-count-8' },
  { id: 'u9-9', en: 'Nine.', es: 'Nueve.', ordenEn: 'Show me nine fingers!', gesto: 'Cinco dedos y cuatro de la otra mano.', img: 'v-num-9', emoji: '9️⃣', hilo: 'vida', eco: 'Nine!', refuerzoImg: 'v-count-9' },
  { id: 'u9-10', en: 'Ten.', es: 'Diez.', ordenEn: 'Show me ten fingers!', gesto: 'Muestra las dos manos abiertas, diez dedos.', img: 'v-num-10', emoji: '🔟', hilo: 'vida', eco: 'Ten!', refuerzoImg: 'v-count-10' },
]

const cuentoU9: Cuento = {
  titulo: 'Counting the Team',
  escenas: [
    { img: 'u9-c1', emoji: '⚽', en: ['One ball on the green grass.', 'Time to play!'], es: 'Una pelota en el pasto verde. ¡Hora de jugar!' },
    {
      img: 'u9-c2', emoji: '🧒', en: ['One, two, three friends run to play.', 'Three friends!'], es: 'Uno, dos, tres amigos vienen corriendo a jugar. ¡Tres amigos!',
      pregunta: { en: 'Show me three!', opciones: [{ fraseId: 'u9-3', correcta: true }, { fraseId: 'u9-1', correcta: false }] },
    },
    { img: 'u9-c3', emoji: '👥', en: ['Four, five, six!', 'Six players on the field.'], es: '¡Cuatro, cinco, seis! Seis jugadores en la cancha.' },
    {
      img: 'u9-c4', emoji: '🎒', en: ['Seven, eight balls in the big bag.'], es: 'Siete, ocho pelotas en la bolsa grande.',
      pregunta: { en: 'Show me eight!', opciones: [{ fraseId: 'u9-8', correcta: true }, { fraseId: 'u9-5', correcta: false }] },
    },
    {
      img: 'u9-c5', emoji: '🙌', en: ['Nine, ten!', 'Ten friends, all here!'], es: '¡Nueve, diez! ¡Diez amigos, todos aquí!',
      pregunta: { en: 'Show me ten!', opciones: [{ fraseId: 'u9-10', correcta: true }, { fraseId: 'u9-9', correcta: false }] },
    },
    { img: 'u9-c6', emoji: '⚽', en: ['We are ten.', 'Thank you, God, for my friends.', 'Now — kick the ball!'], es: 'Somos diez. Gracias, Dios, por mis amigos. Y ahora, ¡patea la pelota!' },
  ],
}

const cancionU9: Cancion = {
  titulo: 'Count with Me',
  versos: ['One, two, three,', 'four, five, six,', 'seven, eight,', 'nine and ten!', 'God gave me friends', 'to play again!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 10 · MY BODY · gratitud (el cuerpo es un regalo) y TPR puro
// ─────────────────────────────────────────────────────────────────────────────
// `ordenEn` es una orden de cuerpo de verdad: se enseña haciéndola, no
// señalándola (§1.4, Total Physical Response — su canal más fuerte).

const frasesU10: Frase[] = [
  { id: 'u10-head', en: 'This is my head.', es: 'Esta es mi cabeza.', ordenEn: 'Touch your head!', gesto: 'Tócate la cabeza con las dos manos.', img: 'v-body-head', emoji: '🧑', hilo: 'vida', eco: 'Head!' },
  { id: 'u10-hair', en: 'This is my hair.', es: 'Este es mi pelo.', ordenEn: 'Touch your hair!', gesto: 'Pásate la mano por el pelo.', img: 'v-body-hair', emoji: '💇', hilo: 'vida', eco: 'Hair!' },
  { id: 'u10-eyes', en: 'These are my eyes.', es: 'Estos son mis ojos.', ordenEn: 'Close your eyes!', gesto: 'Cierra los ojos y vuelve a abrirlos.', img: 'v-body-eyes', emoji: '👀', hilo: 'vida', eco: 'Eyes!' },
  { id: 'u10-ears', en: 'These are my ears.', es: 'Estas son mis orejas.', ordenEn: 'Cover your ears!', gesto: 'Tápate las dos orejas con las manos.', img: 'v-body-ears', emoji: '👂', hilo: 'vida', eco: 'Ears!' },
  { id: 'u10-hand', en: 'These are my hands.', es: 'Estas son mis manos.', ordenEn: 'Clap your hands!', gesto: 'Aplaude tres veces.', img: 'v-body-hand', emoji: '✋', hilo: 'vida', eco: 'Hands!' },
  { id: 'u10-foot', en: 'This is my foot.', es: 'Este es mi pie.', ordenEn: 'Stamp your foot!', gesto: 'Da un pisotón fuerte en el suelo.', img: 'v-body-foot', emoji: '🦶', hilo: 'vida', eco: 'Foot!' },
  { id: 'u10-nose', en: 'This is my nose.', es: 'Esta es mi nariz.', ordenEn: 'Touch your nose!', gesto: 'Tócate la punta de la nariz.', img: 'v-body-nose', emoji: '👃', hilo: 'vida', eco: 'Nose!' },
  { id: 'u10-mouth', en: 'This is my mouth.', es: 'Esta es mi boca.', ordenEn: 'Open your mouth!', gesto: 'Abre grande la boca y vuelve a cerrarla.', img: 'v-body-mouth', emoji: '👄', hilo: 'vida', eco: 'Mouth!' },
]

const cuentoU10: Cuento = {
  titulo: 'Good Morning, Body!',
  escenas: [
    { img: 'u10-c1', emoji: '🌅', en: ['Good morning!', 'José wakes up his body.'], es: '¡Buenos días! José despierta a su cuerpo.' },
    {
      img: 'u10-c2', emoji: '🧑', en: ['I touch my head.', 'I touch my hair.'], es: 'Me toco la cabeza. Me toco el pelo.',
      pregunta: { en: 'Show me the head!', opciones: [{ fraseId: 'u10-head', correcta: true }, { fraseId: 'u10-hair', correcta: false }] },
    },
    {
      img: 'u10-c3', emoji: '👀', en: ['I open my eyes. I can see!', 'I cover my ears. Now I hear!'], es: 'Abro los ojos. ¡Puedo ver! Me tapo las orejas. ¡Ahora escucho!',
      pregunta: { en: 'Show me the eyes!', opciones: [{ fraseId: 'u10-eyes', correcta: true }, { fraseId: 'u10-ears', correcta: false }] },
    },
    { img: 'u10-c4', emoji: '👏', en: ['I clap my hands.', 'I stamp my foot!'], es: 'Aplaudo con las manos. ¡Doy un pisotón con el pie!' },
    {
      img: 'u10-c5', emoji: '👃', en: ['I touch my nose.', 'I open my mouth. Aaah!'], es: 'Me toco la nariz. Abro la boca. ¡Aaah!',
      pregunta: { en: 'Show me the nose!', opciones: [{ fraseId: 'u10-nose', correcta: true }, { fraseId: 'u10-mouth', correcta: false }] },
    },
    { img: 'u10-c6', emoji: '🙏', en: ['Thank you, God, for my body!', 'Head, hands and feet — ready for the day!'], es: '¡Gracias, Dios, por mi cuerpo! Cabeza, manos y pies: ¡listo para el día!' },
  ],
}

const cancionU10: Cancion = {
  titulo: 'Head, Hands and Feet',
  versos: ['Head and hands,', 'feet and nose,', 'this is how', 'my body goes!', 'Eyes to see,', 'ears to hear —', 'thank you, God,', 'you made me dear!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIDAD 11 · A DAY AT HOME · obediencia (la rutina, ayudar en casa)
// ─────────────────────────────────────────────────────────────────────────────
// 12 frases (ropa, comida, casa) en 6 lecciones de dos: un día entero tiene
// más de ocho cosas, pero la exposición diaria sigue siendo dos frases nuevas,
// que es lo que pide la evidencia.

const frasesU11: Frase[] = [
  { id: 'u11-bed', en: 'Here is my bed.', es: 'Aquí está mi cama.', ordenEn: 'Show me the bed!', gesto: 'Junta las manos contra la mejilla como durmiendo.', img: 'v-home-bed', emoji: '🛏️', hilo: 'vida', eco: 'Bed!' },
  { id: 'u11-window', en: 'Here is the window.', es: 'Aquí está la ventana.', ordenEn: 'Open the window!', gesto: 'Haz el gesto de abrir una ventana hacia los lados.', img: 'v-home-window', emoji: '🪟', hilo: 'vida', eco: 'Window!' },
  { id: 'u11-shirt', en: 'This is my shirt.', es: 'Esta es mi camiseta.', ordenEn: 'Put on your shirt!', gesto: 'Haz el gesto de ponerte una camiseta por la cabeza.', img: 'v-wear-shirt', emoji: '👕', hilo: 'vida', eco: 'Shirt!' },
  { id: 'u11-shoes', en: 'These are my shoes.', es: 'Estos son mis zapatos.', ordenEn: 'Put on your shoes!', gesto: 'Da golpecitos con los pies como calzándote.', img: 'v-wear-shoes', emoji: '👟', hilo: 'vida', eco: 'Shoes!' },
  { id: 'u11-jacket', en: 'This is my jacket.', es: 'Esta es mi chaqueta.', ordenEn: 'Put on your jacket!', gesto: 'Haz el gesto de meter los brazos en una chaqueta.', img: 'v-wear-jacket', emoji: '🧥', hilo: 'vida', eco: 'Jacket!' },
  { id: 'u11-hat', en: 'This is my hat.', es: 'Este es mi sombrero.', ordenEn: 'Put on your hat!', gesto: 'Ponte un sombrero imaginario en la cabeza.', img: 'v-wear-hat', emoji: '🧢', hilo: 'vida', eco: 'Hat!' },
  { id: 'u11-apple', en: 'This is an apple.', es: 'Esto es una manzana.', ordenEn: 'Eat the apple!', gesto: 'Haz como que muerdes una manzana.', img: 'v-food-apple', emoji: '🍎', hilo: 'vida', eco: 'Apple!' },
  { id: 'u11-banana', en: 'This is a banana.', es: 'Esto es un plátano.', ordenEn: 'Eat the banana!', gesto: 'Haz como que pelas un plátano y lo comes.', img: 'v-food-banana', emoji: '🍌', hilo: 'vida', eco: 'Banana!' },
  { id: 'u11-egg', en: 'This is an egg.', es: 'Esto es un huevo.', ordenEn: 'Show me the egg!', gesto: 'Forma un huevo redondo con las dos manos.', img: 'v-food-egg', emoji: '🥚', hilo: 'vida', eco: 'Egg!' },
  { id: 'u11-rice', en: 'This is rice.', es: 'Esto es arroz.', ordenEn: 'Eat the rice!', gesto: 'Haz como que comes arroz con una cuchara.', img: 'v-food-rice', emoji: '🍚', hilo: 'vida', eco: 'Rice!' },
  { id: 'u11-chair', en: 'Here is the chair.', es: 'Aquí está la silla.', ordenEn: 'Sit on the chair!', gesto: 'Siéntate y vuelve a pararte.', img: 'v-home-chair', emoji: '🪑', hilo: 'vida', eco: 'Chair!' },
  { id: 'u11-door', en: 'Here is the door.', es: 'Aquí está la puerta.', ordenEn: 'Open the door!', gesto: 'Haz el gesto de girar un picaporte y abrir la puerta.', img: 'v-home-door', emoji: '🚪', hilo: 'vida', eco: 'Door!' },
]

const cuentoU11: Cuento = {
  titulo: 'A Day at Home',
  escenas: [
    { img: 'u11-c1', emoji: '🌅', en: ['Good morning!', 'I get up from my bed.', 'I open the window. Hello, sun!'], es: '¡Buenos días! Me levanto de la cama. Abro la ventana. ¡Hola, sol!' },
    {
      img: 'u11-c2', emoji: '👕', en: ['I put on my shirt.', 'I put on my shoes.'], es: 'Me pongo la camiseta. Me pongo los zapatos.',
      pregunta: { en: 'Show me the shoes!', opciones: [{ fraseId: 'u11-shoes', correcta: true }, { fraseId: 'u11-shirt', correcta: false }] },
    },
    {
      img: 'u11-c3', emoji: '🍎', en: ['Breakfast time!', 'I sit on the chair.', 'An apple and a banana.'], es: '¡Hora del desayuno! Me siento en la silla. Una manzana y un plátano.',
      pregunta: { en: 'Show me the apple!', opciones: [{ fraseId: 'u11-apple', correcta: true }, { fraseId: 'u11-banana', correcta: false }] },
    },
    { img: 'u11-c4', emoji: '🍚', en: ['An egg and some rice too.', 'Yummy! Thank you, Mum!'], es: 'También un huevo y un poco de arroz. ¡Rico! ¡Gracias, mamá!' },
    { img: 'u11-c5', emoji: '🧥', en: ['Time to go out.', 'I put on my jacket and my hat.', 'I open the door.'], es: 'Hora de salir. Me pongo la chaqueta y el sombrero. Abro la puerta.' },
    {
      img: 'u11-c6', emoji: '🌙', en: ['Home again.', 'Good night!', 'I go to my bed.'], es: 'De vuelta en casa. ¡Buenas noches! Me voy a mi cama.',
      pregunta: { en: 'Show me the bed!', opciones: [{ fraseId: 'u11-bed', correcta: true }, { fraseId: 'u11-chair', correcta: false }] },
    },
  ],
}

const cancionU11: Cancion = {
  titulo: 'This Is the Way',
  versos: ['This is the way', 'I put on my shirt,', 'put on my shoes,', 'and open the door.', 'This is the way', 'I eat my food,', 'and go to my bed', 'to sleep once more!'],
}

// ─────────────────────────────────────────────────────────────────────────────
// TODAS LAS UNIDADES
// ─────────────────────────────────────────────────────────────────────────────

export const UNIDADES: Unidad[] = [
  {
    id: 'u1', numero: 1, titulo: 'The Big Game — perder bien y fortaleza', hilo: 'futbol', virtud: 'fortaleza',
    frases: frasesU1, cuento: cuentoU1, cancion: cancionU1,
    mision: { en: "Say 'good game' to papá.", es: "Dile 'good game' a papá cuando termine un partido.", emoji: '🤝' },
  },
  {
    id: 'u2', numero: 2, titulo: 'The Lost Sheep — el Buen Pastor', hilo: 'fe', virtud: 'piedad',
    frases: frasesU2, cuento: cuentoU2, cancion: cancionU2,
    mision: { en: "Say 'thank you, God' at dinner.", es: "Di 'thank you, God' en la cena, en voz alta.", emoji: '🙏' },
  },
  {
    id: 'u3', numero: 3, titulo: 'God Made the World — La Creación', hilo: 'fe', virtud: 'gratitud',
    frases: frasesU3, cuento: cuentoU3, cancion: cancionU3,
    mision: { en: "Look at the sky and say 'Thank you, God'.", es: "Mira el cielo con papá y di 'Thank you, God'.", emoji: '☀️' },
  },
  {
    id: 'u4', numero: 4, titulo: 'The Holy Family — Jesús, María y José', hilo: 'fe', virtud: 'piedad',
    frases: frasesU4, cuento: cuentoU4, cancion: cancionU4,
    mision: { en: "Say 'God bless you' to mamá or papá.", es: "Dile 'God bless you' a papá o a mamá.", emoji: '👨‍👩‍👦' },
  },
  {
    id: 'u5', numero: 5, titulo: 'Holy Angels & Heroes — San Miguel y los Ángeles', hilo: 'fe', virtud: 'valentia',
    frases: frasesU5, cuento: cuentoU5, cancion: cancionU5,
    mision: { en: "Pray the Guardian Angel prayer before bed.", es: "Reza la oración del Ángel de la Guarda antes de dormir.", emoji: '👼' },
  },
  {
    id: 'u6', numero: 6, titulo: 'The House of God — La Iglesia y la Misa', hilo: 'fe', virtud: 'reverencia',
    frases: frasesU6, cuento: cuentoU6, cancion: cancionU6,
    mision: { en: "Say 'Peace be with you' with a smile.", es: "Dile 'Peace be with you' a alguien con una sonrisa.", emoji: '🕊️' },
  },
  {
    id: 'u7', numero: 7, titulo: 'A Day with Mom & Dad — Cortesía y perdón', hilo: 'vida', virtud: 'obediencia',
    frases: frasesU7, cuento: cuentoU7, cancion: cancionU7,
    mision: { en: "Say 'good morning' with a big smile.", es: "Mañana saluda con 'good morning' y una sonrisa.", emoji: '🌅' },
  },
  {
    id: 'u8', numero: 8, titulo: 'Colours — los colores que Dios pintó', hilo: 'vida', virtud: 'gratitud',
    frases: frasesU8, cuento: cuentoU8, cancion: cancionU8,
    mision: { en: "Find something blue in your room and say 'blue' to Mum or Dad.", es: "Busca algo azul en tu cuarto y dile 'blue' a mamá o a papá.", emoji: '🔵' },
  },
  {
    id: 'u9', numero: 9, titulo: 'One to Ten — contar del uno al diez', hilo: 'vida', virtud: 'dominio',
    frases: frasesU9, cuento: cuentoU9, cancion: cancionU9,
    mision: { en: 'Count to ten out loud with Dad, in English.', es: 'Cuenta hasta diez en voz alta con papá, en inglés.', emoji: '🔟' },
  },
  {
    id: 'u10', numero: 10, titulo: 'My Body — las partes del cuerpo', hilo: 'vida', virtud: 'gratitud',
    frases: frasesU10, cuento: cuentoU10, cancion: cancionU10,
    mision: { en: "Play 'Simon says: touch your nose' with Mum.", es: "Juega a 'Simón dice: tócate la nariz' con mamá.", emoji: '👆' },
  },
  {
    id: 'u11', numero: 11, titulo: 'A Day at Home — la rutina de la casa', hilo: 'vida', virtud: 'obediencia',
    frases: frasesU11, cuento: cuentoU11, cancion: cancionU11,
    mision: { en: 'Get dressed by yourself and say each thing in English.', es: 'Vístete solo y di cada prenda en inglés.', emoji: '👕' },
  },
]

/**
 * Las oraciones católicas tradicionales.
 */
export const ORACIONES: Oracion[] = [
  { id: 'o-cross', titulo: 'Sign of the Cross', versos: ['In the name of the Father,', 'and of the Son,', 'and of the Holy Spirit.', 'Amen.'], gesto: 'Haz la señal de la cruz.', emoji: '✝️', img: 'o-cross' },
  { id: 'o-angel', titulo: 'Guardian Angel', versos: ['Angel of God,', 'my guardian dear,', 'to whom God\'s love', 'commits me here.', 'Ever this day be at my side,', 'to light and guard,', 'to rule and guide.', 'Amen.'], gesto: 'Las manos juntas con devoción.', emoji: '👼', img: 'o-angel' },
  { id: 'o-grace', titulo: 'Grace before meals', versos: ['Bless us, O Lord,', 'and these your gifts,', 'which we are about to receive', 'from your bounty.', 'Through Christ our Lord.', 'Amen.'], gesto: 'Las manos juntas sobre la mesa.', emoji: '🍞', img: 'o-grace' },
  { id: 'o-hail-mary', titulo: 'Hail Mary', versos: ['Hail Mary, full of grace,', 'the Lord is with thee.', 'Blessed art thou among women,', 'and blessed is the fruit of thy womb, Jesus.', 'Holy Mary, Mother of God,', 'pray for us sinners,', 'now and at the hour of our death.', 'Amen.'], gesto: 'Las manos juntas, mirando arriba.', emoji: '🌹', img: 'o-hail-mary' },
  { id: 'o-glory', titulo: 'Glory Be', versos: ['Glory be to the Father,', 'and to the Son,', 'and to the Holy Spirit.', 'As it was in the beginning,', 'is now, and ever shall be,', 'world without end.', 'Amen.'], gesto: 'Inclinación suave de cabeza.', emoji: '⭐', img: 'o-glory' },
  { id: 'o-michael', titulo: 'Saint Michael the Archangel', versos: ['Saint Michael the Archangel,', 'defend us in battle.', 'Be our protection.', 'May God rebuke him, we humbly pray.', 'Amen.'], gesto: 'Párate firme con la mano en el pecho.', emoji: '🛡️', img: 'o-michael' },
  { id: 'o-trust', titulo: 'Jesus, I Trust in You', versos: ['Jesus, I love You.', 'Jesus, I trust in You.', 'Jesus, make my heart like yours.', 'Amen.'], gesto: 'Las dos manos en el corazón.', emoji: '❤️', img: 'o-trust' },
]

/**
 * Los cromos de inspiración.
 */
export const CROMOS: Cromo[] = [
  { id: 'c-messi', nombre: 'Messi', en: 'Messi kicks the ball!', es: '¡Messi patea la pelota!', img: 'c-messi', emoji: '🐐', credito: 'Wikimedia Commons' },
  { id: 'c-mbappe', nombre: 'Mbappé', en: 'Mbappé runs fast!', es: '¡Mbappé corre rápido!', img: 'c-mbappe', emoji: '⚡', credito: 'Wikimedia Commons' },
  { id: 'c-modric', nombre: 'Luka Modrić', en: 'Luka Modrić scores a goal!', es: '¡Luka Modrić marca un gol!', img: 'c-modric', emoji: '✨', credito: 'Wikimedia Commons' },
]

/** Índice plano de todas las frases para el motor de repaso y búsqueda. */
export const TODAS_LAS_FRASES: Frase[] = UNIDADES.flatMap((u) => u.frases)

export function fraseDe(id: string): Frase {
  const f = TODAS_LAS_FRASES.find((x) => x.id === id)
  if (!f) throw new Error(`Frase desconocida: ${id}`)
  return f
}
