import { LISTA_MINIJUEGOS, type MinijuegoInfo } from './minijuegos'
import { LISTA_MINIJUEGOS_EXTRA, type MinijuegoExtraId } from './minijuegos-extra'

/**
 * La línea horizontal de hoy. José entra y avanza parada por parada, sin
 * poder salir ni saltarse ninguna — la única elección que conserva es el
 * ORDEN de las 3 paradas del bloque "elegible" (ver `Parada`/`ItemRecorrido`).
 *
 * El recorrido usa todo el contenido construido: rota el bloque de variedad
 * (cuento de unidad / historia bíblica / canción / objeto sagrado / tablero
 * de vocabulario / oraciones cortas) y el minijuego del día por un único
 * contador de días (`diaRecorridoIndice`), el mismo patrón ya validado por
 * `unidadIndice` en `estado/Sesion.tsx`.
 */

export type TipoVariedad = 'story' | 'bible' | 'sing' | 'holy' | 'tablero' | 'peques'
export type IdMinijuego = MinijuegoInfo['id'] | MinijuegoExtraId

export type Parada =
  | { tipo: 'oracion' }
  | { tipo: 'variedad'; variante: TipoVariedad }
  | { tipo: 'move' }
  | { tipo: 'minijuego'; id: IdMinijuego }
  | { tipo: 'challenge' }
  | { tipo: 'sayit' }
  | { tipo: 'takehome' }
  | { tipo: 'stop' }

export type ItemRecorrido =
  | { modo: 'fijo'; parada: Parada }
  | { modo: 'elegible'; paradas: Parada[] } // José elige el ORDEN, ninguna se salta

const POOL_VARIEDAD: TipoVariedad[] = ['story', 'bible', 'sing', 'holy', 'tablero', 'peques']
const POOL_MINIJUEGOS: IdMinijuego[] = [
  'champions', 'altar', 'noah', 'nativity', 'creation', 'routine',
  'trace', 'loaves', 'angel', 'storm', 'bells',
]

export function generarRecorridoDeHoy(params: { diaRecorridoIndice: number }): ItemRecorrido[] {
  const variante = POOL_VARIEDAD[params.diaRecorridoIndice % POOL_VARIEDAD.length]
  const idMinijuego = POOL_MINIJUEGOS[params.diaRecorridoIndice % POOL_MINIJUEGOS.length]

  return [
    { modo: 'fijo', parada: { tipo: 'oracion' } },
    {
      modo: 'elegible',
      paradas: [
        { tipo: 'variedad', variante },
        { tipo: 'move' },
        { tipo: 'minijuego', id: idMinijuego },
      ],
    },
    { modo: 'fijo', parada: { tipo: 'challenge' } },
    { modo: 'fijo', parada: { tipo: 'sayit' } },
    { modo: 'fijo', parada: { tipo: 'takehome' } },
    { modo: 'fijo', parada: { tipo: 'stop' } },
  ]
}

/** Cómo se ve cada parada en la elección chica de `Plan.tsx` — imagen, emoji
 *  y nombre en inglés. Reusa las imágenes que ya existen para cada tema. */
const NOMBRE_VARIEDAD: Record<TipoVariedad, { img: string; emoji: string; en: string }> = {
  story: { img: 'plan-story', emoji: '📖', en: 'The story' },
  bible: { img: 'noah-ark', emoji: '📚', en: 'Bible Friends' },
  sing: { img: 'u5-light', emoji: '🎵', en: 'Sing & Praise' },
  holy: { img: 'u6-church', emoji: '⛪', en: 'Holy Things' },
  tablero: { img: 'u2-shepherd', emoji: '🧩', en: 'Word Board' },
  peques: { img: 'u5-angel', emoji: '🙏', en: 'My Little Prayers' },
}

export function etiquetaDeParada(p: Parada): { img: string; emoji: string; en: string } {
  switch (p.tipo) {
    case 'variedad':
      return NOMBRE_VARIEDAD[p.variante]
    case 'move':
      return { img: 'plan-move', emoji: '🏃', en: 'Move it' }
    case 'minijuego': {
      const m =
        LISTA_MINIJUEGOS.find((x) => x.id === p.id) ??
        LISTA_MINIJUEGOS_EXTRA.find((x) => x.id === p.id)
      return m ? { img: m.img, emoji: m.emoji, en: m.titulo } : { img: 'plan-challenge', emoji: '🎮', en: 'Play' }
    }
    default:
      return { img: 'plan-challenge', emoji: '🏆', en: 'Next' }
  }
}
