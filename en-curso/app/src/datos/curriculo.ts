// La extensión mantiene este archivo comprobable también desde el validador
// Node de `artes/`; Vite la resuelve igual para la app.
import { UNIDADES } from './curso.ts'
import type { Frase, Unidad } from './tipos'
import type { IdMinijuego } from './recorrido'

/**
 * El contrato pedagógico de la aplicación.
 *
 * Una lección no es una pantalla ni un tema decorativo: es una cadena corta
 * y comprobable. Primero se presentan estas frases con una imagen limpia,
 * después aparecen en estas escenas del cuento, se mueven con el cuerpo y,
 * solo cuando el juego puede reutilizarlas, llegan al minijuego. Así no queda
 * ninguna palabra como "candle" aislada en una actividad sin continuación.
 */
export type LeccionCurricular = {
  id: string
  unidadId: string
  /** Máximo dos frases nuevas: cantidad que un niño de cuatro años puede usar. */
  fraseIds: string[]
  /** Escenas del cuento permitidas hoy; nunca se narra el cuento entero de golpe. */
  escenas: number[]
  /** El juego solo entra si emplea vocabulario que ya se presentó. */
  juego?: {
    id: IdMinijuego
    /** Palabras/frases ya conocidas que el niño va a oír y usar durante el juego. */
    repasa: string[]
  }
}

const lecciones: LeccionCurricular[] = [
  // U1 · primero el objeto y la acción que el juego puede mostrar de verdad.
  { id: 'u1-1', unidadId: 'u1', fraseIds: ['u1-ball', 'u1-kick'], escenas: [1, 3] },
  { id: 'u1-2', unidadId: 'u1', fraseIds: ['u1-run', 'u1-jump'], escenas: [0, 2] },
  { id: 'u1-3', unidadId: 'u1', fraseIds: ['u1-stop', 'u1-goal'], escenas: [2, 3], juego: { id: 'champions', repasa: ['u1-ball', 'u1-kick', 'u1-goal'] } },
  { id: 'u1-4', unidadId: 'u1', fraseIds: ['u1-i-can', 'u1-good-game'], escenas: [4, 5] },

  // U2 · el antiguo juego de animales se convierte en rescatar a ESTA oveja.
  { id: 'u2-1', unidadId: 'u2', fraseIds: ['u2-shepherd', 'u2-sheep'], escenas: [0, 1] },
  { id: 'u2-2', unidadId: 'u2', fraseIds: ['u2-my-name', 'u2-come'], escenas: [1] },
  { id: 'u2-3', unidadId: 'u2', fraseIds: ['u2-follow', 'u2-lost'], escenas: [2, 3] },
  { id: 'u2-4', unidadId: 'u2', fraseIds: ['u2-found', 'u2-i-love-you'], escenas: [4, 5], juego: { id: 'noah', repasa: ['u2-sheep', 'u2-follow', 'u2-lost', 'u2-found'] } },

  // U3 · la creación aparece por elementos, no como una lámina llena de cosas.
  { id: 'u3-1', unidadId: 'u3', fraseIds: ['u3-sun', 'u3-stars'], escenas: [0, 1] },
  { id: 'u3-2', unidadId: 'u3', fraseIds: ['u3-water', 'u3-trees'], escenas: [2, 4] },
  { id: 'u3-3', unidadId: 'u3', fraseIds: ['u3-birds', 'u3-beautiful'], escenas: [3, 4] },
  { id: 'u3-4', unidadId: 'u3', fraseIds: ['u3-thank-god', 'u3-all-good'], escenas: [5], juego: { id: 'creation', repasa: ['u3-sun', 'u3-water', 'u3-trees', 'u3-birds', 'u3-beautiful', 'u3-thank-god'] } },

  // U4 · se nombran las personas antes de pedir que las coloque en el pesebre.
  { id: 'u4-1', unidadId: 'u4', fraseIds: ['u4-mary', 'u4-joseph'], escenas: [1, 2] },
  { id: 'u4-2', unidadId: 'u4', fraseIds: ['u4-jesus', 'u4-family'], escenas: [3, 5], juego: { id: 'nativity', repasa: ['u4-mary', 'u4-joseph', 'u4-jesus', 'u4-family'] } },
  { id: 'u4-3', unidadId: 'u4', fraseIds: ['u4-home', 'u4-help'], escenas: [0, 3] },
  { id: 'u4-4', unidadId: 'u4', fraseIds: ['u4-pray', 'u4-bless'], escenas: [4, 5] },

  // U5 · "guide" se practica guiando al ángel; no se cuelan left/right nuevos.
  { id: 'u5-1', unidadId: 'u5', fraseIds: ['u5-angel', 'u5-michael'], escenas: [0, 1] },
  { id: 'u5-2', unidadId: 'u5', fraseIds: ['u5-brave', 'u5-no-fear'], escenas: [2, 3] },
  { id: 'u5-3', unidadId: 'u5', fraseIds: ['u5-light', 'u5-guide'], escenas: [4], juego: { id: 'angel', repasa: ['u5-angel', 'u5-light', 'u5-guide'] } },
  // "Calm the Storm" cierra la unidad: agitar y después quedarse quieto mientras
  // Jesús dice "Peace, be still" — el mismo "no tengas miedo" que ya se enseñó.
  { id: 'u5-4', unidadId: 'u5', fraseIds: ['u5-friend', 'u5-glory-god'], escenas: [5], juego: { id: 'storm', repasa: ['u5-no-fear', 'u5-brave'] } },

  // U6 · candle se enseña sola, se aplica al altar y vuelve a aparecer en el cuento.
  { id: 'u6-1', unidadId: 'u6', fraseIds: ['u6-church', 'u6-candle'], escenas: [0, 4] },
  { id: 'u6-2', unidadId: 'u6', fraseIds: ['u6-altar', 'u6-cross'], escenas: [2, 4], juego: { id: 'altar', repasa: ['u6-candle', 'u6-altar', 'u6-cross'] } },
  { id: 'u6-3', unidadId: 'u6', fraseIds: ['u6-bible', 'u6-bell'], escenas: [0, 3], juego: { id: 'bells', repasa: ['u6-church', 'u6-bell'] } },
  // "Trace the Holy Cross": el dedo sigue el camino de la Señal de la Cruz sobre
  // el cuerpo — la cruz y la iglesia ya se enseñaron antes en la unidad.
  { id: 'u6-4', unidadId: 'u6', fraseIds: ['u6-quiet', 'u6-bread'], escenas: [1, 3], juego: { id: 'trace', repasa: ['u6-cross', 'u6-church'] } },
  // "Loaves and Fishes": repartir el Pan de Vida que se acaba de nombrar,
  // contando de uno a cinco.
  { id: 'u6-5', unidadId: 'u6', fraseIds: ['u6-peace'], escenas: [5], juego: { id: 'loaves', repasa: ['u6-bread'] } },

  // U7 · el juego de rutina solo llega después del saludo que va a reutilizar.
  { id: 'u7-1', unidadId: 'u7', fraseIds: ['u7-good-morning', 'u7-how-are-you'], escenas: [0, 1], juego: { id: 'routine', repasa: ['u7-good-morning'] } },
  { id: 'u7-2', unidadId: 'u7', fraseIds: ['u7-im-happy', 'u7-please'], escenas: [1, 2] },
  { id: 'u7-3', unidadId: 'u7', fraseIds: ['u7-thank-you', 'u7-im-sorry'], escenas: [2, 3, 4] },
  { id: 'u7-4', unidadId: 'u7', fraseIds: ['u7-i-love-you-all', 'u7-good-night'], escenas: [5] },
]

