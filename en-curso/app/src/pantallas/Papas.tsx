import { useEffect, useState } from 'react'
import { TODAS_LAS_FRASES } from '../datos/curso'
import { VIRTUDES } from '../datos/tipos'
import { grabacionesDeHoy, reproducir } from '../audio/grabaciones'
import { hoyISO, useSesion } from '../estado/Sesion'

/**
 * El panel de papás. La única pantalla con texto de verdad.
 *
 * Muestra tres números y ninguno es un puntaje para José:
 *
 *  1. COMPRENSIÓN — % de aciertos al señalar la imagen correcta. Es lo que
 *     importa a los 4-5 años: primero se entiende, mucho después se habla
 *     (§1.9). Si esto sube, la app funciona.
 *  2. INTENTOS DE VOZ — cuántas veces intentó decir algo. Es la métrica del
 *     estudio SparkLing (vocalizaciones por sesión), no la "corrección".
 *  3. TRANSFERENCIA — cuántos días usó lo aprendido FUERA de la pantalla. La
 *     única que cuenta de verdad, y la única que hay que marcar a mano.
 */
export function Papas({ onSalir }: { onSalir: () => void }) {
  const { nombre, unidad, sesiones, memoria, marcarMision, ponerNombre, reiniciarDia, borrarTodo, yaJugoHoy } = useSesion()
  const [confirmarBorrado, setConfirmarBorrado] = useState(false)
  const [creditos, setCreditos] = useState<Record<string, { archivo: string; licencia: string; autor: string; pagina: string }>>({})
  const grabaciones = grabacionesDeHoy()

  // Los créditos de las fotos de los jugadores. Son fotografías reales con
  // licencia libre de Wikimedia Commons, y esas licencias piden atribución:
  // acá es donde se cumple.
  useEffect(() => {
    void fetch('./img/creditos.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then(setCreditos)
      .catch(() => setCreditos({}))
  }, [])

  const hoy = hoyISO()
  const sesionHoy = sesiones.find((s) => s.fecha === hoy)

  const ultimas = sesiones.slice(-14)
  const preguntas = ultimas.reduce((a, s) => a + s.preguntas, 0)
  const aciertos = ultimas.reduce((a, s) => a + s.aciertos, 0)
  const comprension = preguntas ? Math.round((aciertos / preguntas) * 100) : 0
  const vozPorSesion = ultimas.length ? (ultimas.reduce((a, s) => a + s.intentosVoz, 0) / ultimas.length).toFixed(1) : '0'
  const misiones = ultimas.filter((s) => s.misionCumplida).length

  const conMemoria = TODAS_LAS_FRASES.filter((f) => memoria[f.id])
  const firmes = conMemoria.filter((f) => memoria[f.id].nivel >= 3)
  const flojas = conMemoria.filter((f) => memoria[f.id].nivel <= 1 && memoria[f.id].fallos > 0)

  return (
    <div className="panel">
      <div className="panel-dentro">
      <button className="boton fantasma" onClick={onSalir} style={{ float: 'right' }}>
        ✕ salir
      </button>

      <h1>English with Captain {nombre}</h1>
      <p>
        Unidad {unidad.numero} · <b>{unidad.titulo}</b> · virtud: {VIRTUDES[unidad.virtud]}
      </p>

      <h2>Cómo va</h2>
      <div className="tarjetas-dato">
        <div className="dato">
          <b>{comprension}%</b>
          <span>comprensión (últimas 14 sesiones)</span>
        </div>
        <div className="dato">
          <b>{vozPorSesion}</b>
          <span>intentos de voz por sesión</span>
        </div>
        <div className="dato">
          <b>
            {misiones}/{ultimas.length}
          </b>
          <span>misiones cumplidas fuera de la pantalla</span>
        </div>
      </div>
      <p>
        La tercera es la que importa. Comprensión alta con transferencia cero significa que aprendió a jugar con la
        tablet, no a hablar inglés.
      </p>

      <h2>La misión de hoy</h2>
      <p>
        <b>{unidad.mision.es}</b>
      </p>
      {sesionHoy ? (
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15 }}>
          <input
            type="checkbox"
            checked={sesionHoy.misionCumplida}
            onChange={(e) => marcarMision(hoy, e.target.checked)}
            style={{ width: 22, height: 22 }}
          />
          La cumplió hoy
        </label>
      ) : (
        <p>Todavía no hizo la sesión de hoy.</p>
      )}

      <h2>El momento papá (3 minutos, y valen más que los 15 anteriores)</h2>
      <p>
        Lo que hace que una pantalla enseñe o no es que alguien le responda a él, ahora. Cuando termine, siéntate y haz
        esto —no hace falta que sepas inglés:
      </p>
      <ul>
        <li>Pídele que te enseñe las frases de hoy: <b>{unidad.frases.slice(0, 3).map((f) => f.en).join(' · ')}</b></li>
        <li>Hazle la orden con el cuerpo: dile <i>{unidad.frases[1]?.ordenEn}</i> y hazla tú también.</li>
        <li>Escucha con él lo que grabó y aplaude. Necesita público, no corrección.</li>
        <li>Nunca le corrijas la pronunciación. A esta edad no corresponde, y con él cierra la puerta.</li>
      </ul>

      {grabaciones.length > 0 && (
        <>
          <h2>Lo que grabó hoy</h2>
          {grabaciones.map((g, n) => (
            <p key={n}>
              <button className="boton fantasma" onClick={() => void reproducir(g.url)}>
                ▶ {g.en}
              </button>
            </p>
          ))}
          <p style={{ fontSize: 13 }}>Las grabaciones se quedan en la tablet y se borran al cerrar la app.</p>
        </>
      )}

      <h2>Qué tiene firme y qué está flojo</h2>
      <p style={{ fontSize: 14 }}>
        <b>Firmes ({firmes.length}):</b> {firmes.map((f) => f.en).join(' · ') || '—'}
      </p>
      <p style={{ fontSize: 14 }}>
        <b>Para reforzar ({flojas.length}):</b> {flojas.map((f) => f.en).join(' · ') || '—'}
      </p>
      <p style={{ fontSize: 13 }}>
        Las flojas vuelven solas al reto en 1 día; las firmes, en 8 o 16. No hay que hacer nada.
      </p>

      <h2>Últimas sesiones</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Unidad</th>
            <th>Comprensión</th>
            <th>Voz</th>
            <th>Misión</th>
          </tr>
        </thead>
        <tbody>
          {[...sesiones].reverse().slice(0, 12).map((s) => (
            <tr key={s.fecha}>
              <td>{s.fecha}</td>
              <td>{s.unidad}</td>
              <td>{s.preguntas ? `${Math.round((s.aciertos / s.preguntas) * 100)}%` : '—'}</td>
              <td>{s.intentosVoz}</td>
              <td>{s.misionCumplida ? '✓' : '·'}</td>
            </tr>
          ))}
          {!sesiones.length && (
            <tr>
              <td colSpan={5}>Todavía no hay sesiones.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Ajustes</h2>
      <p>
        Nombre:{' '}
        <input
          defaultValue={nombre}
          onBlur={(e) => ponerNombre(e.target.value)}
          style={{ fontSize: 15, padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd' }}
        />{' '}
        <span style={{ fontSize: 13 }}>(la voz lo llama por su nombre en cada sesión)</span>
      </p>
      {yaJugoHoy && (
        <p>
          <button className="boton fantasma" onClick={reiniciarDia}>
            Permitir otra sesión hoy
          </button>
          <br />
          <span style={{ fontSize: 13 }}>
            La app da una sesión por día a propósito. Si abres otra, que sea tu decisión y no porque él insistió — el
            valor del límite está en que sea previsible.
          </span>
        </p>
      )}
      <p>
        {confirmarBorrado ? (
          <>
            <button className="boton fantasma" onClick={borrarTodo} style={{ color: '#a33' }}>
              Sí, borrar todo el progreso
            </button>
            <button className="boton fantasma" onClick={() => setConfirmarBorrado(false)}>
              cancelar
            </button>
          </>
        ) : (
          <button className="boton fantasma" onClick={() => setConfirmarBorrado(true)}>
            Borrar el progreso
          </button>
        )}
      </p>

      {Object.keys(creditos).length > 0 && (
        <>
          <h2>Fotos de los jugadores</h2>
          <p style={{ fontSize: 13 }}>
            Son fotografías reales con licencia libre de Wikimedia Commons —no caras generadas por IA— y su licencia
            pide atribución:
          </p>
          <ul style={{ fontSize: 13 }}>
            {Object.entries(creditos).map(([clave, c]) => (
              <li key={clave}>
                <b>{clave}</b>: {c.autor} · {c.licencia}
                {c.pagina && (
                  <>
                    {' · '}
                    <a href={c.pagina} target="_blank" rel="noreferrer">
                      ficha
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Por qué la app es así</h2>
      <p style={{ fontSize: 13 }}>
        Cada decisión de diseño —frases enteras y no palabras, el cuento que se detiene a preguntar, el cuerpo en
        movimiento, el repaso espaciado, el micrófono que no califica, la sesión que se corta sola— sale del documento{' '}
        <b>contexto/claude-2026-08-30-investigacion-metodo.md</b>, con las fuentes citadas. Si algo de la app te
        parece raro, ahí está el porqué.
      </p>
      </div>
    </div>
  )
}
