import { useCallback, useEffect, useRef } from 'react'
import { callar, decir, esperar } from './voz'

/**
 * Narrar en secuencia sin atropellarse y sin quedar hablando cuando la
 * pantalla ya cambió.
 *
 * Las pausas entre frases son a propósito. El silencio es parte del método: en
 * la Catequesis del Buen Pastor el catequista "presenta y se calla" para que el
 * niño se encuentre él mismo con lo que ve, y la AAP advierte que el contenido
 * de ritmo rápido se entiende peor a esta edad.
 */
export function useNarrador() {
  const vivo = useRef(true)

  useEffect(() => {
    vivo.current = true
    return () => {
      vivo.current = false
      callar()
    }
  }, [])

  /** Dice una lista de frases en inglés, con respiro entre una y otra. */
  const narrar = useCallback(async (frases: string[], pausa = 550) => {
    for (const f of frases) {
      if (!vivo.current) return
      await decir(f)
      if (!vivo.current) return
      await esperar(pausa)
    }
  }, [])

  const sigueVivo = useCallback(() => vivo.current, [])

  return { narrar, sigueVivo }
}
