import { useEffect, useMemo, useRef, useState } from 'react'
import type { PlanDeOracion } from '../datos/oraciones-motor'
import { useNarrador } from '../audio/narracion'
import { campana } from '../audio/sonidos'
import { Tarjeta } from '../componentes/Tarjeta'
import { Marco } from '../componentes/Marco'
import { decir, esperar } from '../audio/voz'
import { versoOracion } from '../animacion/movimiento'

/**
 * La oración troceada: anuncia el nombre, repasa lo ya aprendido (con pausas
 * reales, no un `for` corrido) y recién después suma el verso nuevo del día
 * — ver `datos/oraciones-motor.ts` para cómo se decide qué repasar y qué es
 * nuevo. Sin `onInicio`: esta parada nunca se salta.
 */
export function Prayer({
  plan,
  onVersoMostrado,
  onListo,
  onPanel,
}: {
  plan: PlanDeOracion
  onVersoMostrado: (versoIdx: number) => void
  onListo: () => void
  onPanel: () => void
}) {
  const { narrar, sigueVivo } = useNarrador()
  const [pos, setPos] = useState(-1)
  const [termino, setTermino] = useState(false)
  const linea = useRef<HTMLParagraphElement>(null)

  const oracion = plan.oracion
  const secuencia = useMemo(
    () => [...plan.versosRepaso, ...(plan.versoNuevo != null ? [plan.versoNuevo] : [])],
    [plan],
  )
  const verso = pos >= 0 ? secuencia[pos] : -1

  useEffect(() => versoOracion(linea.current), [verso])

  useEffect(() => {
    let cancelado = false
    void (async () => {
      campana()
      await esperar(1200)
      if (cancelado || !sigueVivo()) return
      await decir(oracion.titulo)
      await esperar(900)

      for (let i = 0; i < plan.versosRepaso.length; i++) {
        if (cancelado || !sigueVivo()) return
        setPos(i)
        await narrar([oracion.versos[plan.versosRepaso[i]]], 900)
        onVersoMostrado(plan.versosRepaso[i])
      }

      if (plan.versoNuevo != null) {
        if (cancelado || !sigueVivo()) return
        await esperar(1400)
        if (cancelado || !sigueVivo()) return
        await decir("Let's learn something new!")
        await esperar(500)
        if (cancelado || !sigueVivo()) return
        setPos(secuencia.length - 1)
        await narrar([oracion.versos[plan.versoNuevo]], 1200)
        onVersoMostrado(plan.versoNuevo)
      }

      if (cancelado || !sigueVivo()) return
      await esperar(1600)
      if (cancelado) return
      setTermino(true)
      // La frase ya se mostró y se puede volver a oír con el parlante de la
      // tarjeta. La ruta continúa sola, sin una flecha que José pueda tocar
      // por accidente para escaparse de la actividad.
      await esperar(1400)
      if (!cancelado && sigueVivo()) onListo()
    })()
    return () => {
      cancelado = true
    }
    // `onVersoMostrado` no entra en las dependencias a propósito: en App.tsx
    // es una función nueva en cada render, y App.tsx vuelve a renderizar
    // cada vez que se registra un verso (cambia la memoria de la sesión). Si
    // entrara acá, cada verso reiniciaría la narración desde el principio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, oracion, secuencia, narrar, sigueVivo])

  return (
    <Marco paso={Math.max(0, pos)} total={secuencia.length} onPanel={onPanel}>
      <div className="pantalla">
        <Tarjeta
          img={oracion.img}
          emoji={oracion.emoji}
          grande
          audio={verso >= 0 ? oracion.versos[verso] : oracion.titulo}
        />
        <p className="frase-chica" style={{ opacity: 0.7 }}>
          {oracion.titulo}
        </p>
        <p className="frase" ref={linea}>
          {verso >= 0 ? oracion.versos[verso] : ' '}
        </p>
        <p className="frase-chica">{oracion.gesto}</p>
        {termino && <p className="frase-chica">✨</p>}
      </div>
    </Marco>
  )
}
