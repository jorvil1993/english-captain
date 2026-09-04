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

export const INTERVALO_ORACION = 5

export type RecorridoGenerado = {
  items: ItemRecorrido[]
  contadorFinal: number
}

/**
 * Ritmo pedagógico y espiritual:
 * Entre cada oración SIEMPRE hay un bloque de 5 actividades de juego,
 * palabras, cuento, movimiento y retos.
 *
 * "oración, juego, juego, palabra, palabra, palabra, palabra, oración.
 *  juego, juego, palabra, vocabulario, cuento, reto, oración."
 *
 * Las oraciones nunca van seguidas ni se eliminan: se espacian naturalmente.
 */
export function generarRecorridoDeHoy(
  leccion: LeccionCurricular,
  actividadesDesdeUltimaOracion: number = INTERVALO_ORACION,
): RecorridoGenerado {
  const actividades: Parada[] = [
    { tipo: 'sayit', momento: 'gancho' },
    { tipo: 'vocabulario' },
    { tipo: 'cuento' },
    { tipo: 'move' },
  ]
  if (leccion.juego) actividades.push({ tipo: 'minijuego', id: leccion.juego.id })
  actividades.push(
    { tipo: 'challenge' },
    { tipo: 'sayit', momento: 'leccion' },
    { tipo: 'takehome' },
  )

  const paradas: Parada[] = []
  let contador = actividadesDesdeUltimaOracion

  if (contador >= INTERVALO_ORACION) {
    paradas.push({ tipo: 'eco-oracion' })
    contador = 0
  }

  for (const act of actividades) {
    paradas.push(act)
    contador++
    if (contador >= INTERVALO_ORACION && act.tipo !== 'takehome') {
      paradas.push({ tipo: 'eco-oracion' })
      contador = 0
    }
  }

  return {
    items: paradas.map((parada) => ({ modo: 'fijo' as const, parada })),
    contadorFinal: contador,
  }
}
