import { useState } from 'react'
import { ORACIONES, UNIDADES } from '../datos/curso'
import type { Cancion, Oracion } from '../datos/tipos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'
import { campana } from '../audio/sonidos'
import { decir, esperar } from '../audio/voz'
import { useNarrador } from '../audio/narracion'

type Modo = 'lista' | 'rezando' | 'cantando'

export function OracionesYCantos({
  onVolver,
  onPanel,
}: {
  onVolver: () => void
  onPanel: () => void
}) {
  const { narrar, sigueVivo } = useNarrador()
  const [modo, setModo] = useState<Modo>('lista')
  const [oracionActiva, setOracionActiva] = useState<Oracion | null>(null)
  const [cancionActiva, setCancionActiva] = useState<Cancion | null>(null)
  const [versoActual, setVersoActual] = useState<string>('')
  const [sonando, setSonando] = useState(false)

  const rezar = async (o: Oracion) => {
    setOracionActiva(o)
    setCancionActiva(null)
    setModo('rezando')
    setSonando(true)
    campana()
    await esperar(1200)

    for (const v of o.versos) {
      if (!sigueVivo()) break
      setVersoActual(v)
      await narrar([v], 900)
    }
    await esperar(1500)
    setSonando(false)
  }

  const cantar = async (c: Cancion) => {
    setCancionActiva(c)
    setOracionActiva(null)
    setModo('cantando')
    setSonando(true)

    for (const v of c.versos) {
      if (!sigueVivo()) break
      setVersoActual(v)
      await decir(v)
      await esperar(400)
    }
    await esperar(1000)
    setSonando(false)
  }

  if (modo === 'rezando' && oracionActiva) {
    return (
      <Marco paso={0} total={3} onPanel={onPanel}>
        <div className="pantalla">
          <Tarjeta img={oracionActiva.img} emoji={oracionActiva.emoji} grande onClick={() => !sonando && void rezar(oracionActiva)} />
          <p className="frase">{versoActual || oracionActiva.titulo}</p>
          <p className="frase-chica">{oracionActiva.gesto}</p>

          <button className="boton fantasma" onClick={() => setModo('lista')} style={{ marginTop: 16 }}>
            ← Volver a la lista
          </button>
        </div>
      </Marco>
    )
  }

  if (modo === 'cantando' && cancionActiva) {
    return (
      <Marco paso={0} total={3} onPanel={onPanel}>
        <div className="pantalla">
          <Tarjeta img="portada" emoji="🎵" grande onClick={() => !sonando && void cantar(cancionActiva)} />
          <p className="frase">{versoActual || cancionActiva.titulo}</p>
          <p className="frase-chica">🎶 Cantando juntos</p>

          <button className="boton fantasma" onClick={() => setModo('lista')} style={{ marginTop: 16 }}>
            ← Volver a la lista
          </button>
        </div>
      </Marco>
    )
  }

  return (
    <Marco paso={0} total={3} onPanel={onPanel}>
      <div className="pantalla" style={{ overflowY: 'auto', paddingBottom: 40 }}>
        <p className="frase">Pray & Sing</p>
        <p className="frase-chica">Oraciones y canciones para el grupo y el hogar</p>

        <p className="frase-chica" style={{ marginTop: 12, fontWeight: 'bold' }}>
          🕊️ Oraciones Católicas
        </p>
        <div className="fila" style={{ flexWrap: 'wrap', gap: 12, maxWidth: 640 }}>
          {ORACIONES.map((o) => (
            <div key={o.id} className="ficha" onClick={() => void rezar(o)} style={{ cursor: 'pointer' }}>
              <Tarjeta img={o.img} emoji={o.emoji} />
              <span className="frase-chica" style={{ fontSize: 12, maxWidth: 110 }}>
                {o.titulo}
              </span>
            </div>
          ))}
        </div>

        <p className="frase-chica" style={{ marginTop: 18, fontWeight: 'bold' }}>
          🎶 Canciones y Alabanzas
        </p>
        <div className="fila" style={{ flexWrap: 'wrap', gap: 12, maxWidth: 640 }}>
          {UNIDADES.map((u) => (
            <div key={u.id} className="ficha" onClick={() => void cantar(u.cancion)} style={{ cursor: 'pointer' }}>
              <Tarjeta img={u.frases[0]?.img ?? 'portada'} emoji="🎵" />
              <span className="frase-chica" style={{ fontSize: 12, maxWidth: 110 }}>
                {u.cancion.titulo}
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
