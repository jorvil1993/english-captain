import gsap from 'gsap'

/**
 * EL LENGUAJE DE MOVIMIENTO DE LA APP.
 *
 * De dónde sale: el pipeline de video de la empresa
 * (`creacion-de-contenido/plantillas/`) anima con **Hyperframes**, que no es
 * más que composiciones HTML + CSS + **GSAP** que después se renderizan a MOV
 * con alfa para pegarlas sobre el video. Acá reusamos exactamente el mismo
 * motor —GSAP, la misma librería y la misma forma de escribir timelines— pero
 * SIN el paso de render: una PWA ya es HTML, así que la animación corre viva en
 * la pantalla y no pesa un solo megabyte de video. Cero herramientas nuevas y
 * cero duplicados.
 *
 * Lo que NO se copia es el vocabulario de movimiento. Las plantillas de
 * DeviceShop y las transiciones del editor (`f2b_transiciones.py`,
 * `f4b_pip_anim.py`) están hechas para retención en TikTok: flash blanco,
 * glitch, latigazo, zoom-punch, shake, whip-blur, entradas de 0,2 s. Para
 * vender un Kindle a un adulto que hace scroll, eso funciona. Para José es lo
 * contrario de lo que hay que hacer:
 *
 *   · La AAP pide explícitamente evitar los programas de ritmo rápido con
 *     niños pequeños: los entienden PEOR (§1.10 de la investigación).
 *   · La columna "enfocada" de Hirsh-Pasek dice que los adornos vistosos
 *     compiten con el contenido por la atención del niño — y ganan (§1.3).
 *   · Y este niño en particular necesita anticipación y previsibilidad; el
 *     movimiento brusco y sorpresivo juega en contra (perfil §1).
 *
 * Así que la regla acá es la inversa: **todo dura el doble y nada golpea.**
 * Duración mínima 0,4 s, easing suave (`sine`, `power2`), un solo elemento en
 * movimiento a la vez, y ningún efecto que exista solo para llamar la
 * atención. Si una animación no ayuda a entender qué pasó, no va.
 *
 * Prohibido, explícitamente: destellos, glitch, sacudidas, latigazos,
 * zoom-punch, confeti y cualquier premio animado permanente.
 */

const suave = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

type Objetivo = Element | null | undefined

/** Aparecer: sube un poco y se revela. La entrada por defecto de todo. */
export function aparecer(el: Objetivo, retraso = 0) {
  if (!el || suave) return
  gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: retraso })
}

/** La tarjeta grande que entra: crece apenas, sin rebote de resorte. */
export function entrarTarjeta(el: Objetivo, retraso = 0) {
  if (!el || suave) return
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', delay: retraso },
  )
}

/** Varias tarjetas en fila, una detrás de otra. El escalonado da tiempo a mirar. */
export function entrarFila(elementos: Objetivo[]) {
  if (suave) return
  const validos = elementos.filter(Boolean) as Element[]
  if (!validos.length) return
  gsap.fromTo(
    validos,
    { opacity: 0, scale: 0.9, y: 12 },
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12 },
  )
}

/**
 * Celebrar un acierto. Un latido, no una explosión.
 *
 * Comparar con `f4b_pip_anim.py` del pipeline, donde lo equivalente es
 * "latigazo" o "resorte" en 0,28 s. Acá son 0,8 s y la escala no pasa de 1,06:
 * se nota que algo salió bien y no sobresalta.
 */
export function celebrar(el: Objetivo) {
  if (!el || suave) return
  gsap.timeline()
    .to(el, { scale: 1.06, duration: 0.28, ease: 'sine.out' })
    .to(el, { scale: 1, duration: 0.5, ease: 'sine.inOut' })
}

/**
 * Señalar la respuesta correcta cuando José se equivocó.
 *
 * Es el momento más delicado de la app: no hay sonido de error ni cara triste
 * (no tolera que se rían de él). Lo único que pasa es que la tarjeta buena se
 * ilumina despacio, como diciendo "mira, es esta". Sin castigo y sin prisa.
 */
export function senalar(el: Objetivo) {
  if (!el || suave) return
  gsap.fromTo(
    el,
    { boxShadow: '0 6px 0 rgba(51,41,29,0.14)' },
    {
      boxShadow: '0 6px 0 rgba(51,41,29,0.14), 0 0 0 10px rgba(46,145,105,0.28)',
      scale: 1.04,
      duration: 0.7,
      ease: 'sine.inOut',
    },
  )
}

/**
 * Respiración: la imagen "vive" sin hacer nada.
 *
 * Un ciclo de 5 segundos y 1,5% de escala. Es lo que separa una pantalla
 * muerta de una viva sin meter una sola distracción — el niño no lo registra
 * como movimiento, solo siente que la escena está despierta.
 */
export function respirar(el: Objetivo) {
  if (!el || suave) return () => {}
  const t = gsap.to(el, { scale: 1.015, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  return () => t.kill()
}

/** El pulso lento de "tócame". Reemplaza al `.late` de CSS con mejor easing. */
export function invitar(el: Objetivo) {
  if (!el || suave) return () => {}
  const t = gsap.to(el, { scale: 1.045, duration: 0.95, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  return () => t.kill()
}

/** Salir: baja y se apaga. Se usa entre escenas del cuento. */
export function salir(el: Objetivo): Promise<void> {
  if (!el || suave) return Promise.resolve()
  return new Promise((resolve) => {
    gsap.to(el, { opacity: 0, y: 12, duration: 0.35, ease: 'power1.in', onComplete: () => resolve() })
  })
}

/** El verso de la oración que se revela. Muy lento a propósito: es oración. */
export function versoOracion(el: Objetivo) {
  if (!el || suave) return
  gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'sine.out' })
}
