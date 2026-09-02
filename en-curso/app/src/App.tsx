import { useEffect, useRef, useState, type ReactNode } from 'react'
import { prepararVoz } from './audio/voz'
import { hoyISO, useSesion } from './estado/Sesion'
import { planDeOracionDeHoy, type PlanDeOracion } from './datos/oraciones-motor'
import { frasesConocidasHasta, frasesDeLeccion, leccionDeHoy, type LeccionCurricular } from './datos/curriculo'
import { generarRecorridoDeHoy, type ItemRecorrido, type Parada } from './datos/recorrido'
import { renderMinijuegoDeHoy } from './pantallas/registroMinijuegos'
import { Bienvenida } from './pantallas/Bienvenida'
import { Prayer } from './pantallas/Prayer'
import { Story } from './pantallas/Story'
import { MoveIt } from './pantallas/MoveIt'
import { Challenge } from './pantallas/Challenge'
import { SayIt } from './pantallas/SayIt'
import { TakeItHome } from './pantallas/TakeItHome'
import { Stop } from './pantallas/Stop'
import { RinconCatolico, type SeccionRincon } from './pantallas/RinconCatolico'
import { CuentosExplorer } from './pantallas/CuentosExplorer'
import { OracionesYCantos } from './pantallas/OracionesYCantos'
import { TableroVocabulario } from './pantallas/TableroVocabulario'
import { PalabrasDelDia } from './pantallas/PalabrasDelDia'
import { EcoOracion } from './pantallas/EcoOracion'
import { BibleFriends } from './pantallas/BibleFriends'
import { HolyThings } from './pantallas/HolyThings'
import { MyLittlePrayers } from './pantallas/MyLittlePrayers'
import { SingAndPraise } from './pantallas/SingAndPraise'
import { Papas } from './pantallas/Papas'
import { CompuertaPapas } from './componentes/CompuertaPapas'

type ModoCalma = 'cerrado' | 'rincon'

