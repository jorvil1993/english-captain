import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ORACIONES, TODAS_LAS_FRASES, UNIDADES } from '../datos/curso'
import type { Frase, Oracion, Unidad } from '../datos/tipos'
import { idVerso } from '../datos/oraciones-motor'

/**
 * El estado de José: qué sabe, qué toca repasar, unidad activa y modo de uso.
 *
 * Vive entero en localStorage del aparato. 100% offline y privado.
 */

const INTERVALOS = [1, 2, 4, 8, 16]
const DIAS_POR_UNIDAD = 4
const CLAVE = 'jose-english-v1'

export type MemoriaFrase = {
  vistas: number
  aciertos: number
  fallos: number
  nivel: number
  proximo: string
}

export type RegistroSesion = {
  fecha: string
  unidad: string
  preguntas: number
  aciertos: number
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
  modoLibreActivo: boolean
  diaRecorridoIndice: number
  ultimaRotacion: string | null
  oracionIndice: number
  oracionVersoIndice: number
}

const INICIAL: Guardado = {
  nombre: 'José',
  memoria: {},
  sesiones: [],
  unidadIndice: 0,
  diasEnUnidad: 0,
  ultimoDia: null,
  modoLibreActivo: true, // Habilitado por defecto para dar flexibilidad en salidas y grupo de oración
  diaRecorridoIndice: 0,
  ultimaRotacion: null,
  oracionIndice: 0,
  oracionVersoIndice: 0,
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
    // Si el navegador bloquea el almacenamiento, no se rompe la sesión
  }
}

type Contexto = {
  nombre: string
  unidad: Unidad
  unidadIndice: number
  todasLasUnidades: Unidad[]
  yaJugoHoy: boolean
  modoLibreActivo: boolean
  repaso: Frase[]
  sesiones: RegistroSesion[]
  memoria: Record<string, MemoriaFrase>
  diaRecorridoIndice: number
  oracionIndice: number
  oracionVersoIndice: number
  oracionActual: Oracion
  registrarRespuesta: (fraseId: string, acierto: boolean) => void
  registrarVerso: (oracionId: string, versoIdx: number) => void
  cerrarSesion: (datos: { preguntas: number; aciertos: number; intentosVoz: number }) => void
  marcarMision: (fecha: string, cumplida: boolean) => void
  ponerNombre: (n: string) => void
  fijarUnidadIndice: (idx: number) => void
  fijarOracionIndice: (idx: number) => void
  fijarModoLibre: (activo: boolean) => void
  reiniciarDia: () => void
  borrarTodo: () => void
}

const Ctx = createContext<Contexto | null>(null)

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [g, setG] = useState<Guardado>(() => leer())

  useEffect(() => escribir(g), [g])

  const hoy = hoyISO()

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

  // Rota el minijuego/bloque de variedad del día y avanza la oración un
  // verso por día. `ultimaRotacion` (a diferencia del efecto de unidadIndice
  // de arriba) hace el avance idempotente ante recargas: acá rota a diario,
  // así que sumar de más en cada recarga sí sería visible.
  useEffect(() => {
    setG((v) => {
      if (v.ultimaRotacion === hoy) return v
      if (v.ultimaRotacion === null) return { ...v, ultimaRotacion: hoy }
      const actual = ORACIONES[v.oracionIndice % ORACIONES.length]
      let oracionIndice = v.oracionIndice
      let oracionVersoIndice = v.oracionVersoIndice + 1
      if (oracionVersoIndice > actual.versos.length) {
        oracionIndice = (oracionIndice + 1) % ORACIONES.length
        oracionVersoIndice = 0
      }
      return {
        ...v,
        diaRecorridoIndice: v.diaRecorridoIndice + 1,
        ultimaRotacion: hoy,
        oracionIndice,
        oracionVersoIndice,
      }
    })
  }, [hoy])

  const unidad = UNIDADES[g.unidadIndice] ?? UNIDADES[0]
  const oracionActual = ORACIONES[g.oracionIndice % ORACIONES.length] ?? ORACIONES[0]

  const repaso = useMemo(() => {
    const deOtrasUnidades = TODAS_LAS_FRASES.filter((f) => !unidad.frases.some((x) => x.id === f.id))
    return deOtrasUnidades
      .filter((f) => {
        const m = g.memoria[f.id]
        return m && m.proximo <= hoy
      })
      .slice(0, 4)
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

  const registrarVerso = useCallback((oracionId: string, versoIdx: number) => {
    registrarRespuesta(idVerso(oracionId, versoIdx), true)
  }, [registrarRespuesta])

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
    unidadIndice: g.unidadIndice,
    todasLasUnidades: UNIDADES,
    yaJugoHoy: g.ultimoDia === hoy,
    modoLibreActivo: g.modoLibreActivo ?? true,
    repaso,
    sesiones: g.sesiones,
    memoria: g.memoria,
    diaRecorridoIndice: g.diaRecorridoIndice,
    oracionIndice: g.oracionIndice,
    oracionVersoIndice: g.oracionVersoIndice,
    oracionActual,
    registrarRespuesta,
    registrarVerso,
    cerrarSesion,
    marcarMision,
    ponerNombre: (n) => setG((v) => ({ ...v, nombre: n.trim() || 'José' })),
    fijarUnidadIndice: (idx) => setG((v) => ({ ...v, unidadIndice: Math.max(0, Math.min(idx, UNIDADES.length - 1)), diasEnUnidad: 0 })),
    fijarOracionIndice: (idx) => setG((v) => ({ ...v, oracionIndice: Math.max(0, Math.min(idx, ORACIONES.length - 1)), oracionVersoIndice: 0 })),
    fijarModoLibre: (activo) => setG((v) => ({ ...v, modoLibreActivo: activo })),
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
