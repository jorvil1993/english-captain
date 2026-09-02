import { useState } from 'react'
import { UNIDADES } from '../datos/curso'
import type { Unidad } from '../datos/tipos'
import { Story } from './Story'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'
import { decir } from '../audio/voz'

export function CuentosExplorer({
  onVolver,
  onPanel,
}: {
  onVolver: () => void
  onPanel: () => void
}) {
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<Unidad | null>(null)

  if (unidadSeleccionada) {
    return (
      <Story
        unidad={unidadSeleccionada}
        paso={1}
        onListo={() => setUnidadSeleccionada(null)}
        onResponder={() => {}}
        onPanel={onPanel}
      />
    )
  }

  return (
    <Marco paso={0} total={3} onPanel={onPanel}>
      <div className="pantalla">
        <p className="frase">Bible Stories & Parables</p>
        <p className="frase-chica">Toca una historia para escuchar</p>

        <div className="fila" style={{ flexWrap: 'wrap', gap: 16, maxWidth: 680 }}>
          {UNIDADES.map((u) => {
            const primeraEscena = u.cuento.escenas[0]
            return (
              <div
                key={u.id}
                className="ficha"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  void decir(u.cuento.titulo)
                  setUnidadSeleccionada(u)
                }}
              >
                <Tarjeta img={primeraEscena?.img ?? 'plan-story'} emoji={primeraEscena?.emoji ?? '📖'} />
                <span className="frase-chica" style={{ fontSize: 13, maxWidth: 120 }}>
                  {u.cuento.titulo}
                </span>
              </div>
            )
          })}
        </div>

        <button className="boton fantasma" onClick={onVolver} style={{ marginTop: 16 }}>
          ← Volver al Rincón
        </button>
      </div>
    </Marco>
  )
}
