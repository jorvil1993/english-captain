import { useState } from 'react'
import type { IdMinijuego } from '../datos/recorrido'
import { renderMinijuegoDeHoy } from './registroMinijuegos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'
import { decir } from '../audio/voz'

const JUEGOS: { id: IdMinijuego; titulo: string; emoji: string; img: string; desc: string }[] = [
  { id: 'champions', titulo: 'Champions of Jesus', emoji: '⚽', img: 'c-messi', desc: 'Fútbol sagrado con Messi, Mbappé y Modrić' },
  { id: 'angel', titulo: 'Guardian Angel Catch', emoji: '👼', img: 'o-angel', desc: 'Atrapa las estrellas con el Ángel' },
  { id: 'storm', titulo: 'Calm the Storm', emoji: '⛵', img: 'u5-friend', desc: 'Jesús calma la tormenta en el mar' },
  { id: 'altar', titulo: 'Light the Altar', emoji: '🕯️', img: 'u6-altar', desc: 'Enciende las velas del altar sagrado' },
  { id: 'trace', titulo: 'Trace the Holy Cross', emoji: '✝️', img: 'o-cross', desc: 'Sigue el camino de la Cruz' },
  { id: 'noah', titulo: "Noah's Ark Pairs", emoji: '🐑', img: 'u2-sheep', desc: 'Encuentra las parejas del Arca' },
  { id: 'loaves', titulo: 'Loaves & Fishes', emoji: '🍞', img: 'o-grace', desc: 'Comparte los panes y los peces' },
  { id: 'bells', titulo: 'Ring the Bells', emoji: '🔔', img: 'u6-bell', desc: 'Toca las campanas de la iglesia' },
  { id: 'creation', titulo: 'Creation Bloom', emoji: '🌸', img: 'u3-beautiful', desc: 'Haz florecer la Creación de Dios' },
  { id: 'nativity', titulo: 'Dress the Nativity', emoji: '🌟', img: 'u4-family', desc: 'Arma el pesebre con Jesús, María y José' },
  { id: 'routine', titulo: 'Daily Blessings', emoji: '🌅', img: 'u7-morning', desc: 'Rutinas de mañana y noche con Dios' },
]

/**
 * Explorador libre de minijuegos para papás y niños:
 * Permite probar y jugar cualquiera de los 11 minijuegos en cualquier momento.
 */
export function MinijuegosExplorer({
  onVolver,
  onPanel,
}: {
  onVolver: () => void
  onPanel: () => void
}) {
  const [juegoActivo, setJuegoActivo] = useState<IdMinijuego | null>(null)

  if (juegoActivo) {
    return (
      <>
        {renderMinijuegoDeHoy(juegoActivo, {
          onPanel,
          avanzar: () => setJuegoActivo(null),
        })}
      </>
    )
  }

  return (
    <Marco paso={0} total={0} onPanel={onPanel}>
      <div className="pantalla" style={{ paddingBottom: 32 }}>
        <p className="frase">🎮 Sacred Games</p>
        <p className="frase-chica">11 juegos interactivos católicos y de movimiento</p>

        <div className="fila" style={{ flexWrap: 'wrap', gap: 14, maxWidth: 720, justifyContent: 'center' }}>
          {JUEGOS.map((j) => (
            <div
              key={j.id}
              className="ficha"
              style={{ cursor: 'pointer', minWidth: 140, maxWidth: 160 }}
              onClick={() => {
                void decir(j.titulo)
                setJuegoActivo(j.id)
              }}
            >
              <Tarjeta img={j.img} emoji={j.emoji} grande />
              <span className="frase-chica" style={{ fontWeight: 'bold', fontSize: 13, marginTop: 4 }}>
                {j.emoji} {j.titulo}
              </span>
              <span style={{ fontSize: 11, color: 'var(--tinta-suave)', textAlign: 'center', lineHeight: 1.2 }}>
                {j.desc}
              </span>
            </div>
          ))}
        </div>

        <button className="boton fantasma" onClick={onVolver} style={{ marginTop: 20 }}>
          ← Volver al Rincón
        </button>
      </div>
    </Marco>
  )
}
