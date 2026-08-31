import { useMemo, useState } from 'react'

export function CompuertaPapas({
  onAprobado,
  onCerrar,
}: {
  onAprobado: () => void
  onCerrar: () => void
}) {
  const [a] = useState(() => Math.floor(Math.random() * 5) + 3)
  const [b] = useState(() => Math.floor(Math.random() * 4) + 2)
  const suma = a + b

  const opciones = useMemo(() => {
    const vals = new Set<number>([suma])
    while (vals.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1)
      const cand = suma + offset
      if (cand > 0 && cand !== suma) vals.add(cand)
    }
    return Array.from(vals).sort((x, y) => x - y)
  }, [suma])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(51, 41, 29, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: 'var(--fondo)',
          borderRadius: 'var(--radio)',
          padding: 'clamp(20px, 4vmin, 32px)',
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--sombra)',
          border: '4px solid var(--fondo-2)',
        }}
      >
        <p style={{ fontSize: 24, margin: '0 0 8px 0' }}>🔒</p>
        <p style={{ fontWeight: 700, fontSize: 18, margin: '0 0 4px 0', color: 'var(--texto)' }}>
          Zona para Papás
        </p>
        <p style={{ fontSize: 15, color: 'var(--texto)', opacity: 0.8, margin: '0 0 16px 0' }}>
          Para ingresar, resuelve: <strong>{a} + {b} = ?</strong>
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          {opciones.map((opt) => (
            <button
              key={opt}
              className="boton"
              onClick={() => {
                if (opt === suma) {
                  onAprobado()
                } else {
                  onCerrar()
                }
              }}
              style={{
                fontSize: 20,
                fontWeight: 700,
                width: 64,
                height: 64,
                borderRadius: '50%',
                padding: 0,
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <button className="boton fantasma" onClick={onCerrar} style={{ fontSize: 14 }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}
