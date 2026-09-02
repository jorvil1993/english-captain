# Prompt maestro — tarjetas de vocabulario de vida diaria

*Claude Code · 2 de septiembre de 2026*

## Contexto

Observación recibida: la app cumple mal el hilo **"Vida diaria"** que promete la
investigación (`claude-2026-08-30-investigacion-metodo.md`, §"Los tres hilos"):
saludos, comida, familia, casa, **colores, números, cuerpo, ropa**, emociones,
cortesía. Hoy hay 1 unidad de vida (U7), 1 de fútbol (U1) y 5 de fe. Falta
vocabulario cotidiano básico para un hispanohablante de 5 años: `red/blue`,
`one`–`ten` (solo existe el conteo 1-5 atrapado dentro de *Loaves and Fishes*),
partes del cuerpo, ropa, comida real, cosas de la casa.

Este documento resuelve el primer paso: **generar en Google Flow las tarjetas de
imagen**, una por elemento, sin mezclar nada — que es justo lo que necesita una
tarjeta de vocabulario donde José toca lo que acaba de oír (`tipos.ts`, la
`REGLA_TARJETA_SIMPLE` de `generar_imagenes.py`).

---

## La fórmula (bloque fijo — se pega ANTES de cada elemento, sin cambiarlo)

```
Warm hand-painted children's picture-book illustration for a preschool vocabulary
flashcard. Gouache and colored-pencil texture, soft rounded shapes, thick friendly
dark outlines, warm cream background the colour of a blank sheet of recycled paper,
gentle golden natural light, calm and cozy mood. Not photorealistic, not a 3D
render, not anime, not glossy digital art.

Show ONE single subject only — the one described in SUBJECT below. It is large,
centred and in clear focus, filling most of the frame, with generous empty space
around it. The background is a plain flat solid warm cream with absolutely nothing
on it: no floor, no wall, no table, no room, no horizon, no landscape, no scenery,
no patterned or gradient backdrop, no drop-shadow scene, no border, no frame, no
vignette. No second object of any kind. No decorative details. If a person is
described, ONLY that person appears and nothing else.

Absolutely NO text, NO letters, NO numerals, NO digits, NO written numbers, NO
words, NO labels, NO captions, NO signs, NO logos, NO watermark, NO speech bubbles
anywhere in the image.

Square 1:1 framing, edge to edge.

SUBJECT:
```

Para las tarjetas de **partes del cuerpo** (y solo esas), después de `SUBJECT:` se
pega primero este descriptor de José —el mismo niño de las otras 121 imágenes— y
luego la línea del elemento:

```
José — a cheerful 5-year-old boy with light fair skin, a pale light complexion
(clearly light-skinned, not tanned or dark), short straight dark-brown hair, big
dark-brown eyes, round cheeks, wearing a red-and-white horizontally striped soccer
jersey. Exactly the same face, skin tone and jersey in every image.
```

### Cómo queda armado (ejemplo)

> *(bloque fijo completo)*
> `SUBJECT: A single smooth round party balloon in bright pure RED, with one short curly string hanging down and one soft white highlight. The balloon is the only object.`

---

## Tanda 1 — 24 tarjetas

### Colores (6) · objeto = globo (no está en el vocabulario, no confunde)

| clave | emoji | SUBJECT |
|---|---|---|
| `v-color-red` | 🔴 | A single smooth round party balloon in bright pure RED, one short curly string hanging down, one soft white highlight. The balloon is the only object. |
| `v-color-blue` | 🔵 | A single smooth round party balloon in bright pure BLUE, one short curly string, one soft highlight. The balloon is the only object. |
| `v-color-yellow` | 🟡 | A single smooth round party balloon in warm sunny YELLOW, one short curly string, one soft highlight. The balloon is the only object. |
| `v-color-green` | 🟢 | A single smooth round party balloon in fresh grass GREEN, one short curly string, one soft highlight. The balloon is the only object. |
| `v-color-orange` | 🟠 | A single smooth round party balloon in bright ORANGE, one short curly string, one soft highlight. The balloon is the only object. |
| `v-color-purple` | 🟣 | A single smooth round party balloon in soft PURPLE, one short curly string, one soft highlight. The balloon is the only object. |

### Partes del cuerpo (6) · con el descriptor de José delante

| clave | emoji | SUBJECT (va después del descriptor de José) |
|---|---|---|
| `v-body-head` | 🧑 | Close head-and-shoulders crop of José tapping the top of his own HEAD with one flat hand, calm friendly smile, looking at the viewer. |
| `v-body-hand` | ✋ | José holds up one open HAND toward the viewer, fingers gently spread, the hand large and central, warm smile. |
| `v-body-foot` | 🦶 | José sits on the ground hugging one bent knee and points with one finger at his own bare FOOT, the foot large and central toward the viewer. |
| `v-body-eyes` | 👀 | Close crop of José's face; he points with two fingers toward his own two open bright EYES; gentle smile. |
| `v-body-ears` | 👂 | Close crop of José's face; he cups both hands behind his two EARS as if listening; happy expression. |
| `v-body-nose` | 👃 | Close crop of José's face; he touches the tip of his own NOSE with one finger; playful smile. |

### Ropa (4)

| clave | emoji | SUBJECT |
|---|---|---|
| `v-wear-shirt` | 👕 | A single child's short-sleeve T-SHIRT in plain solid sky blue, laid flat and seen from the front, neatly spread out. The only object. |
| `v-wear-shoes` | 👟 | A single pair of small white children's lace-up SNEAKERS placed neatly side by side, seen from the front. The only object. |
| `v-wear-hat` | 🧢 | A single child's soft round brimmed sun HAT in warm tan, seen from a slight angle. The only object. |
| `v-wear-jacket` | 🧥 | A single child's zip-up hooded JACKET in forest green, laid flat and seen from the front. The only object. |

