import { useEffect, useRef, useState, type ReactNode } from 'react'
import { prepararVoz } from './audio/voz'
import { hoyISO, useSesion } from './estado/Sesion'
import { CANCIONES_ALABANZA, HISTORIAS_BIBLICAS } from './datos/catolico'
import { planDeOracionDeHoy, type PlanDeOracion } from './datos/oraciones-motor'
import { generarRecorridoDeHoy, type IdMinijuego, type ItemRecorrido, type Parada, type TipoVariedad } from './datos/recorrido'
import { renderMinijuegoDeHoy, renderMinijuegoLibre } from './pantallas/registroMinijuegos'
import { Bienvenida } from './pantallas/Bienvenida'
import { Prayer } from './pantallas/Prayer'
import { Plan } from './pantallas/Plan'
import { Story } from './pantallas/Story'
import { MoveIt } from './pantallas/MoveIt'
import { Challenge } from './pantallas/Challenge'
import { SayIt } from './pantallas/SayIt'
import { TakeItHome } from './pantallas/TakeItHome'
import { Stop } from './pantallas/Stop'
import { BibleFriends } from './pantallas/BibleFriends'
import { SingAndPraise } from './pantallas/SingAndPraise'
import { HolyThings } from './pantallas/HolyThings'
import { MyLittlePrayers } from './pantallas/MyLittlePrayers'
import { CancionUnidad } from './pantallas/CancionUnidad'
import { RinconCatolico, type SeccionRincon } from './pantallas/RinconCatolico'
import { CuentosExplorer } from './pantallas/CuentosExplorer'
import { OracionesYCantos } from './pantallas/OracionesYCantos'
import { TableroVocabulario } from './pantallas/TableroVocabulario'
import { MinijuegosHub } from './pantallas/MinijuegosHub'
import { Papas } from './pantallas/Papas'
import { CompuertaPapas } from './componentes/CompuertaPapas'

type ModoCalma = 'cerrado' | 'rincon' | 'minijuegos'

