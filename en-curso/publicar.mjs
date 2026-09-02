/**
 * Publica la app en GitHub Pages.
 *
 * Sube SOLO la app compilada (`app/dist`), nunca el código fuente ni la
 * carpeta `contexto/`. La razón no es técnica: GitHub Pages en cuenta gratuita
 * exige que el repositorio sea público, y tanto la investigación como los
 * comentarios del código citan el perfil de José —su temperamento, sus
 * disparadores, cómo se calma, que no tolera la burla—. Eso es información
 * privada de un niño y no va a un repositorio abierto. El empaquetador borra
 * todos los comentarios, así que lo que se publica es la app y nada más.
 *
 * La página lleva `noindex`: es pública porque no queda otra, pero no tiene
 * por qué aparecer en Google.
 *
 * Cada corrida clona el repo limpio en una carpeta temporal del sistema (fuera
 * de OneDrive), reemplaza el contenido y empuja. Volver a publicar después de
 * generar imágenes o audio nuevo es correr esto otra vez.
 *
 * Uso:
 *   node publicar.mjs
 */
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const APP = join(AQUI, 'app')
const DIST = join(APP, 'dist')

const USUARIO = 'jorvil1993'
const REPO = 'english-captain'
const URL_REPO = `https://github.com/${USUARIO}/${REPO}.git`
const URL_PAGINA = `https://${USUARIO}.github.io/${REPO}/`

// Se llama a vite con el propio node en vez de a `npm run build`: en Windows
// npm es un .cmd y Node 20+ se niega a lanzarlo sin shell. Llamar al binario
// directo evita el shell y sus problemas de comillas.
const VITE = join(APP, 'node_modules', 'vite', 'bin', 'vite.js')
const TSC = join(APP, 'node_modules', 'typescript', 'bin', 'tsc')

function correr(cmd, args, cwd) {
  return execFileSync(cmd, args, { cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function existeRepo() {
  try {
    correr('gh', ['repo', 'view', `${USUARIO}/${REPO}`, '--json', 'name'])
    return true
  } catch {
    return false
  }
}

// Puertas antes de compilar: un tsc roto, un currículo inválido o una frase que
// la app diría sin mp3 grabado no deben poder subir. `correr` lanza excepción si
// el comando sale con código distinto de 0, así que cualquiera de estos aborta.
console.log('1. Verificando (tipos, currículo, voces)…')
correr(process.execPath, [TSC, '--noEmit'], APP)
correr(process.execPath, [join(AQUI, 'artes', 'verificar_curriculo.mjs')], AQUI)
correr(process.execPath, [join(AQUI, 'artes', 'comprobar_frases.mjs')], AQUI)

console.log('2. Compilando…')
correr(process.execPath, [VITE, 'build'], APP)

if (!existeRepo()) {
  console.log('3. Creando el repositorio…')
  correr('gh', [
    'repo', 'create', `${USUARIO}/${REPO}`,
    '--public',
    '--description', 'App de inglés para un niño de 5 años. Sin internet, sin anuncios, sin datos.',
  ])
} else {
  console.log('3. El repositorio ya existía.')
}

console.log('4. Preparando el contenido…')
const trabajo = mkdtempSync(join(tmpdir(), 'publicar-'))
try {
  correr('git', ['clone', '--depth', '1', URL_REPO, trabajo])

  // Vaciar todo menos .git: así los archivos borrados también desaparecen.
  for (const f of readdirSync(trabajo)) {
    if (f !== '.git') rmSync(join(trabajo, f), { recursive: true, force: true })
  }

  cpSync(DIST, trabajo, { recursive: true })
  // Sin esto, GitHub pasa el sitio por Jekyll y se come cualquier carpeta o
  // archivo que empiece con guion bajo.
  writeFileSync(join(trabajo, '.nojekyll'), '')
  writeFileSync(
    join(trabajo, 'README.md'),
    `# English with Captain José\n\n` +
      `App de inglés para un niño de 5 años, hecha a la medida de su perfil.\n` +
      `Funciona sin internet una vez instalada, no tiene anuncios, no pide cuenta\n` +
      `y no manda ningún dato a ningún lado: el progreso se queda en el aparato.\n\n` +
      `👉 ${URL_PAGINA}\n\n` +
      `Acá solo vive la app ya compilada. El código fuente, el contenido y la\n` +
      `investigación en la que se basa el diseño no son públicos.\n\n` +
      `Las fotos de los futbolistas son de Wikimedia Commons con licencia libre;\n` +
      `el crédito de cada una está dentro de la app, en el panel de papás.\n`,
  )

  correr('git', ['add', '-A'], trabajo)
  let huboCambios = true
  try {
    correr('git', ['diff', '--cached', '--quiet'], trabajo)
    huboCambios = false
  } catch {
    /* hay cambios: es lo normal */
  }

  if (huboCambios) {
    console.log('5. Subiendo…')
    // La identidad se pone SOLO para este commit, no en la configuración
    // global de la máquina. Y con el correo noreply de GitHub: el repositorio
    // es público y el correo real no tiene por qué quedar en el historial.
    correr('git', [
      '-c', 'user.name=jorvil1993',
      '-c', `user.email=${USUARIO}@users.noreply.github.com`,
      'commit', '-m', `Publicar app (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`,
    ], trabajo)
    correr('git', ['push', 'origin', 'HEAD'], trabajo)
  } else {
    console.log('5. Nada cambió desde la última publicación.')
  }
} finally {
  rmSync(trabajo, { recursive: true, force: true })
}

console.log('6. Encendiendo GitHub Pages…')
try {
  correr('gh', [
    'api', '--method', 'POST', `repos/${USUARIO}/${REPO}/pages`,
    '-f', 'source[branch]=main', '-f', 'source[path]=/',
  ])
  console.log('   activado.')
} catch (e) {
  const msg = String(e.stderr ?? e.message ?? e)
  console.log(msg.includes('409') || msg.includes('already') ? '   ya estaba activado.' : `   aviso: ${msg.slice(0, 200)}`)
}

console.log(`\n${URL_PAGINA}\n\nTarda un minuto o dos en estar arriba la primera vez.`)
