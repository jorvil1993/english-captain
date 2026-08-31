/**
 * ¿Hay alguna frase que la app diga y que NO tenga mp3 grabado?
 *
 * La regla 11 del proyecto dice que la voz es grabada, nunca sintetizada en el
 * aparato. El sintetizador es solo una red de emergencia, y su inglés no es
 * inglés: si suena, José está copiando una pronunciación mala durante meses
 * sin que nadie se entere, porque nadie está mirando la tablet mientras juega.
 *
 * `generar_voces.mjs --lista` ya avisa qué falta grabar DEL CORPUS. Lo que no
 * puede ver es la otra grieta, que es la que de verdad se abre sola: una frase
 * escrita a mano dentro de una pantalla —`decir('Nice try!')`— que nadie se
 * acordó de agregar al corpus. Esa frase no aparece como pendiente en ningún
 * lado, tiene mp3 «no», y suena con la voz fea. Este script la encuentra:
 * lee TODAS las pantallas, saca las cadenas que se mandan a hablar, y las
 * compara contra los mp3 que hay en disco.
 *
 * Uso:
 *   node comprobar_frases.mjs
 *
 * Sale con código 1 si falta alguna: sirve para no publicar con una grieta.
 */
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const APP = join(AQUI, '..', 'app')
const SRC = join(APP, 'src')

const { claveDe } = await import(pathToFileURL(join(SRC, 'audio', 'clave.ts')).href)

/**
 * Las llamadas que terminan en la boca de la app. `decirEs` no entra: el
 * español tiene su propio prefijo de clave y su propia voz.
 */
const PATRON = /(?:\bdecir|voz\.di|cola\.encolar|di:)\s*\(?\s*'([^'\n]+)'/g

/** Recorre `src/` y devuelve todos los .tsx y .ts. */
async function fuentes(dir) {
  const salida = []
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name)
    if (entrada.isDirectory()) salida.push(...(await fuentes(ruta)))
    else if (/\.tsx?$/.test(entrada.name)) salida.push(ruta)
  }
  return salida
}

const enDisco = new Set(
  (await readdir(join(APP, 'public', 'audio')))
    .filter((f) => f.endsWith('.mp3'))
    .map((f) => f.replace('.mp3', '')),
)

const faltan = new Map() // frase -> [archivos donde se dice]
let total = 0
const yaVistas = new Set()

for (const archivo of await fuentes(SRC)) {
  const codigo = await readFile(archivo, 'utf-8')
  for (const m of codigo.matchAll(PATRON)) {
    const frase = m[1]
    // Plantillas y cadenas vacías: no son frases fijas, se arman en marcha.
    if (!frase.trim() || frase.includes('${')) continue
    const clave = `${archivo}|${frase}`
    if (yaVistas.has(clave)) continue
    yaVistas.add(clave)
    total++
    if (!enDisco.has(claveDe(frase))) {
      const corto = archivo.slice(SRC.length + 1).replace(/\\/g, '/')
      faltan.set(frase, [...(faltan.get(frase) ?? []), corto])
    }
  }
}

console.log(`Frases fijas que la app dice en voz alta: ${total}`)
console.log(`Sin mp3 grabado: ${faltan.size}`)

if (faltan.size) {
  console.log('\nEstas las diría el sintetizador del sistema:\n')
  for (const [frase, donde] of faltan) {
    console.log(`  "${frase}"`)
    console.log(`     ${[...new Set(donde)].join(', ')}`)
  }
  console.log('\nAgrégalas al corpus (datos/) y corre: node generar_voces.mjs')
  process.exit(1)
}

console.log('Todo lo que la app dice tiene voz grabada.')