export function App() {
  const {
    unidad,
    repaso,
    registrarRespuesta,
    registrarVerso,
    cerrarSesion,
    diaRecorridoIndice,
    oracionIndice,
    oracionVersoIndice,
    oracionActual,
    memoria,
    yaJugoHoy,
    modoLibreActivo,
  } = useSesion()

  const [empezado, setEmpezado] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [hechasElegible, setHechasElegible] = useState<Parada[]>([])
  const [paradaElegida, setParadaElegida] = useState<Parada | null>(null)
  const [panel, setPanel] = useState(false)
  const [mostrarCompuerta, setMostrarCompuerta] = useState(false)
  const [modoCalma, setModoCalma] = useState<ModoCalma>('cerrado')
  const [seccionRincon, setSeccionRincon] = useState<SeccionRincon | null>(null)
  const [minijuegoLibre, setMinijuegoLibre] = useState<IdMinijuego | null>(null)

  const marcador = useRef({ preguntas: 0, aciertos: 0, intentosVoz: 0 }).current

  useEffect(() => {
    void prepararVoz()
  }, [])

  // El recorrido y el plan de oración de hoy se calculan UNA sola vez, recién
  // cuando José toca "Let's play!" — no antes. Si se calcularan en el primer
  // render de App, se congelarían con los valores de AYER: el efecto de
  // Sesion.tsx que rota `diaRecorridoIndice`/`oracionIndice` corre después
  // del primer render, no antes. Y si dependieran de `memoria` en vivo,
  // terminar un repaso a mitad de sesión podría recalcularlos y cortar lo
  // que está en curso.
  const [recorrido, setRecorrido] = useState<ItemRecorrido[] | null>(null)
  const [planOracion, setPlanOracion] = useState<PlanDeOracion | null>(null)

  const empezar = () => {
    setRecorrido(generarRecorridoDeHoy({ diaRecorridoIndice }))
    setPlanOracion(planDeOracionDeHoy({ oracionIndice, oracionVersoIndice, memoria, hoy: hoyISO() }))
    setEmpezado(true)
  }

  const pedirPanel = () => setMostrarCompuerta(true)
  const aprobarPanel = () => {
    setMostrarCompuerta(false)
    setPanel(true)
  }

  const responder = (fraseId: string, acierto: boolean) => {
    marcador.preguntas += 1
    if (acierto) marcador.aciertos += 1
    registrarRespuesta(fraseId, acierto)
  }

  const avanzar = () => setCursor((c) => c + 1)

  const elegir = (p: Parada) => {
    setHechasElegible((prev) => [...prev, p])
    setParadaElegida(p)
  }

  const terminarParadaElegida = () => {
    setParadaElegida(null)
    // Solo se llama estando dentro del recorrido (ver el guard en
    // `renderContenido`), así que `recorrido` ya no es null acá.
    const item = recorrido![cursor] as { modo: 'elegible'; paradas: Parada[] }
    if (hechasElegible.length >= item.paradas.length) {
      setHechasElegible([])
      avanzar()
    }
  }

  const renderVariedad = (v: TipoVariedad, onListo: () => void): ReactNode => {
    switch (v) {
      case 'story':
        return <Story unidad={unidad} onListo={onListo} onResponder={responder} onPanel={pedirPanel} />
      case 'bible': {
        const historia = HISTORIAS_BIBLICAS[diaRecorridoIndice % HISTORIAS_BIBLICAS.length]
        return <BibleFriends historiaId={historia.id} onListo={onListo} onPanel={pedirPanel} />
      }
      case 'sing':
        if (diaRecorridoIndice % 2 === 0) {
          return <CancionUnidad unidad={unidad} onListo={onListo} onPanel={pedirPanel} />
        }
        return (
          <SingAndPraise
            cancionId={CANCIONES_ALABANZA[diaRecorridoIndice % CANCIONES_ALABANZA.length].id}
            onListo={onListo}
            onPanel={pedirPanel}
          />
        )
      case 'holy':
        return <HolyThings onVolver={onListo} onPanel={pedirPanel} />
      case 'tablero':
        return <TableroVocabulario onVolver={onListo} onListo={onListo} onPanel={pedirPanel} />
      case 'peques':
        return <MyLittlePrayers onVolver={onListo} onPanel={pedirPanel} />
    }
  }

  const renderParada = (p: Parada, onListo: () => void): ReactNode => {
    switch (p.tipo) {
      case 'oracion':
        // `renderParada` solo se llama después de confirmar que `planOracion`
        // no es null (ver el guard en `renderContenido`); TypeScript no puede
        // seguir esa garantía a través del cierre, de ahí el `!`.
        return (
          <Prayer
            plan={planOracion!}
            onVersoMostrado={(i) => registrarVerso(oracionActual.id, i)}
            onListo={onListo}
            onPanel={pedirPanel}
          />
        )
      case 'variedad':
        return renderVariedad(p.variante, onListo)
      case 'move':
        return <MoveIt unidad={unidad} onListo={onListo} onPanel={pedirPanel} />
      case 'minijuego':
        return renderMinijuegoDeHoy(p.id, { onPanel: pedirPanel, avanzar: onListo })
      case 'challenge':
        return (
          <Challenge
            unidad={unidad}
            repaso={repaso}
            onListo={onListo}
            onResponder={responder}
            onPanel={pedirPanel}
          />
        )
      case 'sayit':
        return (
          <SayIt
            unidad={unidad}
            onIntento={() => {
              marcador.intentosVoz += 1
            }}
            onListo={onListo}
            onPanel={pedirPanel}
          />
        )
      case 'takehome':
        return (
          <TakeItHome
            unidad={unidad}
            onListo={() => {
              cerrarSesion({ ...marcador })
              onListo()
            }}
            onPanel={pedirPanel}
          />
        )
      case 'stop':
        return <Stop />
    }
  }

  const renderModoCalma = () => {
    if (modoCalma === 'minijuegos') {
      if (minijuegoLibre) {
        return renderMinijuegoLibre(minijuegoLibre, {
          onPanel: pedirPanel,
          onVolver: () => setMinijuegoLibre(null),
        })
      }
      return (
        <MinijuegosHub
          onElegir={(id) => setMinijuegoLibre(id)}
          onVolver={() => setModoCalma('cerrado')}
          onPanel={pedirPanel}
        />
      )
    }

    // modoCalma === 'rincon'
    if (seccionRincon === 'cuentos') {
      return <CuentosExplorer onVolver={() => setSeccionRincon(null)} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'oraciones') {
      return <OracionesYCantos onVolver={() => setSeccionRincon(null)} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'tablero') {
      return <TableroVocabulario onVolver={() => setSeccionRincon(null)} onPanel={pedirPanel} />
    }
    return (
      <RinconCatolico
        onElegir={setSeccionRincon}
        onVolver={() => setModoCalma('cerrado')}
        onPanel={pedirPanel}
      />
    )
  }

  const renderContenido = () => {
    if (panel) {
      return <Papas onSalir={() => setPanel(false)} onEntrarModoCalma={() => { setPanel(false); setModoCalma('rincon') }} />
    }

    if (yaJugoHoy) {
      if (modoCalma !== 'cerrado') return renderModoCalma()
      return (
        <>
          <Stop />
          {modoLibreActivo && (
            <div style={{ position: 'fixed', bottom: 16, left: 0, right: 0, display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="boton fantasma" onClick={() => setModoCalma('rincon')}>
                🙏 Catholic Corner
              </button>
              <button className="boton fantasma" onClick={() => setModoCalma('minijuegos')}>
                🎮 Minigames
              </button>
            </div>
          )}
        </>
      )
    }

    if (!empezado || !recorrido || !planOracion) {
      return <Bienvenida onEmpezar={empezar} onPanel={pedirPanel} />
    }

    const item = recorrido[cursor]
    if (!item) return <Stop />

    if (item.modo === 'elegible') {
      if (paradaElegida) return renderParada(paradaElegida, terminarParadaElegida)
      return <Plan paradas={item.paradas} hechas={hechasElegible} onElegir={elegir} onPanel={pedirPanel} />
    }

    return renderParada(item.parada, avanzar)
  }

  return (
    <>
      {mostrarCompuerta && (
        <CompuertaPapas onAprobado={aprobarPanel} onCerrar={() => setMostrarCompuerta(false)} />
      )}
      {renderContenido()}
    </>
  )
}
