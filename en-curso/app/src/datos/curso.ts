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
    { img: 'u1-c3', emoji: '🏃', en: ['Run, José! Run!', 'Jump!'], es: '¡Corre, José, corre! ¡Salta!' },
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
      img: 'u3-c6', emoji: '🙏', en: ['God made it all for us.', 'José says: Thank you, God!'], es: 'Dios hizo todo para nosotros. José dice: ¡Gracias, Dios!',
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
  { id: 'u4-jesus', en: 'Jesus is the Son of God.', es: 'Jesús es el Hijo de Dios.', ordenEn: 'Bow to Jesus!', gesto: 'Inclina la cabeza con reverencia.', img: 'u4-jesus', emoji: '👶', hilo: 'fe' },
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
    { img: 'u5-c5', emoji: '👣', en: ['The angel walks beside José every day.', 'Guide my steps today.'], es: 'El ángel camina junto a José todos los días. Guía mis pasos hoy.' },
    {
      img: 'u5-c6', emoji: '⭐', en: ['Together we say:', 'Glory to God!'], es: 'Juntos decimos: ¡Gloria a Dios!',
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
      img: 'u6-c4', emoji: '📖', en: ['The priest reads the holy book.', 'The Bible is the Word of God.'], es: 'El sacerdote lee el libro sagrado. La Biblia es la Palabra de Dios.',
      pregunta: { en: 'Show me the Bible!', opciones: [{ fraseId: 'u6-bible', correcta: true }, { fraseId: 'u6-altar', correcta: false }] },
    },
    { img: 'u6-c5', emoji: '🕯️', en: ['We look at the holy altar with reverence.'], es: 'Miramos el santo altar con reverencia.' },
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
      img: 'u7-c2', emoji: '🙂', en: ['Good morning, mom and dad!', 'How are you?'], es: '¡Buenos días, mamá y papá! ¿Cómo están?',
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
  { id: 'c-yamal', nombre: 'Lamine Yamal', en: 'Lamine Yamal scores a goal!', es: '¡Lamine Yamal mete un gol!', img: 'c-yamal', emoji: '✨', credito: 'Wikimedia Commons' },
]

/** Índice plano de todas las frases para el motor de repaso y búsqueda. */
export const TODAS_LAS_FRASES: Frase[] = UNIDADES.flatMap((u) => u.frases)

export function fraseDe(id: string): Frase {
  const f = TODAS_LAS_FRASES.find((x) => x.id === id)
  if (!f) throw new Error(`Frase desconocida: ${id}`)
  return f
}
