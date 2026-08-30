/**
 * La clave de un audio se calcula DESDE SU TEXTO.
 *
 * Por qué así y no con ids escritos a mano: el 99% de las llamadas de la app
 * son `decir("Here is the ball.")`, sin id. Si el archivo hubiera que
 * nombrarlo aparte, cada frase nueva del contenido exigiría acordarse de
 * inventarle un id, pasarlo por cinco archivos y no equivocarse. Con el hash
 * del texto, escribir la frase en `curso.ts` y correr el generador es todo:
 * el audio aparece solo donde esa frase se diga.
 *
 * El mismo cálculo lo hace el generador (`en-curso/artes/generar_voces.mjs`),
 * que importa ESTE archivo — no una copia. Si alguna vez se toca la función,
 * se toca en un solo lugar y los dos lados siguen coincidiendo.
 *
 * Es FNV-1a de 32 bits sobre el texto normalizado (espacios colapsados). No es
 * criptografía: es un nombre de archivo corto y estable.
 */
export function claveDe(texto: string): string {
  const s = texto.trim().replace(/\s+/g, ' ')
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}
