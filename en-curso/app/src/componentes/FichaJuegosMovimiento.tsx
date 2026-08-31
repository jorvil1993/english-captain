import { LISTA_MINIJUEGOS_EXTRA } from '../datos/minijuegos-extra'

/**
 * La ficha de los cinco mini juegos de movimiento, para el panel de papás.
 *
 * Existe por una razón concreta: José no puede contar qué aprendió. No lee, y
 * a esta edad tampoco reporta —si le preguntas qué hizo, dice "jugué"—. El
 * único que puede cerrar el círculo es papá, y solo si sabe qué frase en
 * inglés salió de qué juego. Con esa lista en la mano puede decirle "catch the
 * star!" mientras patean la pelota en el patio, y ahí es donde el idioma se
 * queda: la contingencia social con un adulto es el multiplicador más grande
 * que existe a esta edad (§1.2 de la investigación). Sin esta tabla, la app
 * enseña sola y lo aprendido se queda dentro de la tablet.
 *
 * Se muestra en el panel, que es la única pantalla de la app con texto para
 * leer, porque la leen adultos.
 */
export function FichaJuegosMovimiento() {
  return (
    <>
      <h2>Mini juegos de movimiento</h2>
      <p style={{ fontSize: 13 }}>
        Los cinco que se juegan con el dedo en movimiento, no tocando. Cada uno
        entrena un gesto distinto. Si repites con él estas frases fuera de la
        pantalla, se le quedan.
      </p>
      <table>
        <thead>
          <tr>
            <th>Juego</th>
            <th>Qué hace el dedo</th>
            <th>Qué se lleva en inglés</th>
          </tr>
        </thead>
        <tbody>
          {LISTA_MINIJUEGOS_EXTRA.map((m) => (
            <tr key={m.id}>
              <td>
                <b>
                  {m.emoji} {m.titulo}
                </b>
                <br />
                <span style={{ fontSize: 12, color: 'var(--tinta-suave)' }}>{m.descripcion}</span>
              </td>
              <td style={{ fontSize: 13 }}>{m.gesto}</td>
              <td style={{ fontSize: 13 }}>{m.aprende}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
