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

export type Virtud =
  | 'piedad'
  | 'obediencia'
  | 'dominio'
  | 'fortaleza'
  | 'humildad'
  | 'gratitud'
  | 'reverencia'
  | 'valentia'

export const VIRTUDES: Record<Virtud, string> = {
  piedad: 'Amor a Dios',
  obediencia: 'Obediencia y respeto',
  dominio: 'Dominio propio',
  fortaleza: 'Fortaleza y esfuerzo',
  humildad: 'Humildad',
  gratitud: 'Gratitud y asombro',
  reverencia: 'Reverencia y respeto sagrado',
  valentia: 'Valentía y protección',
}

/**
 * La palabra SOLA, sin marco alrededor.
 *
 * Es la pieza que faltaba y sin la cual el método no cierra. Un niño no puede
 * deducir qué significa "Show me the ball" si nunca oyó "the ball" a secas
 * mientras miraba una pelota. Primero se ancla la etiqueta con la imagen —eso
 * es aprendizaje trans-situacional puro: la palabra que siempre coincide con
 * esa cosa gana— y recién después se le pone un marco encima.
 *
 * `tipo` decide qué marcos le sirven: a una COSA se le puede decir "show me
 * the ball", a una ACCIÓN no ("show me jump" no existe); las acciones van con
 * imperativo desnudo, que es el marco más fácil de todos porque se demuestra
 * con el cuerpo.
 */
export type Etiqueta = {
  en: string
  es: string
  tipo: 'cosa' | 'accion'
}

/**
 * Un MARCO: la parte que no cambia de una frase.
 *
 * "Show me ___", "Where is ___". El niño no lo traduce: lo despeja. Si el
 * mismo marco aparece con cinco sustantivos que ya conoce, lo único que queda
 * sin explicar es el marco, y el significado cae solo. Por eso los marcos
 * suben de a uno, en escalera, y cada uno se DEMUESTRA en pantalla antes de
 * pedírselo por primera vez.
 */
export type Marco = {
  id: string
  /** `{x}` es el hueco donde entra la etiqueta. */
  plantilla: string
  /** `{es}` es el hueco del rescate en español. */
  es: string
  /** Qué hace el dedo en pantalla cuando se demuestra. */
  demo: 'senalar' | 'buscar'
  /** Posición en la escalera: no se sube al siguiente sin dominar el anterior. */
  nivel: number
}

export type Frase = {
  /** Id estable: es la clave del mp3 y la del motor de repaso. No cambiarlo. */
  id: string
  en: string
  /** La palabra sola. Sin esto, la frase no se puede enseñar sin traducir. */
  etiqueta?: Etiqueta
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