### Comida real (4)

| clave | emoji | SUBJECT |
|---|---|---|
| `v-food-apple` | 🍎 | A single ripe round red APPLE with a short brown stem and one small green leaf, large and centred. No plate, no table. |
| `v-food-banana` | 🍌 | A single ripe yellow BANANA with a gentle curve, large and centred. No plate, no table. |
| `v-food-egg` | 🥚 | A single smooth white chicken EGG standing upright, large and centred. No cup, no plate. |
| `v-food-rice` | 🍚 | A single plain white bowl filled with steamed white RICE, seen from slightly above, the bowl centred, nothing else on the background. |

### Cosas de la casa (4)

| clave | emoji | SUBJECT |
|---|---|---|
| `v-home-bed` | 🛏️ | A single small neatly-made child's BED with one pillow and a folded blanket, three-quarter view. The only object. |
| `v-home-chair` | 🪑 | A single simple wooden CHAIR with a straight back, empty, three-quarter view. The only object. |
| `v-home-door` | 🚪 | A single closed wooden house DOOR with a round brass handle, seen straight on, standing alone. The only object. |
| `v-home-window` | 🪟 | A single simple wooden-framed house WINDOW with four panes and a small sill, seen straight on, standing alone, plain cream visible through the glass. The only object. |

---

## Tanda 2 — números 1 a 10 (batch aparte, misma fórmula)

Regla dura de la app: **en la imagen no va ningún dígito escrito.** Se enseña la
**cantidad**, no el símbolo. El objeto contable es la pelota de fútbol: la conoce
(`u1-ball`), es lo que más le gusta, y contar sus pelotas motiva.

Se cierra cada línea con: *"— all identical and the same size, on the plain cream
background, nothing else. NO printed digit or numeral anywhere."*

| clave | emoji | SUBJECT |
|---|---|---|
| `v-num-1` | 1️⃣ | Exactly ONE classic black-and-white soccer ball, centred |
| `v-num-2` | 2️⃣ | Exactly TWO classic black-and-white soccer balls, side by side in one row |
| `v-num-3` | 3️⃣ | Exactly THREE soccer balls in one evenly-spaced row |
| `v-num-4` | 4️⃣ | Exactly FOUR soccer balls in one evenly-spaced row |
| `v-num-5` | 5️⃣ | Exactly FIVE soccer balls in one evenly-spaced row |
| `v-num-6` | 6️⃣ | Exactly SIX soccer balls in two rows of three |
| `v-num-7` | 7️⃣ | Exactly SEVEN soccer balls in two rows, four on top and three below |
| `v-num-8` | 8️⃣ | Exactly EIGHT soccer balls in two rows of four |
| `v-num-9` | 9️⃣ | Exactly NINE soccer balls in three rows of three |
| `v-num-10` | 🔟 | Exactly TEN soccer balls in two rows of five |

Los modelos **cuentan mal de 6 para arriba**. Se genera, se cuenta con el ojo, y
se repiten los que salieron mal — como con los audios. **La prioridad es 1–5**;
6–10 puede esperar a una segunda pasada.

---

## Nombres de archivo y dónde van

- Cada imagen se guarda como `<clave>.jpg` — p. ej. `v-color-red.jpg`,
  `v-body-hand.jpg`, `v-num-3.jpg`.
- Son imágenes **seculares**, no sagradas → van directo a
  `en-curso/app/public/img/` (sin el paso por `revisar/`).
- Cuando estén ahí, avisar a Claude Code: agrega las frases nuevas
  (`datos/curso.ts`), corre `generar_voces.mjs` para la voz, y las mete en
  lecciones (`datos/curriculo.ts`). El resto (repaso espaciado, rotación) se
  acomoda solo.

---

## Cómo entran al curso (plan, para hacer cuando existan las imágenes)

Estas cinco familias SON el hilo "Vida diaria" que pide la investigación.

- **Colores** → se enganchan a lo que ya ve: su camiseta es *red and white*, el
  pasto *green*, el cielo y el agua *blue*, el sol *yellow*. Marco nuevo:
  *"Show me something red."* Conecta directo con la misión TAKE IT HOME que ya
  está escrita en el guion ("encuentra algo blue en tu cuarto") pero hoy no
  tiene vocabulario detrás.
- **Cuerpo** → U5 y U6 ya tocan *forehead · chest · shoulders* en la Señal de la
  Cruz y en *Trace the Holy Cross*. Se suman *head · hand · foot · eyes · ears ·
  nose* como unidad de TPR puro: *"Touch your nose!"*, *"Clap your hands!"* — su
  canal más fuerte (§1.4).
- **Números** → estira el conteo 1-5 que hoy vive solo dentro de *Loaves and
  Fishes*. Marco: *"I see three."* Se cuentan sus pelotas, las ovejas, las
  estrellas, las velas.
- **Ropa + comida + casa** → una unidad nueva de todos los días ("A Day at Home"
  / "My House"), el contrapeso que falta a las 5 unidades de fe. Marcos:
  *"Where is the ___?"*, *"I want ___, please."* (reusa el *please* de U7).

---

## Checklist (después de generar, antes de mandarlas)

1. ¿Se ve **UNA sola cosa**? Segundo objeto, plato, mesa, piso o paisaje → repetir.
2. ¿Se coló una **letra o número escrito**? → repetir (regla dura).
3. ¿El **fondo es crema plano** de borde a borde, sin marco ni sombra de escena? → repetir.
4. Cuerpo: ¿es **el mismo niño** (misma cara, misma camiseta a rayas rojas y blancas)? → repetir.
5. Números: ¿se cuentan **de un vistazo** y hay **exactamente** esa cantidad? → repetir los que no.
