import type { MinijuegoInfo } from './minijuegos'
import type { MinijuegoExtraId } from './minijuegos-extra'
import type { LeccionCurricular } from './curriculo'

/** La línea horizontal de una sesión. No contiene menús, bifurcaciones ni
 * paradas relleno: el mismo mapa curricular decide qué viene después. */
export type IdMinijuego = MinijuegoInfo['id'] | MinijuegoExtraId

export type Parada =
  | { tipo: 'oracion' }
  | { tipo: 'eco-oracion' }
  | { tipo: 'vocabulario' }
  | { tipo: 'cuento' }
  | { tipo: 'move' }
  | { tipo: 'minijuego'; id: IdMinijuego }
  | { tipo: 'challenge' }
  | { tipo: 'sayit'; momento: 'gancho' | 'leccion' }
  | { tipo: 'takehome' }

export type ItemRecorrido = { modo: 'fijo'; parada: Parada }

/**
 * El orden tiene intención: una frase de fútbol al micrófono para enganchar →
 * oír y señalar → cuento → cuerpo → juego SOLO si reutiliza lo aprendido →
 * una sola frase breve de oración, después de varias actividades → reconocer
 * → volver a decir las frases de la lección → llevarlo a casa.
 *
 * La oración completa sigue en el Rincón Católico, al que entra un adulto. El
 * recorrido diario no empieza con rezo ni lo interrumpe repetidamente: primero
 * hay juego y lenguaje; el momento de oración queda como una pausa corta.
 */
export function generarRecorridoDeHoy(leccion: LeccionCurricular): ItemRecorrido[] {
  const antesDeLaOracion: Parada[] = [
    { tipo: 'sayit', momento: 'gancho' },
    { tipo: 'vocabulario' },
    { tipo: 'cuento' },
    { tipo: 'move' },
  ]
  if (leccion.juego) antesDeLaOracion.push({ tipo: 'minijuego', id: leccion.juego.id })

  return [
    ...antesDeLaOracion.map((parada) => ({ modo: 'fijo' as const, parada })),
    { modo: 'fijo', parada: { tipo: 'eco-oracion' } },
    { modo: 'fijo', parada: { tipo: 'challenge' } },
    { modo: 'fijo', parada: { tipo: 'sayit', momento: 'leccion' } },
    { modo: 'fijo', parada: { tipo: 'takehome' } },
  ]
}
