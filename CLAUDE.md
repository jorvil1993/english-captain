# Aprender inglés — José

App para que José (5 años el 27 de septiembre de 2026) aprenda inglés desde la
tablet, católica de raíz y basada en evidencia. Hijo único, colérico primario +
sanguíneo secundario, fanático del fútbol, no sabe leer todavía.

## Lo primero que hay que leer

**`contexto/claude-2026-08-30-investigacion-metodo.md`** — la investigación que
manda sobre todo el diseño: qué dice la ciencia sobre enseñar inglés a un
preescolar hispanohablante, qué cambia por el temperamento concreto de José, y
el marco católico (Catequesis del Buen Pastor). Cada decisión rara de la app
está justificada ahí, con las fuentes.

El perfil de José vive en `../crianza/PERFIL_PROFUNDO_Familia.md` (§1, §5, §7).
No se duplica acá: se lee de ahí.

## Las reglas que no se rompen

Salen de la investigación y del perfil. Si una tarea nueva choca con una de
estas, se para y se pregunta:

1. **José no lee.** Cero texto que él tenga que descifrar. Todo por voz e
   imagen. El texto en pantalla es para papá.
2. **Frases enteras, no palabras sueltas.** La unidad de contenido es la frase
   útil ("Where is the ball?"), nunca una lista de vocabulario.
3. **Nada califica su pronunciación.** El micrófono graba y devuelve, y siempre
   se aplaude. El reconocimiento de voz no es fiable por debajo de los 6 años, y
   con él, además, cerraría la puerta.
4. **José no pierde nunca contra la app.** Sin rival, sin vidas, sin "game
   over". Corre contra su propio récord y si no lo mejora la app no lo menciona.
5. **Ningún sonido ni cara de error.** Se equivoca, se vuelve a modelar bien y
   se sigue. No tolera que se rían de él.
6. **Una sesión por día y corte real.** El límite lo sostiene el aparato.
7. **El cuerpo se mueve.** Cada frase tiene un gesto.
8. **Termina empujándolo fuera de la pantalla**, con una misión para hacer con
   papá o mamá.
9. **Nada sale de la tablet.** Sin internet, sin cuenta, sin servidor.
10. **Ninguna imagen sagrada entra sin que Jorge la apruebe.** Se generan en
    `en-curso/artes/revisar/` y se mueven a mano.
11. **La voz es grabada, nunca sintetizada en el aparato.** Todo lo que la app
    dice sale de un mp3 con voz neuronal generado por
    `en-curso/artes/generar_voces.mjs`. El sintetizador del sistema es solo una
    red de emergencia: si se oye, es que falta generar ese audio. Frase nueva =
    correr el generador.

## Estructura

- `contexto/` — la investigación y lo que sirva de referencia.
- `en-curso/app/` — la app (React + Vite + PWA, igual que `crianza/app-crianza`).
  `npm run dev` para probarla, `npm run build` para empaquetar.
- `en-curso/artes/` — los generadores de imagen.
  - `generar_imagenes.py` — las ilustraciones. **Importa** el motor de
    `creacion-de-contenido/artes/a11_agy.py`, no lo copia.
  - `bajar_cromos.py` — las fotos reales de los jugadores desde Wikimedia
    Commons, verificando licencia libre y guardando el crédito.
  - `generar_voces.mjs` — toda la voz de la app con **edge-tts** (voces
    neuronales de Microsoft, gratis y sin clave). Cinco voces distintas, porque
    el método SparkLing usa varios hablantes a propósito. Importa el corpus y
    la función de clave de la propia app: no hay listas duplicadas.
- `resultados/` — lo terminado.

## Contenido

Las unidades están en `en-curso/app/src/datos/curso.ts`. Agregar una unidad es
agregar un objeto a `UNIDADES` (8 frases, un cuento de 6 escenas con al menos
dos preguntas, una canción, una misión) y sus prompts a `generar_imagenes.py`.
Después de agregar contenido hay que correr `node ../artes/generar_voces.mjs`
para que las frases nuevas tengan voz. Nada más: el repaso espaciado, la
rotación de unidades y el panel de papás se acomodan solos.

## Publicación

La app vive en **https://jorvil1993.github.io/english-captain/**. Para
republicar después de agregar imágenes, audio o contenido:

```
node en-curso/publicar.mjs
```

**Solo se publica `app/dist`, nunca el código fuente ni `contexto/`.** GitHub
Pages en cuenta gratuita obliga a que el repositorio sea público, y tanto la
investigación como los comentarios del código citan el perfil de José —su
temperamento, sus disparadores, que no tolera la burla—. Eso es información
privada de un niño. El empaquetador borra los comentarios, así que lo que queda
arriba es la app y nada más. La página lleva `noindex`.

## Animación

Con **GSAP**, el mismo motor que usan las plantillas de Hyperframes del
pipeline de la empresa (`creacion-de-contenido/plantillas/`) — pero sin el paso
de render a video, porque una PWA ya es HTML. Lo que **no** se copia es el
vocabulario de movimiento: los flashes, glitches y latigazos de TikTok son lo
contrario de lo que necesita un niño de 4 años. El lenguaje calmo de la app
está definido y justificado en `en-curso/app/src/animacion/movimiento.ts`.
