import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { TODAS_LAS_FRASES, UNIDADES } from '../datos/curso'
import type { Frase, Unidad } from '../datos/tipos'

/**
 * El estado de José: qué sabe, qué toca repasar y si ya usó la app hoy.
 *
 * Vive entero en localStorage del aparato. No hay servidor, no hay cuenta, no
 * sale nada de la tablet.
 *
 * Dos motores importantes acá:
 *
 *  · REPASO ESPACIADO (§1.6). Cada frase tiene su propio calendario con
 *    intervalos que se expanden: 1, 2, 4, 8, 16 días. Al acertar, el intervalo
 *    crece; al fallar, vuelve al principio. Preescolares de 4-5 años retienen
 *    forma y significado una semana después cuando se les hace RECUPERAR la
 *    palabra espaciadamente, no cuando se les repite seguido.
 *
 *  · TOPE DIARIO. Una sesión por día y se acabó. No es una restricción
 *    técnica: es la decisión de diseño que hace que esta app se pueda dejar sin
 *    miedo (§1.10 y las 5 C de la AAP: "Crowding Out"). Si José pide más, la
 *    app no cede — y el que sostiene el límite es un aparato, no papá, que es
 *    justo lo que a esta familia le cuesta sostener (perfil §4).
 */

const INTERVALOS = [1, 2, 4, 8, 16]
const DIAS_POR_UNIDAD = 4 // la misma unidad varios días: la repetición es el método, no un bug
const CLAVE = 'jose-english-v1'

export type MemoriaFrase = {
  vistas: number
  aciertos: number
  fallos: number
  /** Posición en INTERVALOS. */
  nivel: number
  /** Fecha ISO (YYYY-MM-DD) en que toca volver a preguntarla. */
  proximo: string
}

export type RegistroSesion = {
  fecha: string
  unidad: string
  preguntas: number
  aciertos: number
  /** Cuántas veces intentó decir algo en voz alta. La métrica de SparkLing. */
  intentosVoz: number
  misionCumplida: boolean
}

type Guardado = {
  nombre: string
  memoria: Record<string, MemoriaFrase>
  sesiones: RegistroSesion[]
  unidadIndice: number
  diasEnUnidad: number
  ultimoDia: string | null
}

const INICIAL: Guardado = {
  nombre: 'José',
  memoria: {},
  sesiones: [],
  unidadIndice: 0,
  diasEnUnidad: 0,
  ultimoDia: null,
}

export function hoyISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function sumarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + dias)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function leer(): Guardado {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return INICIAL
    return { ...INICIAL, ...(JSON.parse(crudo) as Partial<Guardado>) }
  } catch {
    return INICIAL
  }
}

function escribir(g: Guardado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(g))
  } catch {
    // Si el navegador bloquea el almacenamiento la app igual funciona; lo
    // único que se pierde es el progreso. Nunca es motivo para no arrancar.
  }
}

type Contexto = {
  nombre: string
  unidad: Unidad
  /** Si ya hizo su sesión hoy. La app no da una segunda. */
  yaJugoHoy: boolean
  /** Frases de unidades anteriores que hoy toca recuperar. */
  repaso: Frase[]
  sesiones: RegistroSesion[]
  memoria: Record<string, MemoriaFrase>
  registrarRespuesta: (fraseId: string, acierto: boolean) => void
  cerrarSesion: (datos: { preguntas: number; aciertos: number; intentosVoz: number }) => void
  marcarMision: (fecha: string, cumplida: boolean) => void
  ponerNombre: (n: string) => void
  reiniciarDia: () => void
  borrarTodo: () => void
}

const Ctx = createContext<Contexto | null>(null)

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [g, setG] = useState<Guardado>(() => leer())

  useEffect(() => escribir(g), [g])

  const hoy = hoyISO()

  // Al entrar un día nuevo avanzamos el contador de días en la unidad. La
  // unidad cambia sola cada DIAS_POR_UNIDAD; nadie tiene que "pasar de nivel".
  useEffect(() => {
    setG((v) => {
      if (v.ultimoDia === hoy || v.ultimoDia === null) return v
      const dias = v.diasEnUnidad + 1
      if (dias >= DIAS_POR_UNIDAD) {
        return { ...v, diasEnUnidad: 0, unidadIndice: (v.unidadIndice + 1) % UNIDADES.length }
      }
      return { ...v, diasEnUnidad: dias }
    })
  }, [hoy])

  const unidad = UNIDADES[g.unidadIndice] ?? UNIDADES[0]

  const repaso = useMemo(() => {
    const deOtrasUnidades = TODAS_LAS_FRASES.filter((f) => !unidad.frases.some((x) => x.id === f.id))
    return deOtrasUnidades
      .filter((f) => {
        const m = g.memoria[f.id]
        return m && m.proximo <= hoy
      })
      .slice(0, 4) // nunca más de 4: el sanguíneo se dispersa
  }, [g.memoria, hoy, unidad])

  const registrarRespuesta = useCallback((fraseId: string, acierto: boolean) => {
    setG((v) => {
      const previa = v.memoria[fraseId] ?? { vistas: 0, aciertos: 0, fallos: 0, nivel: 0, proximo: hoy }
      const nivel = acierto ? Math.min(previa.nivel + 1, INTERVALOS.length - 1) : 0
      return {
        ...v,
        memoria: {
          ...v.memoria,
          [fraseId]: {
            vistas: previa.vistas + 1,
            aciertos: previa.aciertos + (acierto ? 1 : 0),
            fallos: previa.fallos + (acierto ? 0 : 1),
            nivel,
            proximo: sumarDias(hoy, INTERVALOS[nivel]),
          },
        },
      }
    })
  }, [hoy])

  const cerrarSesion = useCallback((datos: { preguntas: number; aciertos: number; intentosVoz: number }) => {
    setG((v) => ({
      ...v,
      ultimoDia: hoy,
      sesiones: [
        ...v.sesiones.filter((s) => s.fecha !== hoy),
        { fecha: hoy, unidad: unidad.id, misionCumplida: false, ...datos },
      ].slice(-120),
    }))
  }, [hoy, unidad.id])

  const marcarMision = useCallback((fecha: string, cumplida: boolean) => {
    setG((v) => ({
      ...v,
      sesiones: v.sesiones.map((s) => (s.fecha === fecha ? { ...s, misionCumplida: cumplida } : s)),
    }))
  }, [])

  const valor: Contexto = {
    nombre: g.nombre,
    unidad,
    yaJugoHoy: g.ultimoDia === hoy,
    repaso,
    sesiones: g.sesiones,
    memoria: g.memoria,
    registrarRespuesta,
    cerrarSesion,
    marcarMision,
    ponerNombre: (n) => setG((v) => ({ ...v, nombre: n.trim() || 'José' })),
    reiniciarDia: () => setG((v) => ({ ...v, ultimoDia: null })),
    borrarTodo: () => setG(INICIAL),
  }

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useSesion(): Contexto {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSesion fuera del proveedor')
  return c
}