export function leccionesDeUnidad(unidadId: string): LeccionCurricular[] {
  return lecciones.filter((leccion) => leccion.unidadId === unidadId)
}

export function leccionDeHoy(unidadId: string, indice: number): LeccionCurricular {
  const opciones = leccionesDeUnidad(unidadId)
  if (opciones.length) return opciones[Math.min(Math.max(0, indice), opciones.length - 1)]
  // Guardia para no dejar una pantalla vacía si en el futuro se crea una unidad
  // sin mapa. En desarrollo, el verificador curricular convierte esto en error.
  const unidad = UNIDADES.find((item) => item.id === unidadId) ?? UNIDADES[0]
  return { id: `${unidad.id}-fallback`, unidadId: unidad.id, fraseIds: unidad.frases.slice(0, 2).map((f) => f.id), escenas: [0] }
}

export function frasesDeLeccion(unidad: Unidad, leccion: LeccionCurricular): Frase[] {
  const porId = new Map(unidad.frases.map((frase) => [frase.id, frase]))
  return leccion.fraseIds.map((id) => porId.get(id)).filter((frase): frase is Frase => Boolean(frase))
}

/** Vocabulario que ya fue presentado en esta unidad hasta la lección actual.
 * Sirve para que el cuento no convierta en examen una palabra que todavía no
 * se ha visto; sus preguntas pueden reutilizar una palabra de ayer. */
export function frasesConocidasHasta(unidad: Unidad, leccion: LeccionCurricular): Frase[] {
  const deUnidad = leccionesDeUnidad(unidad.id)
  const hasta = Math.max(0, deUnidad.findIndex((item) => item.id === leccion.id))
  const ids = new Set(deUnidad.slice(0, hasta + 1).flatMap((item) => item.fraseIds))
  return unidad.frases.filter((frase) => ids.has(frase.id))
}

/** Cuántas sesiones completas necesita una unidad; U6 tiene cinco porque
 * contiene candle, altar y otros objetos sagrados que no se deben amontonar. */
export function cantidadLecciones(unidadId: string): number {
  return Math.max(1, leccionesDeUnidad(unidadId).length)
}

export const TODAS_LAS_LECCIONES = lecciones
