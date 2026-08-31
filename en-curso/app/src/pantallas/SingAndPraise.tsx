import { useEffect, useRef, useState } from 'react'
import { CANCIONES_ALABANZA, type CancionAlabanza, type VocabularioCancion } from '../datos/catolico'
import { decir, esperar } from '../audio/voz'
import { campana, estrellitas, pandereta, toque } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

export function SingAndPraise({
  onPanel,
  onInicio,
  cancionId,
  onListo,
}: {
  onPanel: () => void
  onInicio?: () => void
  /** Si viene, se salta el menú de elegir canción y arranca directo en
   *  esta — así se usa como parada del recorrido diario. */
  cancionId?: string
  /** Si está presente, al terminar el vocabulario llama a esto en vez de
   *  volver al menú interno. Sin esto (Modo Calma), comportamiento igual
   *  que antes: menú libre de las 3 canciones, sin fin. */
  onListo?: () => void
}) {
  const [cancion, setCancion] = useState<CancionAlabanza | null>(() =>
    cancionId ? CANCIONES_ALABANZA.find((c) => c.id === cancionId) ?? null : null,
  )
  const [fase, setFase] = useState<'escuchando' | 'vocabulario'>('escuchando')
  const [progreso, setProgreso] = useState(0)
  const [versoActual, setVersoActual] = useState(0)
  const [palabraActiva, setPalabraActiva] = useState<string | null>(null)
  const [instrumentoActivo, setInstrumentoActivo] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animacionRef = useRef<number | null>(null)

  // Iniciar canción
  useEffect(() => {
    if (!cancion) return
    setFase('escuchando')
    setProgreso(0)
    setVersoActual(0)
    setPalabraActiva(null)

    const audio = new Audio(cancion.archivoAudio)
    audioRef.current = audio

    const actualizar = () => {
      if (!audio) return
      const p = (audio.currentTime / (audio.duration || 20)) * 100
      setProgreso(p)

      const totalVersos = cancion.versos.length
      const idx = Math.min(Math.floor((audio.currentTime / (audio.duration || 20)) * totalVersos), totalVersos - 1)
      setVersoActual(idx)

      if (!audio.paused && !audio.ended) {
        animacionRef.current = requestAnimationFrame(actualizar)
      }
    }

    audio.onplay = () => {
      animacionRef.current = requestAnimationFrame(actualizar)
    }

    audio.onended = () => {
      setProgreso(100)
      void pasarAVocabulario()
    }

    void audio.play().catch(() => {})

    return () => {
      audio.pause()
      if (animacionRef.current) cancelAnimationFrame(animacionRef.current)
    }
  }, [cancion])

  const pasarAVocabulario = async () => {
    await esperar(400)
    setFase('vocabulario')
    await decir("Let's learn the song words!")
  }

  const tocarInstrumento = (tipo: string, fn: () => void) => {
    setInstrumentoActivo(tipo)
    fn()
    setTimeout(() => setInstrumentoActivo(null), 300)
  }

  const tocarCampana = () => tocarInstrumento('campana', campana)
  const tocarPandereta = () => tocarInstrumento('pandereta', pandereta)
  const tocarEstrella = () => tocarInstrumento('estrella', estrellitas)

  const tocarPalabra = async (v: VocabularioCancion) => {
    toque()
    setPalabraActiva(v.id)
    await decir(v.audio)
  }

  const terminarVocabulario = async () => {
    estrellitas()
    await decir('Good job! God loves you!')
    await esperar(500)
    if (onListo) {
      onListo()
      return
    }
    setCancion(null)
  }

  if (!cancion) {
    return (
      <Marco paso={0} total={0} onPanel={onPanel} onInicio={onInicio}>
        <div className="pantalla">
          <p className="frase">Sing & Praise</p>
          <p className="frase-chica">3 Real Catholic Songs</p>

          <div className="fila" style={{ flexWrap: 'wrap' }}>
            {CANCIONES_ALABANZA.map((c) => (
              <div key={c.id} className="ficha">
                <Tarjeta
                  img={c.img}
                  emoji={c.emoji}
                  onClick={() => setCancion(c)}
                />
                <span className="frase-chica" style={{ fontWeight: 700 }}>
                  {c.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Marco>
    )
  }

  return (
    <Marco
      paso={fase === 'escuchando' ? 1 : 2}
      total={2}
      onPanel={onPanel}
      onInicio={
        onListo
          ? undefined
          : () => {
              if (audioRef.current) audioRef.current.pause()
              setCancion(null)
            }
      }
    >
      <div className="pantalla" style={{ justifyContent: 'flex-start', paddingTop: 10 }}>
        {fase === 'escuchando' ? (
          <>
            <p className="frase-chica" style={{ opacity: 0.7, margin: 0 }}>
              {cancion.titulo}
            </p>

            <p
              className="frase"
              style={{
                fontSize: 'clamp(18px, 3.8vmin, 26px)',
                minHeight: '2.4em',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                margin: '6px 0',
              }}
            >
              🎵 "{cancion.versos[versoActual]}"
            </p>

            {/* Barra de progreso de la canción */}
            <div
              style={{
                width: 'min(85vw, 360px)',
                height: 8,
                background: 'var(--fondo-2)',
                borderRadius: 4,
                overflow: 'hidden',
                marginTop: 4,
              }}
            >
              <div
                style={{
                  width: `${progreso}%`,
                  height: '100%',
                  background: 'var(--oro)',
                  transition: 'width 250ms linear',
                }}
              />
            </div>

            <p className="frase-chica" style={{ marginTop: 2 }}>
              🎵 Play the instruments!
            </p>

            {/* Instrumentos táctiles interactivos */}
            <div className="fila" style={{ marginTop: 2 }}>
              <button
                className={`boton ${instrumentoActivo === 'campana' ? 'elegida' : ''}`}
                onClick={tocarCampana}
                style={{ fontSize: 30, padding: '12px 20px', borderRadius: 24 }}
                title="Campana"
              >
                🔔
              </button>
              <button
                className={`boton ${instrumentoActivo === 'pandereta' ? 'elegida' : ''}`}
                onClick={tocarPandereta}
                style={{ fontSize: 30, padding: '12px 20px', borderRadius: 24 }}
                title="Pandereta"
              >
                🪘
              </button>
              <button
                className={`boton ${instrumentoActivo === 'estrella' ? 'elegida' : ''}`}
                onClick={tocarEstrella}
                style={{ fontSize: 30, padding: '12px 20px', borderRadius: 24 }}
                title="Estrellas"
              >
                ✨
              </button>
            </div>

            <button
              className="boton fantasma"
              onClick={() => {
                if (audioRef.current) audioRef.current.pause()
                setFase('vocabulario')
              }}
              style={{ marginTop: 6, fontSize: 14 }}
            >
              Learn Words ▶
            </button>
          </>
        ) : (
          <>
            {/* Fase 2: Vocabulario en cuadrícula 2x2 compacta sin cortes ni scroll */}
            <p className="frase" style={{ fontSize: 'clamp(18px, 3.6vmin, 24px)', margin: '0 0 2px 0' }}>
              Song Words
            </p>
            <p className="frase-chica" style={{ margin: '0 0 8px 0' }}>
              Tap to listen and repeat!
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))',
                gap: 'clamp(8px, 2vmin, 14px)',
                maxWidth: 'min(92vw, 340px)',
                width: '100%',
              }}
            >
              {cancion.vocabulario.map((v) => (
                <div
                  key={v.id}
                  onClick={() => void tocarPalabra(v)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <div
                    style={{
                      width: 'clamp(80px, 18vmin, 100px)',
                      height: 'clamp(80px, 18vmin, 100px)',
                    }}
                  >
                    <Tarjeta
                      img={v.img}
                      emoji={v.emoji}
                      elegida={palabraActiva === v.id}
                    />
                  </div>
                  <span
                    className="frase-chica"
                    style={{ fontWeight: 800, marginTop: 4, textAlign: 'center' }}
                  >
                    {v.palabra}
                  </span>
                </div>
              ))}
            </div>

            <Boton invita onClick={() => void terminarVocabulario()} style={{ marginTop: 10 }}>
              ✔ I did it!
            </Boton>
          </>
        )}
      </div>
    </Marco>
  )
}
