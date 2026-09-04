import { useEffect, useState } from 'react'
import { ORACIONES, TODAS_LAS_FRASES, UNIDADES } from '../datos/curso'
import { VIRTUDES } from '../datos/tipos'
import { grabacionesDeHoy, reproducir } from '../audio/grabaciones'
import { ultimoError } from '../componentes/RedDeSeguridad'
import { hoyISO, useSesion } from '../estado/Sesion'
import { FichaJuegosMovimiento } from '../componentes/FichaJuegosMovimiento'
import { APP_VERSION } from '../datos/version'

/**
 * El panel de papás.
 *
 * Configuración de unidades, modo libre para grupo de oración, y métricas de progreso.
 */
export function Papas({ onSalir, onEntrarModoCalma }: { onSalir: () => void; onEntrarModoCalma?: () => void }) {
  const {
    nombre,
    unidad,
    unidadIndice,
    sesiones,
    memoria,
    modoLibreActivo,
    oracionActual,
    oracionVersoIndice,
    marcarMision,
    ponerNombre,
    fijarUnidadIndice,
    fijarOracionIndice,
    fijarModoLibre,
    borrarTodo,
  } = useSesion()

  const [confirmarBorrado, setConfirmarBorrado] = useState(false)
  const [creditos, setCreditos] = useState<Record<string, { archivo: string; licencia: string; autor: string; pagina: string }>>({})
  const grabaciones = grabacionesDeHoy()

  useEffect(() => {
    void fetch('./img/creditos.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then(setCreditos)
      .catch(() => setCreditos({}))
  }, [])

  const hoy = hoyISO()
  const sesionesHoy = sesiones.filter((s) => s.fecha === hoy)
  const misionHoyCumplida = sesionesHoy.some((s) => s.misionCumplida)

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
          Unidad {unidad.numero} de {UNIDADES.length} · <b>{unidad.titulo}</b> · virtud: <b>{VIRTUDES[unidad.virtud]}</b>
        </p>

        <h2>Control de Unidades y Modo</h2>
        <div style={{ background: 'var(--blanco)', padding: 16, borderRadius: 16, marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Cambiar desde qué unidad continúa el recorrido:</p>
          <select
            value={unidadIndice}
            onChange={(e) => fijarUnidadIndice(Number(e.target.value))}
            style={{ width: '100%', fontSize: 15, padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', marginBottom: 14 }}
          >
            {UNIDADES.map((u, idx) => (
              <option key={u.id} value={idx}>
                Unidad {u.numero}: {u.titulo} ({VIRTUDES[u.virtud]})
              </option>
            ))}
          </select>

          <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={modoLibreActivo}
              onChange={(e) => fijarModoLibre(e.target.checked)}
              style={{ width: 22, height: 22 }}
            />
            <span>
              <b>Habilitar Rincón Católico (Modo Libre / Grupo de Oración)</b>
              <br />
              <small style={{ color: 'var(--tinta-suave)' }}>
                Permite a José explorar cuentos, cantos y oraciones de 30 a 60 min de forma sana y sin bloqueo diario.
              </small>
            </span>
          </label>

          {modoLibreActivo && onEntrarModoCalma && (
            <button className="boton fantasma" onClick={onEntrarModoCalma} style={{ marginTop: 12 }}>
              🙏 Entrar a Modo Calma ahora
            </button>
          )}
        </div>

        <h2>Cómo va con las oraciones</h2>
        <div style={{ background: 'var(--blanco)', padding: 16, borderRadius: 16, marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}>
            Aprendiendo: <b>{oracionActual.titulo}</b> — verso {Math.min(oracionVersoIndice + 1, oracionActual.versos.length)} de{' '}
            {oracionActual.versos.length}
          </p>
          <select
            value={ORACIONES.findIndex((o) => o.id === oracionActual.id)}
            onChange={(e) => fijarOracionIndice(Number(e.target.value))}
            style={{ width: '100%', fontSize: 15, padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}
          >
            {ORACIONES.map((o, idx) => (
              <option key={o.id} value={idx}>
                {o.titulo}
              </option>
            ))}
          </select>
        </div>

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
            <span>misiones cumplidas fuera de pantalla</span>
          </div>
        </div>

        <h2>La misión de hoy</h2>
        <p>
          <b>{unidad.mision.es}</b>
        </p>
        {sesionesHoy.length > 0 ? (
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15 }}>
            <input
              type="checkbox"
              checked={misionHoyCumplida}
              onChange={(e) => marcarMision(hoy, e.target.checked)}
              style={{ width: 22, height: 22 }}
            />
            La cumplió hoy · {sesionesHoy.length} lección{sesionesHoy.length === 1 ? '' : 'es'} practicada{sesionesHoy.length === 1 ? '' : 's'}
          </label>
        ) : (
          <p>Todavía no practicó hoy.</p>
        )}

        <h2>El momento papá (3 minutos en familia)</h2>
        <p>
          Lo que hace que una pantalla enseñe o no es que alguien le responda a él, ahora. Cuando termine, siéntate y haz esto:
        </p>
        <ul>
          <li>
            Pídele que te enseñe las frases de hoy: <b>{unidad.frases.slice(0, 3).map((f) => f.en).join(' · ')}</b>
          </li>
          <li>
            Hazle la orden con el cuerpo: dile <i>{unidad.frases[1]?.ordenEn}</i> y hazla tú también.
          </li>
          <li>Escucha con él lo que grabó y aplaude. Necesita público, no corrección.</li>
          <li>Nunca le corrijas la pronunciación. A esta edad no corresponde.</li>
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
            {[...sesiones].reverse().slice(0, 12).map((s, indice) => (
              <tr key={s.id ?? `${s.fecha}-${indice}`}>
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
          <span style={{ fontSize: 13 }}>(la voz lo llama por su nombre)</span>
        </p>

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
            <ul style={{ fontSize: 13 }}>
              {Object.entries(creditos).map(([clave, c]) => (
                <li key={clave}>
                  <b>{clave}</b>: {c.autor} · {c.licencia}
                </li>
              ))}
            </ul>
          </>
        )}

        <FichaJuegosMovimiento />

        {(() => {
          const err = ultimoError()
          return err ? (
            <>
              <h2>Última vez que algo se rompió</h2>
              <p style={{ fontSize: 13 }}>
                <b>{err.cuando.slice(0, 16).replace('T', ' ')}</b> — {err.mensaje}
              </p>
            </>
          ) : null
        })()}
        <p style={{ fontSize: 12, color: 'var(--tinta-suave)', marginTop: 24, marginBottom: 12, textAlign: 'center' }}>
          English with Captain José · Versión {APP_VERSION}
        </p>
      </div>
    </div>
  )
}
