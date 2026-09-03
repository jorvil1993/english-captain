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

export function planDeOracionDeHoy(params: {
  oracionIndice: number
  oracionVersoIndice: number
  memoria: Record<string, MemoriaFrase>
  hoy: string
}): PlanDeOracion {
  // La oración no rota todavía: el primer hilo espiritual de José es el Ave
  // María. Cambiar de oración antes de poder reconocer sus frases rompería la
  // continuidad que necesita un niño que aún no lee.
  const oracion = ORACIONES.find((item) => item.id === 'o-hail-mary') ?? ORACIONES[params.oracionIndice % ORACIONES.length]
  const total = oracion.versos.length
  const enseniados = Math.min(params.oracionVersoIndice, total)

  if (params.oracionVersoIndice >= total) {
    // Si ya completó todos los versos, repasa 1 solo verso por día (el más vencido)
    let versoVencido = 0
    let fechaMasAntigua = '9999'
    for (let i = 0; i < total; i++) {
      const m = params.memoria[idVerso(oracion.id, i)]
      const prox = m?.proximo ?? '0000'
      if (prox < fechaMasAntigua) {
        fechaMasAntigua = prox
        versoVencido = i
      }
    }
    return { oracion, versosRepaso: [versoVencido], versoNuevo: null }
  }

  // Exactamente 1 verso nuevo cada día, sin acumular versos en la misma sesión
  const versoNuevo = enseniados
  return { oracion, versosRepaso: [], versoNuevo }
}
