# English with Captain José

App de inglés para José. Funciona **sin internet**, no manda nada a ningún lado
y se corta sola después de una sesión al día.

El porqué de cada decisión está en
`../../contexto/claude-2026-08-30-investigacion-metodo.md`. Las reglas que no se
rompen, en `../../CLAUDE.md`.

## Probarla en la computadora

```
npm install
npm run dev
```

Abre lo que imprima (normalmente http://localhost:5173). Para verla como se ve
en la tablet, activa el modo dispositivo del navegador en horizontal.

El engranaje de la esquina superior derecha abre el panel de papás: en la
computadora con un clic, en la tablet manteniéndolo apretado dos segundos (para
que José no entre por accidente).

## Instalarla en la tablet o el celular de José

**https://jorvil1993.github.io/english-captain/**

1. Abre ese link en **Chrome**, en el aparato donde la va a usar.
2. Menú de Chrome (⋮) → **Instalar aplicación** / *Añadir a pantalla de inicio*.
3. Ábrela una vez con internet para que termine de guardarse. **Desde ahí ya no
   necesita conexión nunca más**: imágenes, audio y contenido quedan adentro.

Para republicar después de cambiar algo: `node ../publicar.mjs`.

### Para que no se salga de la app

Android tiene *anclaje de pantalla*: Ajustes → Seguridad → **Anclar pantalla**.
Con eso activado, abres la app, la anclas, y José no puede salir a YouTube ni a
nada más hasta que tú la desancles. Es lo que hace que se la puedas dejar sin
mirar por encima del hombro.

### La voz

**No hay que configurar nada.** Todas las frases vienen grabadas dentro de la
app con voces neuronales (Ava, Ana, Michelle, Brian y Sofía), así que suenan
igual en cualquier aparato y sin internet.

Si alguna vez oyes la voz robótica vieja del sistema, significa que falta
generar el audio de una frase nueva:

```
cd ../artes
node generar_voces.mjs --lista   # qué falta
node generar_voces.mjs           # lo genera (necesita internet en la PC)
```

## Meter contenido nuevo

Todo el contenido está en `src/datos/curso.ts`. Una unidad son 8 frases, un
cuento de 6 escenas (con al menos dos preguntas), una canción y una misión. Los
prompts de las ilustraciones, en `../artes/generar_imagenes.py`.

```
cd ../artes
python generar_imagenes.py --lista   # qué falta
python generar_imagenes.py           # genera lo que falta
```

Las imágenes de Jesús, la Virgen y los ángeles caen en `../artes/revisar/` y no
entran a la app hasta que Jorge las mueva a mano a `public/img/`.

Y después de agregar contenido, **siempre** hay que regenerar la voz:

```
node ../artes/generar_voces.mjs
```

El audio se busca por el texto de la frase, no por un id: escribes la frase,
corres el generador y la app ya la dice. Nada más que tocar.
