/**
 * La forma del contenido.
 *
 * La decisión de fondo está acá: la unidad mínima es la FRASE (`Frase`), no la
 * palabra. Los niños de esta edad no arman oraciones juntando palabras: se
 * tragan bloques enteros —"Where is the ball?"— y recién después los despiezan
 * (§1.1 de la investigación). Por eso no existe ningún tipo `Palabra`.
 *
 * Y toda frase trae obligatoriamente un gesto: el cuerpo se mueve o no queda
 * nada (§1.4, Total Physical Response).
 */

export type Hilo = 'vida' | 'fe' | 'futbol'

export type Virtud = 'piedad' | 'obediencia' | 'dominio' | 'fortaleza' | 'humildad'

export const VIRTUDES: Record<Virtud, string> = {
  piedad: 'Amor a Dios',
  obediencia: 'Obediencia y respeto',
  dominio: 'Dominio propio',
  fortaleza: 'Fortaleza y esfuerzo',
  humildad: 'Humildad',
}

export type Frase = {
  /** Id estable: es la clave del mp3 y la del motor de repaso. No cambiarlo. */
  id: string
  en: string
  /** El rescate en español. Solo suena si José toca el botón de ayuda. */
  es: string
  /** La orden en inglés que dispara el movimiento en MOVE IT. */
  ordenEn: string
  /** Qué hace con el cuerpo. Va en español porque lo lee papá, no José. */
  gesto: string
  /** Nombre del archivo en public/img (sin extensión). */
  img: string
  /** Lo que se ve mientras la imagen no está generada. */
  emoji: string
  hilo: Hilo
}

export type Opcion = {
  fraseId: string
  correcta: boolean
}

export type Escena = {
  img: string
  emoji: string
  /** Uno a tres renglones. Cortos: se leen en voz alta, no se leen con los ojos. */
  en: string[]
  /**
   * Lo que suena si José toca el botón de ayuda. Es una traducción de la
   * escena, no del renglón: a esta edad lo que se rescata es el sentido de lo
   * que está pasando, no palabra por palabra.
   */
  es: string
  /**
   * La pregunta que hace contingente al cuento: se detiene y espera a JOSÉ.
   * Sin esto sería un video, y de un video no se aprende (§1.2).
   */
  pregunta?: {
    en: string
    opciones: Opcion[]
  }
}

export type Cuento = {
  titulo: string
  escenas: Escena[]
}

export type Cancion = {
  titulo: string
  /** Se canta con la misma melodía de siempre; instala la prosodia (§1.5). */
  versos: string[]
}

export type Unidad = {
  id: string
  numero: number
  /** Para el panel de papás. José nunca ve texto. */
  titulo: string
  hilo: Hilo
  virtud: Virtud
  /** 6 a 8. Más que eso y el sanguíneo se dispersa. */
  frases: Frase[]
  cuento: Cuento
  cancion: Cancion
  /** La misión fuera de la pantalla. Es la que mide si algo se transfirió. */
  mision: { en: string; es: string; emoji: string }
}

export type Oracion = {
  id: string
  titulo: string
  /** 20 segundos como techo. Formato breve, con gesto, sin presión (perfil §1). */
  versos: string[]
  gesto: string
  emoji: string
  img: string
}

/** Un jugador real, con su foto real. Es el gancho, no el contenido. */
export type Cromo = {
  id: string
  nombre: string
  /** Frase en inglés que se enseña con él. Siempre del vocabulario de la unidad. */
  en: string
  es: string
  img: string
  emoji: string
  /** De dónde salió la foto y con qué licencia. Se muestra en el panel de papás. */
  credito: string
}
