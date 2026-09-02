import type { ReactNode } from 'react'
import type { IdMinijuego } from '../datos/recorrido'
import { ChampionsOfJesus } from './minijuegos/ChampionsOfJesus'
import { LightTheAltar } from './minijuegos/LightTheAltar'
import { NoahsPairMatch } from './minijuegos/NoahsPairMatch'
import { DressTheNativity } from './minijuegos/DressTheNativity'
import { CreationTapBloom } from './minijuegos/CreationTapBloom'
import { MorningNightBlessings } from './minijuegos/MorningNightBlessings'
import { TraceTheCross } from './minijuegos/TraceTheCross'
import { LoavesAndFishes } from './minijuegos/LoavesAndFishes'
import { GuardianAngelCatch } from './minijuegos/GuardianAngelCatch'
import { CalmTheStorm } from './minijuegos/CalmTheStorm'
import { RingTheBells } from './minijuegos/RingTheBells'

/**
 * El minijuego de hoy, como parada del recorrido: sin 🏠 (nunca se pasa
 * `onInicio`, así que Marco no lo muestra) y avanza sola a la siguiente
 * parada al terminar. 9 de los 11 ya avanzan solos vía `onVolver`; Champions
 * of Jesus y Morning/Night Blessings tienen varios sub-modos y avanzan vía
 * `onListo` recién cuando José ya jugó todos — ver esos dos archivos.
 *
 * Los minijuegos solo se juegan acá, dentro del recorrido: no hay menú de
 * juego libre. Cada uno tiene su lección asignada en `curriculo.ts`.
 */
export function renderMinijuegoDeHoy(
  id: IdMinijuego,
  { onPanel, avanzar }: { onPanel: () => void; avanzar: () => void },
): ReactNode {
  switch (id) {
    case 'champions':
      return <ChampionsOfJesus onPanel={onPanel} onListo={avanzar} />
    case 'routine':
      return <MorningNightBlessings onPanel={onPanel} onListo={avanzar} />
    case 'altar':
      return <LightTheAltar onVolver={avanzar} onPanel={onPanel} />
    case 'noah':
      return <NoahsPairMatch onVolver={avanzar} onPanel={onPanel} />
    case 'nativity':
      return <DressTheNativity onVolver={avanzar} onPanel={onPanel} />
    case 'creation':
      return <CreationTapBloom onVolver={avanzar} onPanel={onPanel} />
    case 'trace':
      return <TraceTheCross onVolver={avanzar} onPanel={onPanel} />
    case 'loaves':
      return <LoavesAndFishes onVolver={avanzar} onPanel={onPanel} />
    case 'angel':
      return <GuardianAngelCatch onVolver={avanzar} onPanel={onPanel} />
    case 'storm':
      return <CalmTheStorm onVolver={avanzar} onPanel={onPanel} />
    case 'bells':
      return <RingTheBells onVolver={avanzar} onPanel={onPanel} />
  }
}
