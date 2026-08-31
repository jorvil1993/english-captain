import { LISTA_MINIJUEGOS, type MinijuegoInfo } from '../datos/minijuegos'
import { LISTA_MINIJUEGOS_EXTRA, type MinijuegoExtraId } from '../datos/minijuegos-extra'
import { decir } from '../audio/voz'
import { toque } from '../audio/sonidos'
import { Marco } from '../componentes/Marco'
import './minijuegos/motor/estilos.css'

/**
 * EL MENÚ DE LOS MINI JUEGOS.
 *
 * Diez juegos en dos familias, y la separación no es de adorno:
 *
 *   TAP & PLAY   se toca algo y pasa algo. Ritmo lento, sin urgencia.
 *   MOVE & PLAY  el dedo hace un gesto sostenido —trazar, arrastrar,
 *                perseguir, agitar, tirar—. Piden cuerpo.
 *
 * José no lee, así que el rótulo de cada familia es para papá; lo que él
 * distingue es la posición y el dibujo. Que los cinco de movimiento estén
 * siempre abajo y los cinco de toque siempre arriba es lo que le permite
 * volver al que le gustó sin preguntar.
 *
 * Y el menú no se desplaza NUNCA. Con diez tarjetas la tentación es dejar que
 * la pantalla haga scroll; para un niño de cuatro años eso significa que la
 * mitad de los juegos simplemente no existen, porque no se le ocurre que haya
 * algo más abajo. Entran los diez o no entra ninguno.
 */

type Elegible = MinijuegoInfo['id'] | MinijuegoExtraId

type Tarjeta = {
  id: Elegible
  titulo: string
  emoji: string
}

export function MinijuegosHub({
  onElegir,
  onVolver,
  onPanel,
}: {
  onElegir: (id: Elegible) => void
  onVolver: () => void
  onPanel: () => void
}) {
  const seleccionar = (t: Tarjeta) => {
    toque()
    void decir(t.titulo)
    onElegir(t.id)
  }

  const grupo = (rotulo: string, icono: string, tarjetas: Tarjeta[]) => (
    <>
      <p className="mjx-hub-rotulo">
        <span aria-hidden>{icono}</span> {rotulo}
      </p>
      {tarjetas.map((t) => (
        <div
          key={t.id}
          className="mjx-hub-tarjeta"
          role="button"
          tabIndex={0}
          onClick={() => seleccionar(t)}
        >
          <span className="emoji" aria-hidden>
            {t.emoji}
          </span>
          <span className="titulo">{t.titulo}</span>
        </div>
      ))}
    </>
  )

  return (
    <Marco paso={0} total={0} onPanel={onPanel} onInicio={onVolver}>
      <div className="mjx-hub">
        <p className="mjx-titulo">Catholic Minigames</p>

        <div className="mjx-hub-lista">
          {grupo(
            'Tap & Play',
            '👆',
            LISTA_MINIJUEGOS.map((m) => ({ id: m.id, titulo: m.titulo, emoji: m.emoji })),
          )}
          {grupo(
            'Move & Play',
            '💪',
            LISTA_MINIJUEGOS_EXTRA.map((m) => ({ id: m.id, titulo: m.titulo, emoji: m.emoji })),
          )}
        </div>
      </div>
    </Marco>
  )
}
