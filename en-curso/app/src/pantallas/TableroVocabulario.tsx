import { useState } from 'react'
import { UNIDADES } from '../datos/curso'
import type { Frase } from '../datos/tipos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'
import { decir } from '../audio/voz'

export function TableroVocabulario({
  onVolver,
  onPanel,
  onInicio,
  onListo,
}: {
  onVolver: () => void
  onPanel: () => void
  onInicio?: () => void
  /** Si está presente, es una parada del recorrido diario: no hay "volver
   *  al rincón" (no hay a dónde volver), hay un botón para seguir cuando
   *  José ya escuchó algunas tarjetas. Sin esto, comportamiento de siempre. */
  onListo?: () => void
}) {
  const [unidadIdx, setUnidadIdx] = useState(0)
  const unidad = UNIDADES[unidadIdx] ?? UNIDADES[0]
  const [fraseActiva, setFraseActiva] = useState<Frase | null>(null)

  const reproducir = (f: Frase) => {
    setFraseActiva(f)
    void decir(f.en)
  }

  return (
    <Marco paso={0} total={3} onPanel={onPanel} onInicio={onInicio}>
      <div className="pantalla" style={{ overflowY: 'auto', paddingBottom: 40 }}>
        <p className="frase">{fraseActiva ? fraseActiva.en : 'Sound Board'}</p>
        <p className="frase-chica">{fraseActiva ? fraseActiva.gesto : 'Toca cualquier tarjeta para escucharla'}</p>

        {/* Pestañas simples para cambiar de unidad */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', margin: '8px 0' }}>
          {UNIDADES.map((u, idx) => (
            <button
              key={u.id}
              className="boton fantasma"
              style={{
                fontSize: 12,
                padding: '4px 8px',
                borderRadius: 8,
                backgroundColor: idx === unidadIdx ? 'var(--verde)' : 'var(--fondo-2)',
                color: idx === unidadIdx ? '#fff' : 'var(--tinta)',
              }}
              onClick={() => {
                setUnidadIdx(idx)
                setFraseActiva(null)
              }}
            >
              {u.numero}. {u.titulo.split('—')[0]?.trim()}
            </button>
          ))}
        </div>

        <div className="fila" style={{ flexWrap: 'wrap', gap: 12, maxWidth: 640, marginTop: 8 }}>
          {unidad.frases.map((f) => (
            <div key={f.id} className="ficha" onClick={() => reproducir(f)} style={{ cursor: 'pointer' }}>
              <Tarjeta img={f.img} emoji={f.emoji} elegida={fraseActiva?.id === f.id} />
              <span className="frase-chica" style={{ fontSize: 12, maxWidth: 110 }}>
                {f.en}
              </span>
            </div>
          ))}
        </div>

        {onListo ? (
          <button className="boton fantasma" onClick={onListo} style={{ marginTop: 20 }}>
            ▶ Continue
          </button>
        ) : (
          <button className="boton fantasma" onClick={onVolver} style={{ marginTop: 20 }}>
            ← Volver al Rincón
          </button>
        )}
      </div>
    </Marco>
  )
}
