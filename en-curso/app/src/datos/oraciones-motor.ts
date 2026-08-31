import { ORACIONES } from './curso'
import type { Oracion } from './tipos'
import type { MemoriaFrase } from '../estado/Sesion'

/**
 * El troceo de oraciones. Cada `Oracion.versos[i]` en `curso.ts` ya es una
 * unidad de fraseo corta (la Hail Mary ya está partida en 8 líneas de
 * aliento) — lo que faltaba no era trocear el texto, era la cadencia: un
 * verso nuevo por sesión, con repaso de lo aprendido antes, igual que pide
 * la repetición espaciada para memorización a los 5 años.
 */

/** Id estable de un verso para el motor de repetición espaciada de Sesion.tsx.
 *  Prefijo `o-` no colisiona con ids de Frase (siempre `u{n}-...`). */
export function idVerso(oracionId: string, versoIdx: number): string {
  return `o-${oracionId}-v${versoIdx}`
}

export type PlanDeOracion = {
  oracion: Oracion
  versosRepaso: number[]
  versoNuevo: number | null
}

const TOPE_REPASO = 3

export function planDeOracionDeHoy(params: {
  oracionIndice: number
  oracionVersoIndice: number
  memoria: Record<string, MemoriaFrase>
  hoy: string
}): PlanDeOracion {
  const oracion = ORACIONES[params.oracionIndice % ORACIONES.length]
  const total = oracion.versos.length
  const enseniados = Math.min(params.oracionVersoIndice, total)

  if (params.oracionVersoIndice === total) {
    // Día de graduación: se reza entera, de corrido, como celebración.
    return { oracion, versosRepaso: Array.from({ length: total }, (_, i) => i), versoNuevo: null }
  }

  const versoNuevo = enseniados < total ? enseniados : null
  // El verso de ayer, siempre — continuidad para un niño de 5 años, más
  // allá de lo que diga el SRS puro.
  const garantizado = enseniados > 0 ? [enseniados - 1] : []
  const vencidos: number[] = []
  for (let i = 0; i < enseniados; i++) {
    if (garantizado.includes(i)) continue
    const m = params.memoria[idVerso(oracion.id, i)]
    if (m && m.proximo <= params.hoy) vencidos.push(i)
  }
  const versosRepaso = [...garantizado, ...vencidos].sort((a, b) => a - b).slice(0, TOPE_REPASO)
  return { oracion, versosRepaso, versoNuevo }
}
