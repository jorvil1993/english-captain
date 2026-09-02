import { useEffect } from 'react'
import { decir, esperar } from '../audio/voz'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'

export type SeccionRincon =
  | 'cuentos'
  | 'biblia'
  | 'oraciones'
  | 'oracioncitas'
  | 'alabanza'
  | 'objetos'
  | 'tablero'

/**
 * EL RINCÓN CATÓLICO — Modo libre, seguro y calmado.
 *
 * Diseñado para momentos en que papá necesita dejarle el teléfono hasta 45-60 minutos
 * (grupo de oración, viajes, momentos de calma) sin sobreestimular su cerebro con dopamina rápida.
 */
export function RinconCatolico({
  onElegir,
  onVolver,
  onPanel,
}: {
  onElegir: (s: SeccionRincon) => void
  onVolver: () => void
  onPanel: () => void
}) {
  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(300)
      if (cancelado) return
      await decir('Welcome to the Catholic Corner!')
    })()
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <Marco paso={0} total={0} onPanel={onPanel}>
      <div className="pantalla">
        <p className="frase">Catholic Corner</p>
        <p className="frase-chica">Cuentos, oraciones y cantos</p>

        <div className="fila" style={{ flexWrap: 'wrap', maxWidth: 640 }}>
          <div className="ficha" onClick={() => onElegir('cuentos')}>
            <Tarjeta img="plan-story" emoji="📖" grande />
            <span className="frase-chica">📖 Bible Stories</span>
          </div>

          <div className="ficha" onClick={() => onElegir('biblia')}>
            <Tarjeta img="u2-shepherd" emoji="✝️" grande />
            <span className="frase-chica">✝️ Bible Friends</span>
          </div>

          <div className="ficha" onClick={() => onElegir('oraciones')}>
            <Tarjeta img="o-hail-mary" emoji="🕊️" grande />
            <span className="frase-chica">🕊️ Pray & Sing</span>
          </div>

          <div className="ficha" onClick={() => onElegir('oracioncitas')}>
            <Tarjeta img="o-angel" emoji="🙏" grande />
            <span className="frase-chica">🙏 Little Prayers</span>
          </div>

          <div className="ficha" onClick={() => onElegir('alabanza')}>
            <Tarjeta img="o-glory" emoji="🎵" grande />
            <span className="frase-chica">🎵 Sing & Praise</span>
          </div>

          <div className="ficha" onClick={() => onElegir('objetos')}>
            <Tarjeta img="u6-altar" emoji="⛪" grande />
            <span className="frase-chica">⛪ Holy Things</span>
          </div>

          <div className="ficha" onClick={() => onElegir('tablero')}>
            <Tarjeta img="u3-beautiful" emoji="🧩" grande />
            <span className="frase-chica">🧩 Sound Board</span>
          </div>
        </div>

        <button className="boton fantasma" onClick={onVolver} style={{ marginTop: 12 }}>
          ← Volver
        </button>
      </div>
    </Marco>
  )
}
