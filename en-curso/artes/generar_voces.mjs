/**
 * Genera TODA la voz de la app con voces neuronales de verdad.
 *
 * El problema que resuelve: el sintetizador del sistema (Web Speech API) suena
 * a motor de los noventa y su inglés no es inglés — José copiaría eso durante
 * meses. La pronunciación que oye tiene que ser nativa y estable (§1.9 de la
 * investigación), así que no se sintetiza en el aparato: se genera acá, una
 * vez, y los mp3 viajan dentro de la app.
 *
 * Con qué: **edge-tts**, las voces neuronales de Microsoft Edge. Gratis, sin
 * clave de API, sin cuenta. Solo hace falta internet EN ESTA MÁQUINA y EN ESTE
 * MOMENTO; la tablet de José sigue funcionando 100% sin conexión, porque lo
 * que se instala son los archivos ya hechos.
 *
 * Cinco voces, no una — el estudio SparkLing usa varios hablantes a propósito:
 *
 *   maestra  Ava      la que narra, pregunta y modela
 *   nino     Ana      un niño: canta y celebra
 *   oracion  Michelle más lenta y más baja, para rezar
 *   coach    Brian    las órdenes del cuerpo y el fútbol
 *   espanol  Sofía    es-BO — el rescate suena de casa, no de un doblaje
 *
 * El nombre del archivo es el hash del texto (`app/src/audio/clave.ts`, que se
 * IMPORTA, no se copia). Escribir una frase nueva en `curso.ts` y correr esto
 * es todo lo que hay que hacer: la app la encuentra sola.
 *
 * Uso:
 *   node generar_voces.mjs            # genera lo que falta
 *   node generar_voces.mjs --rehacer  # regenera todo desde cero
 *   node generar_voces.mjs --lista    # qué hay y qué falta
 */
import { spawn } from 'node:child_process'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { corpus } from '../app/src/datos/corpus.ts'
import { claveDe } from '../app/src/audio/clave.ts'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = join(AQUI, '..', 'app', 'public', 'audio')

// voz -> [modelo de edge-tts, velocidad]
// Todas van más lento que el habla normal: es habla dirigida al niño, que es
// justamente lo que hace que se entienda y se copie.
const VOCES = {
  maestra: ['en-US-AvaNeural', '-8%'],
  nino: ['en-US-AnaNeural', '-4%'],
  oracion: ['en-US-MichelleNeural', '-18%'],
  coach: ['en-US-BrianNeural', '-6%'],
  espanol: ['es-BO-SofiaNeural', '-4%'],
}

const EN_PARALELO = 4

function generarUno(texto, voz, salida) {
  return new Promise((resolve, reject) => {
    const [modelo, velocidad] = VOCES[voz]
    // El prefijo `es:` solo existe para separar las claves del español de las
    // del inglés; no se pronuncia.
    const aDecir = texto.startsWith('es:') ? texto.slice(3) : texto
    const p = spawn(
      'python',
      ['-m', 'edge_tts', '--voice', modelo, `--rate=${velocidad}`, '--text', aDecir, '--write-media', salida],
      { windowsHide: true },
    )
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('error', reject)
    p.on('close', (codigo) => (codigo === 0 ? resolve() : reject(new Error(err.trim().slice(0, 300) || `código ${codigo}`))))
  })
}

async function main() {
  const rehacer = process.argv.includes('--rehacer')
  const soloListar = process.argv.includes('--lista')

  await mkdir(DESTINO, { recursive: true })
  const lineas = corpus().map((l) => ({ ...l, clave: claveDe(l.texto) }))

  // Dos textos distintos con el mismo hash romperían el audio en silencio.
  const porClave = new Map()
  for (const l of lineas) {
    const previo = porClave.get(l.clave)
    if (previo && previo.texto !== l.texto) {
      console.error(`COLISIÓN de clave ${l.clave}: "${previo.texto}" vs "${l.texto}"`)
      process.exit(1)
    }
    porClave.set(l.clave, l)
  }

  const pendientes = [...porClave.values()].filter(
    (l) => rehacer || !existsSync(join(DESTINO, `${l.clave}.mp3`)),
  )

  if (soloListar) {
    console.log(`${porClave.size - pendientes.length}/${porClave.size} audios listos. Faltan ${pendientes.length}.`)
    for (const l of pendientes.slice(0, 20)) console.log(`  [${l.voz}] ${l.texto}`)
    if (pendientes.length > 20) console.log(`  … y ${pendientes.length - 20} más`)
    return
  }

  if (pendientes.length) {
    console.log(`Generando ${pendientes.length} audios con voces neuronales…`)
    let hechos = 0
    const fallos = []
    for (let i = 0; i < pendientes.length; i += EN_PARALELO) {
      const tanda = pendientes.slice(i, i + EN_PARALELO)
      await Promise.all(
        tanda.map(async (l) => {
          try {
            await generarUno(l.texto, l.voz, join(DESTINO, `${l.clave}.mp3`))
            hechos++
          } catch (e) {
            fallos.push({ texto: l.texto, motivo: String(e.message ?? e) })
          }
        }),
      )
      process.stdout.write(`\r  ${hechos}/${pendientes.length}`)
    }
    console.log()
    if (fallos.length) {
      console.log(`\nFallaron ${fallos.length}:`)
      for (const f of fallos.slice(0, 8)) console.log(`  ${f.texto} — ${f.motivo}`)
      console.log('Volvé a correr el script: retoma solo lo que falta.')
    }
  } else {
    console.log('Todos los audios ya estaban.')
  }

  // El manifiesto: la app lee esto para saber qué mp3 existen sin ir a probar
  // uno por uno con 404s.
  const enDisco = (await readdir(DESTINO)).filter((f) => f.endsWith('.mp3')).map((f) => f.replace('.mp3', ''))
  await writeFile(join(DESTINO, 'audio.json'), JSON.stringify(enDisco.sort()), 'utf-8')
  console.log(`audio.json con ${enDisco.length} claves.`)
}

await main()
