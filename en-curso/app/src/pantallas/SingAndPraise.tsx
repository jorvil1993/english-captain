import { useEffect, useRef, useState } from 'react'
import { CANCIONES_ALABANZA, type CancionAlabanza, type VocabularioCancion } from '../datos/catolico'
import { decir, esperar } from '../audio/voz'
import { campanaIglesia, estrellitas, pandereta, toque } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Boton } from '../componentes/Boton'
import { Marco } from '../componentes/Marco'

type FaseCancion = 'escuchando' | 'vocabulario'

export function SingAndPraise({ onVolver, onPanel }: { onVolver: () => void; onPanel: () => void }) {
  const [cancion, setCancion] = useState<CancionAlabanza | null>(null)
  const [fase, setFase] = useState<FaseCancion>('escuchando')
  const [progreso, setProgreso] = useState(0)
  const [instrumentoActivo, setInstrumentoActivo] = useState<string | null>(null)
  const [palabraActiva, setPalabraActiva] = useState<string | null>(null)
  const [reproduciendo, setReproduciendo] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!cancion) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      return
    }

    setFase('escuchando')
    setProgreso(0)
    setReproduciendo(true)
    setPalabraActiva(null)

    const audio = new Audio(cancion.archivoAudio)
    audioRef.current = audio

    const alProgreso = () => {
      if (audio.duration) {
        setProgreso(Math.min(100, Math.round((audio.currentTime / audio.duration) * 100)))
      }
    }

    const alTerminar = () => {
      setReproduciendo(false)
      setFase('vocabulario')
      estrellitas()
      void decir('Learn the words!')
    }

    audio.addEventListener('timeupdate', alProgreso)
    audio.addEventListener('ended', alTerminar)

    void audio.play().catch(() => {
      setReproduciendo(false)
    })

    return () => {
      audio.removeEventListener('timeupdate', alProgreso)
      audio.removeEventListener('ended', alTerminar)
      audio.pause()
    }
  }, [cancion])

  const tocarCampana = () => {
    setInstrumentoActivo('campana')
    campanaIglesia()
    setTimeout(() => setInstrumentoActivo(null), 300)
  }

  const tocarPandereta = () => {
    setInstrumentoActivo('pandereta')
    pandereta()
    setTimeout(() => setInstrumentoActivo(null), 300)
  }

  const tocarEstrella = () => {
    setInstrumentoActivo('estrella')
    estrellitas()
    setTimeout(() => setInstrumentoActivo(null), 300)
  }

  const tocarPalabra = async (v: VocabularioCancion) => {
    toque()
    setPalabraActiva(v.id)
    await decir(v.palabra)
    await esperar(300)
    await decir(v.audio)
  }

  const terminarVocabulario = async () => {
    estrellitas()
    await decir('Good job! God loves you!')
    await esperar(500)
    setCancion(null)
  }

  if (!cancion) {
    return (
      <Marco paso={0} total={0} onPanel={onPanel} onInicio={onVolver}>
        <div className="pantalla">
          <p className="frase">Sing & Praise</p>
          <p className="frase-chica">3 Real Catholic Songs (20s)</p>

          <div className="fila" style={{ flexWrap: 'wrap' }}>
            {CANCIONES_ALABANZA.map((c) => (
              <div key={c.id} className="ficha">
                <Tarjeta
                  img=""
                  emoji={c.emoji}
                  onClick={() => setCancion(c)}
                />
                <span className="frase-chica">{c.titulo}</span>
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
      onInicio={() => {
        if (audioRef.current) audioRef.current.pause()
        setCancion(null)
      }}
    >
      <div className="pantalla">
        <p className="frase-chica" style={{ opacity: 0.7 }}>
          🎵 {cancion.titulo}
        </p>

        {fase === 'escuchando' ? (
          <>
            {/* Animación del disco y canción */}
            <div
              className="tarjeta tarjeta-grande"
              style={{
                background: 'radial-gradient(circle at center, #ffffff 30%, #fef3c7 100%)',
                boxShadow: reproduciendo ? '0 0 30px rgba(245, 158, 11, 0.6)' : 'var(--sombra)',
              }}
            >
              <span className="emoji">{cancion.emoji}</span>
            </div>

            {/* Barra de progreso musical (20 segundos) */}
            <div
              style={{
                width: 'min(85vw, 340px)',
                height: 10,
                background: 'var(--fondo-2)',
                borderRadius: 5,
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
            {/* Fase de Aprendizaje de Vocabulario de la Canción */}
            <p className="frase" style={{ fontSize: 'clamp(20px, 4vmin, 26px)' }}>
              Song Words
            </p>
            <p className="frase-chica">Tap to listen and repeat!</p>

            <div className="fila" style={{ flexWrap: 'wrap', maxWidth: 'min(90vw, 420px)' }}>
              {cancion.vocabulario.map((v) => (
                <div key={v.id} className="ficha">
                  <Tarjeta
                    img={v.img}
                    emoji={v.emoji}
                    elegida={palabraActiva === v.id}
                    onClick={() => void tocarPalabra(v)}
                  />
                  <span className="frase-chica" style={{ fontWeight: 700 }}>
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