export function App() {
  const {
    unidad,
    repaso,
    registrarRespuesta,
    registrarVerso,
    cerrarSesion,
    diasEnUnidad,
    oracionIndice,
    aveMariaVersoIndice,
    memoria,
  } = useSesion()

  const [empezado, setEmpezado] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [panel, setPanel] = useState(false)
  const [mostrarCompuerta, setMostrarCompuerta] = useState(false)
  const [modoCalma, setModoCalma] = useState<ModoCalma>('cerrado')
  const [seccionRincon, setSeccionRincon] = useState<SeccionRincon | null>(null)

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
  const [leccion, setLeccion] = useState<LeccionCurricular | null>(null)
  const [continuando, setContinuando] = useState(false)

  const prepararSiguienteLeccion = () => {
    const leccionDeEstaSesion = leccionDeHoy(unidad.id, diasEnUnidad)
    setLeccion(leccionDeEstaSesion)
    setRecorrido(generarRecorridoDeHoy(leccionDeEstaSesion))
    setPlanOracion(planDeOracionDeHoy({ oracionIndice, oracionVersoIndice: aveMariaVersoIndice, memoria, hoy: hoyISO() }))
    setCursor(0)
    setEmpezado(true)
  }

  const empezar = () => prepararSiguienteLeccion()

  // Una lección termina con una misión, no con un candado. Cuando José quiere
  // seguir, la memoria ya se guardó y este efecto prepara inmediatamente el
  // siguiente tramo de la misma línea: nuevas palabras mientras queden y
  // después repaso espaciado del ciclo completo.
  useEffect(() => {
    if (!continuando) return
    prepararSiguienteLeccion()
    setContinuando(false)
    // `continuando` se activa junto con el guardado en TakeItHome. React
    // entrega aquí los valores ya actualizados de unidad, lección y oración.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuando, unidad.id, diasEnUnidad, aveMariaVersoIndice])

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

  const renderParada = (p: Parada, onListo: () => void): ReactNode => {
    // El guard de renderContenido asegura que existe antes de llegar aquí.
    const frasesDeHoy = frasesDeLeccion(unidad, leccion!)
    const frasesConocidas = frasesConocidasHasta(unidad, leccion!)
    switch (p.tipo) {
      case 'oracion':
        // `renderParada` solo se llama después de confirmar que `planOracion`
        // no es null (ver el guard en `renderContenido`); TypeScript no puede
        // seguir esa garantía a través del cierre, de ahí el `!`.
        return (
          <Prayer
            plan={planOracion!}
            // El recorrido siempre trabaja el Ave María, aunque papá haya
            // escuchado otra oración en el rincón libre anteriormente.
            onVersoMostrado={(i) => registrarVerso(planOracion!.oracion.id, i)}
            onListo={onListo}
            onPanel={pedirPanel}
          />
        )
      case 'vocabulario':
        return <PalabrasDelDia frases={frasesDeHoy} onListo={onListo} onPanel={pedirPanel} />
      case 'eco-oracion':
        return <EcoOracion plan={planOracion!} onListo={onListo} onPanel={pedirPanel} />
      case 'cuento':
        return (
          <Story
            unidad={unidad}
            escenasPermitidas={leccion!.escenas}
            frasesDisponibles={frasesConocidas}
            onListo={onListo}
            onResponder={responder}
            onPanel={pedirPanel}
          />
        )
      case 'move':
        return <MoveIt frases={frasesDeHoy} onListo={onListo} onPanel={pedirPanel} />
      case 'minijuego':
        return renderMinijuegoDeHoy(p.id, { onPanel: pedirPanel, avanzar: onListo })
      case 'challenge':
        return (
          <Challenge
            frases={frasesDeHoy}
            repaso={repaso}
            onListo={onListo}
            onResponder={responder}
            onPanel={pedirPanel}
          />
        )
      case 'sayit':
        return (
          <SayIt
            frases={frasesDeHoy}
            onIntento={() => {
              marcador.intentosVoz += 1
            }}
            onListo={onListo}
            onPanel={pedirPanel}
          />
        )
      case 'takehome':
        // La última acción de la lección sale de la pantalla y se vuelve la
        // misión con papá/mamá: nada se "aprende" sin un uso posterior.
        const fraseMision = frasesDeHoy.at(-1) ?? frasesDeHoy[0]
        return (
          <TakeItHome
            unidad={unidad}
            mision={fraseMision ? { en: fraseMision.ordenEn, es: fraseMision.es, emoji: fraseMision.emoji, img: fraseMision.img } : undefined}
            onListo={() => {
              const datosDeEstaLeccion = { ...marcador }
              marcador.preguntas = 0
              marcador.aciertos = 0
              marcador.intentosVoz = 0
              cerrarSesion(datosDeEstaLeccion)
              setContinuando(true)
            }}
            onPanel={pedirPanel}
          />
        )
    }
  }

  const renderModoCalma = () => {
    const volverAlRincon = () => setSeccionRincon(null)
    if (seccionRincon === 'cuentos') {
      return <CuentosExplorer onVolver={volverAlRincon} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'biblia') {
      return <BibleFriends onInicio={volverAlRincon} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'oraciones') {
      return <OracionesYCantos onVolver={volverAlRincon} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'oracioncitas') {
      return <MyLittlePrayers onVolver={volverAlRincon} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'alabanza') {
      return <SingAndPraise onInicio={volverAlRincon} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'objetos') {
      return <HolyThings onVolver={volverAlRincon} onPanel={pedirPanel} />
    }
    if (seccionRincon === 'tablero') {
      return <TableroVocabulario onVolver={volverAlRincon} onPanel={pedirPanel} />
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

    // El rincón sigue disponible si un adulto lo abre para un grupo de oración
    // o un rato tranquilo; no es una salida que el recorrido de José le pida
    // elegir ni una consecuencia de haber terminado una lección.
    if (modoCalma !== 'cerrado') return renderModoCalma()

    if (!empezado || !recorrido || !planOracion || !leccion) {
      return <Bienvenida onEmpezar={empezar} onPanel={pedirPanel} />
    }

    const item = recorrido[cursor]
    if (!item) return <Stop onContinuar={prepararSiguienteLeccion} />

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
