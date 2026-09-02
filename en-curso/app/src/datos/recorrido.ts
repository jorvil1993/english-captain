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
  | { tipo: 'sayit' }
  | { tipo: 'takehome' }

export type ItemRecorrido = { modo: 'fijo'; parada: Parada }

/**
 * El orden tiene intención: oír y señalar → pequeño fragmento de Ave María →
 * cuento que usa esas palabras → cuerpo → juego SOLO si las reutiliza →
 * recordar → reconocer → decir → llevarlo a casa.
 */
export function generarRecorridoDeHoy(leccion: LeccionCurricular): ItemRecorrido[] {
  const antesDelRepaso: Parada[] = [
    { tipo: 'oracion' },
    { tipo: 'vocabulario' },
    { tipo: 'eco-oracion' },
    { tipo: 'cuento' },
    { tipo: 'move' },
  ]
  if (leccion.juego) antesDelRepaso.push({ tipo: 'minijuego', id: leccion.juego.id })

  return [
    ...antesDelRepaso.map((parada) => ({ modo: 'fijo' as const, parada })),
    { modo: 'fijo', parada: { tipo: 'eco-oracion' } },
    { modo: 'fijo', parada: { tipo: 'challenge' } },
    { modo: 'fijo', parada: { tipo: 'sayit' } },
    { modo: 'fijo', parada: { tipo: 'takehome' } },
  ]
}
