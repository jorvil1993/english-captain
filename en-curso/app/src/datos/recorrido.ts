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
 * El orden tiene intención: 1 sola frase breve de oración al inicio del día
 * como apertura espiritual serena → fútbol al micrófono para soltar la voz →
 * vocabulario → cuento → cuerpo → minijuego si aplica → reto de reconocimiento
 * → hablar las frases de la lección → misión para la casa.
 *
 * Sin interrupciones ni repeticiones de oración en medio del juego: solo 1 al
 * inicio para no saturar.
 */
export function generarRecorridoDeHoy(leccion: LeccionCurricular): ItemRecorrido[] {
  const paradas: Parada[] = [
    { tipo: 'oracion' },
    { tipo: 'sayit', momento: 'gancho' },
    { tipo: 'vocabulario' },
    { tipo: 'cuento' },
    { tipo: 'move' },
  ]
  if (leccion.juego) paradas.push({ tipo: 'minijuego', id: leccion.juego.id })
  paradas.push(
    { tipo: 'challenge' },
    { tipo: 'sayit', momento: 'leccion' },
    { tipo: 'takehome' },
  )

  return paradas.map((parada) => ({ modo: 'fijo' as const, parada }))
}
