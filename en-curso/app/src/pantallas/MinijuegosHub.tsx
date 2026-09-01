import { LISTA_MINIJUEGOS, type MinijuegoInfo } from '../datos/minijuegos'
import { LISTA_MINIJUEGOS_EXTRA, type MinijuegoExtraId } from '../datos/minijuegos-extra'
import { decir } from '../audio/voz'
import { toque } from '../audio/sonidos'
import { Marco } from '../componentes/Marco'
import { Tarjeta } from '../componentes/Tarjeta'
import './minijuegos/motor/estilos.css'

type Elegible = MinijuegoInfo['id'] | MinijuegoExtraId

type FichaJuego = {
  id: Elegible
  titulo: string
  emoji: string
  img: string
}

/** Solo aparecen juegos que tienen una lección previa en `curriculo.ts`.
 * Trace/Loaves/Storm siguen siendo prototipos internos hasta que exista su
 * propia secuencia de vocabulario; no se le ofrecen al niño como opciones
 * desconectadas para tocar al azar. */
const JUEGOS_CON_VOCABULARIO = new Set<Elegible>([
  'champions', 'altar', 'noah', 'nativity', 'creation', 'routine', 'angel', 'bells',
])

export function MinijuegosHub({
  onElegir,
  onVolver,
  onPanel,
}: {
  onElegir: (id: Elegible) => void
  onVolver: () => void
  onPanel: () => void
}) {
  const seleccionar = (t: FichaJuego) => {
    toque()
    void decir(t.titulo)
    onElegir(t.id)
  }

  const renderizarGrupo = (rotulo: string, icono: string, juegos: FichaJuego[]) => (
    <div style={{ width: '100%', marginBottom: 12 }}>
      <p
        style={{
          fontSize: 'clamp(14px, 3vmin, 18px)',
          fontWeight: 800,
          color: 'var(--verde-oscuro)',
          margin: '4px 0 10px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span aria-hidden>{icono}</span> {rotulo}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))',
          gap: 'clamp(8px, 1.5vmin, 14px)',
        }}
      >
        {juegos.map((j) => (
          <div
            key={j.id}
            onClick={() => seleccionar(j)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              touchAction: 'manipulation',
            }}
          >
            <div style={{ width: 84, height: 84 }}>
              <Tarjeta img={j.img} emoji={j.emoji} />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--tinta)',
                textAlign: 'center',
                marginTop: 4,
                lineHeight: 1.2,
              }}
            >
              {j.titulo}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Marco paso={0} total={0} onPanel={onPanel} onInicio={onVolver}>
      <div className="pantalla" style={{ justifyContent: 'flex-start', maxWidth: 'min(94vw, 560px)' }}>
        <p className="frase" style={{ marginBottom: 4 }}>
          Catholic Minigames
        </p>

        <div style={{ width: '100%', overflowY: 'auto', paddingBottom: 16 }}>
          {renderizarGrupo(
            'Games from the lessons',
            '👆',
            LISTA_MINIJUEGOS.filter((m) => JUEGOS_CON_VOCABULARIO.has(m.id)).map((m) => ({ id: m.id, titulo: m.titulo, emoji: m.emoji, img: m.img })),
          )}
          {renderizarGrupo(
            'Move & Play',
            '💪',
            LISTA_MINIJUEGOS_EXTRA.filter((m) => JUEGOS_CON_VOCABULARIO.has(m.id)).map((m) => ({ id: m.id, titulo: m.titulo, emoji: m.emoji, img: m.img })),
          )}
        </div>
      </div>
    </Marco>
  )
}
