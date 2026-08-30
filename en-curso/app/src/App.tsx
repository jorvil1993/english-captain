import { useEffect, useRef, useState } from 'react'
import { prepararVoz } from './audio/voz'
import { useSesion } from './estado/Sesion'
import { Bienvenida } from './pantallas/Bienvenida'
import { Prayer } from './pantallas/Prayer'
import { Plan, type Actividad } from './pantallas/Plan'
import { Story } from './pantallas/Story'
import { MoveIt } from './pantallas/MoveIt'
import { Challenge } from './pantallas/Challenge'
import { SayIt } from './pantallas/SayIt'
import { TakeItHome } from './pantallas/TakeItHome'
import { Stop } from './pantallas/Stop'
import { Papas } from './pantallas/Papas'

type Paso = 'bienvenida' | 'prayer' | 'plan' | Actividad | 'sayit' | 'takehome' | 'stop'

/**
 * La sesión completa, en el orden que manda la investigación:
 *
 *   PRAYER → [ EL PLAN: José elige el orden de las tres ] → SAY IT →
 *   TAKE IT HOME → STOP
 *
 * Lo fijo y lo elegible están separados a propósito. Qué se hace no se
 * negocia (es el método); en qué orden, lo decide él entero. Un colérico que
 * no puede decidir nada testea el límite hasta romperlo; uno que decide lo que
 * puede decidir, obedece lo demás.
 */
export function App() {
  const { unidad, repaso, registrarRespuesta, cerrarSesion } = useSesion()

  const [paso, setPaso] = useState<Paso>('bienvenida')
  const [hechas, setHechas] = useState<Actividad[]>([])
  const [panel, setPanel] = useState(false)

  // Contadores de la sesión de hoy. Se vuelcan al cerrar.
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

  const abrirPanel = () => setPanel(true)
  const numeroPaso = 1 + hechas.length
  // Una oración distinta cada día, siempre en el mismo orden. La repetición es
  // lo que hace que a los 5 años ya se las sepa sin habérselas estudiado.
  const oracionDelDia = new Date().getDate()

  switch (paso) {
    case 'bienvenida':
      return <Bienvenida onEmpezar={() => setPaso('prayer')} onPanel={abrirPanel} />

    case 'prayer':
      return <Prayer indice={oracionDelDia} onListo={() => setPaso('plan')} onPanel={abrirPanel} />

    case 'plan':
      return <Plan hechas={hechas} onElegir={(a) => setPaso(a)} onPanel={abrirPanel} />

    case 'story':
      return (
        <Story
          unidad={unidad}
          paso={numeroPaso}
          onListo={() => terminarActividad('story')}
          onResponder={responder}
          onPanel={abrirPanel}
        />
      )

    case 'move':
      return <MoveIt unidad={unidad} paso={numeroPaso} onListo={() => terminarActividad('move')} onPanel={abrirPanel} />

    case 'challenge':
      return (
        <Challenge
          unidad={unidad}
          repaso={repaso}
          paso={numeroPaso}
          onListo={() => terminarActividad('challenge')}
          onResponder={responder}
          onPanel={abrirPanel}
        />
      )

    case 'sayit':
      return (
        <SayIt
          unidad={unidad}
          paso={4}
          onIntento={() => {
            marcador.current.intentosVoz += 1
          }}
          onListo={() => setPaso('takehome')}
          onPanel={abrirPanel}
        />
      )

    case 'takehome':
      return (
        <TakeItHome
          unidad={unidad}
          paso={5}
          onListo={() => {
            cerrarSesion({ ...marcador.current })
            setPaso('stop')
          }}
          onPanel={abrirPanel}
        />
      )

    case 'stop':
      return <Stop />
  }
}
