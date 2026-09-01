/**
 * Verifica el contrato de la ruta infantil antes de publicar.
 *
 * No intenta adivinar pedagogía con IA: comprueba las reglas que sí se pueden
 * romper accidentalmente al añadir contenido. Cada frase debe pertenecer a
 * exactamente una lección corta; cada escena debe existir; y un minijuego
 * solo puede pedir vocabulario introducido antes de que aparezca.
 *
 * Uso: node verificar_curriculo.mjs
 */
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DATOS = join(AQUI, '..', 'app', 'src', 'datos')
const { UNIDADES } = await import(pathToFileURL(join(DATOS, 'curso.ts')).href)
const { TODAS_LAS_LECCIONES, leccionesDeUnidad } = await import(pathToFileURL(join(DATOS, 'curriculo.ts')).href)

const errores = []
const avisar = (texto) => errores.push(texto)

for (const unidad of UNIDADES) {
  const lecciones = leccionesDeUnidad(unidad.id)
  if (!lecciones.length) {
    avisar(`${unidad.id}: no tiene lecciones.`)
    continue
  }

  const vistas = new Map()
  const conocidas = new Set()
  for (const leccion of lecciones) {
    if (leccion.fraseIds.length < 1 || leccion.fraseIds.length > 2) {
      avisar(`${leccion.id}: debe introducir una o dos frases, no ${leccion.fraseIds.length}.`)
    }
    for (const id of leccion.fraseIds) {
      if (!unidad.frases.some((frase) => frase.id === id)) avisar(`${leccion.id}: la frase ${id} no pertenece a ${unidad.id}.`)
      vistas.set(id, (vistas.get(id) ?? 0) + 1)
      conocidas.add(id)
    }
    for (const escena of leccion.escenas) {
      if (!unidad.cuento.escenas[escena]) avisar(`${leccion.id}: la escena ${escena} no existe.`)
    }
    if (leccion.juego) {
      for (const id of leccion.juego.repasa) {
        if (!conocidas.has(id)) avisar(`${leccion.id}: el juego ${leccion.juego.id} intenta usar ${id} antes de enseñarla.`)
      }
    }
  }

  for (const frase of unidad.frases) {
    const cantidad = vistas.get(frase.id) ?? 0
    if (cantidad !== 1) avisar(`${unidad.id}: ${frase.id} aparece ${cantidad} veces; debe aparecer una sola vez en el mapa.`)
  }
}

const ids = new Set(TODAS_LAS_LECCIONES.map((leccion) => leccion.id))
if (ids.size !== TODAS_LAS_LECCIONES.length) avisar('Hay ids de lección duplicados.')

if (errores.length) {
  console.error(`Currículo inválido (${errores.length}):`)
  errores.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Currículo válido: ${TODAS_LAS_LECCIONES.length} lecciones, ${UNIDADES.reduce((n, u) => n + u.frases.length, 0)} frases conectadas.`)
