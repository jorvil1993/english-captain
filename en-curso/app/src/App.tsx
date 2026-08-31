import { useEffect, useRef, useState } from 'react'
import { prepararVoz } from './audio/voz'
import { useSesion } from './estado/Sesion'
import { Bienvenida, type SeccionMenu } from './pantallas/Bienvenida'
import { MyLittlePrayers } from './pantallas/MyLittlePrayers'
import { BibleFriends } from './pantallas/BibleFriends'
import { SingAndPraise } from './pantallas/SingAndPraise'
import { HolyThings } from './pantallas/HolyThings'
import { MinijuegosHub } from './pantallas/MinijuegosHub'
import { LightTheAltar } from './pantallas/minijuegos/LightTheAltar'
import { NoahsPairMatch } from './pantallas/minijuegos/NoahsPairMatch'
import { DressTheNativity } from './pantallas/minijuegos/DressTheNativity'
import { CreationTapBloom } from './pantallas/minijuegos/CreationTapBloom'
import { MorningNightBlessings } from './pantallas/minijuegos/MorningNightBlessings'
// Los cinco de movimiento: el dedo traza, arrastra, persigue, agita y tira.
import { TraceTheCross } from './pantallas/minijuegos/TraceTheCross'
import { LoavesAndFishes } from './pantallas/minijuegos/LoavesAndFishes'
import { GuardianAngelCatch } from './pantallas/minijuegos/GuardianAngelCatch'
import { CalmTheStorm } from './pantallas/minijuegos/CalmTheStorm'
import { RingTheBells } from './pantallas/minijuegos/RingTheBells'
import { Prayer } from './pantallas/Prayer'
import { Plan, type Actividad } from './pantallas/Plan'
import { Story } from './pantallas/Story'
import { MoveIt } from './pantallas/MoveIt'
import { Challenge } from './pantallas/Challenge'
import { SayIt } from './pantallas/SayIt'
import { TakeItHome } from './pantallas/TakeItHome'
import { Stop } from './pantallas/Stop'
import { Papas } from './pantallas/Papas'
import { CompuertaPapas } from './componentes/CompuertaPapas'

type Paso =
  | 'bienvenida'
  | 'menu-prayers'
  | 'menu-bible'
  | 'menu-sing'
  | 'menu-church'
  | 'minijuegos'
  | 'mj-altar'
  | 'mj-noah'
  | 'mj-nativity'
  | 'mj-creation'
  | 'mj-routine'
  | 'mj-trace'
  | 'mj-loaves'
  | 'mj-angel'
  | 'mj-storm'
  | 'mj-bells'
  | 'prayer'
  | 'plan'
  | Actividad
  | 'sayit'
  | 'takehome'
  | 'stop'

export function App() {
  const { unidad, repaso, registrarRespuesta, cerrarSesion } = useSesion()

  const [paso, setPaso] = useState<Paso>('bienvenida')
  const [hechas, setHechas] = useState<Actividad[]>([])
  const [panel, setPanel] = useState(false)
  const [mostrarCompuerta, setMostrarCompuerta] = useState(false)

  const marcador = useRef({ preguntas: 0, aciertos: 0, intentosVoz: 0 })

  useEffect(() => {
    void prepararVoz()
  }, [])

  const responder = (fraseId: string, acierto: boolean) => {
    marcador.current.preguntas += 1
    if (acierto) marcador.current.aciertos += 1
    registrarRespuesta(fraseId, acierto)
  }

  const terminarActividad = (a: Actividad) => {
    const nuevas = [...hechas, a]
    setHechas(nuevas)
    setPaso(nuevas.length >= 3 ? 'sayit' : 'plan')
  }

  if (panel) return <Papas onSalir={() => setPanel(false)} />

  const pedirPanel = () => setMostrarCompuerta(true)
  const aprobarPanel = () => {
    setMostrarCompuerta(false)
    setPanel(true)
  }

  const irAInicio = () => setPaso('bienvenida')
  const irAMinijuegos = () => setPaso('minijuegos')
  const oracionDelDia = new Date().getDate()

  const renderContenido = () => {
    switch (paso) {
      case 'bienvenida':
        return (
          <Bienvenida
            onEmpezar={() => setPaso('prayer')}
            onSeccion={(s: SeccionMenu) => setPaso(`menu-${s}` as Paso)}
            onMinijuegos={irAMinijuegos}
            onPanel={pedirPanel}
          />
        )

      case 'menu-prayers':
        return <MyLittlePrayers onVolver={irAInicio} onPanel={pedirPanel} />

      case 'menu-bible':
        return <BibleFriends onVolver={irAInicio} onPanel={pedirPanel} />

      case 'menu-sing':
        return <SingAndPraise onVolver={irAInicio} onPanel={pedirPanel} />

      case 'menu-church':
        return <HolyThings onVolver={irAInicio} onPanel={pedirPanel} />

      case 'minijuegos':
        return (
          <MinijuegosHub
            onElegir={(id) => setPaso(`mj-${id}` as Paso)}
            onVolver={irAInicio}
            onPanel={pedirPanel}
          />
        )

      case 'mj-altar':
        return <LightTheAltar onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-noah':
        return <NoahsPairMatch onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-nativity':
        return <DressTheNativity onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-creation':
        return <CreationTapBloom onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-routine':
        return <MorningNightBlessings onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-trace':
        return <TraceTheCross onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-loaves':
        return <LoavesAndFishes onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-angel':
        return <GuardianAngelCatch onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-storm':
        return <CalmTheStorm onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'mj-bells':
        return <RingTheBells onVolver={irAMinijuegos} onPanel={pedirPanel} />

      case 'prayer':
        return (
          <Prayer
            indice={oracionDelDia}
            onListo={() => setPaso('plan')}
            onPanel={pedirPanel}
            onInicio={irAInicio}
          />
        )

      case 'plan':
        return (
          <Plan
            hechas={hechas}
            onElegir={(a) => setPaso(a)}
            onPanel={pedirPanel}
            onInicio={irAInicio}
          />
        )

      case 'story':
        return (
          <Story
            unidad={unidad}
            onListo={() => terminarActividad('story')}
            onResponder={responder}
            onPanel={pedirPanel}
            onInicio={() => setPaso('plan')}
          />
        )

      case 'move':
        return (
          <MoveIt
            unidad={unidad}
            onListo={() => terminarActividad('move')}
            onPanel={pedirPanel}
            onInicio={() => setPaso('plan')}
          />
        )

      case 'challenge':
        return (
          <Challenge
            unidad={unidad}
            repaso={repaso}
            onListo={() => terminarActividad('challenge')}
            onResponder={responder}
            onPanel={pedirPanel}
            onInicio={() => setPaso('plan')}
          />
        )

      case 'sayit':
        return (
          <SayIt
            unidad={unidad}
            onIntento={() => {
              marcador.current.intentosVoz += 1
            }}
            onListo={() => setPaso('takehome')}
            onPanel={pedirPanel}
            onInicio={irAInicio}
          />
        )

      case 'takehome':
        return (
          <TakeItHome
            unidad={unidad}
            onListo={() => {
              cerrarSesion({ ...marcador.current })
              setPaso('stop')
            }}
            onPanel={pedirPanel}
            onInicio={irAInicio}
          />
        )

      case 'stop':
        return <Stop />
    }
  }

  return (
    <>
      {mostrarCompuerta && (
        <CompuertaPapas
          onAprobado={aprobarPanel}
          onCerrar={() => setMostrarCompuerta(false)}
        />
      )}
      {renderContenido()}
    </>
  )
}
