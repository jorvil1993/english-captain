# Cómo se le enseña inglés a José — la investigación antes de programar

*Claude Code · 30 de agosto de 2026 · base metodológica de la app*

Este documento contesta una sola pregunta: **¿cuál es la forma más efectiva, según
la evidencia disponible hoy, de que un niño hispanohablante de 4 años (5 el 27 de
septiembre) aprenda inglés desde una tablet, sin que eso le haga daño?** De aquí
sale el diseño de la app; nada se programa "porque se ve lindo".

Se cruzan tres cosas: (1) la ciencia del aprendizaje de segundas lenguas en
preescolares, (2) el perfil real de José —`crianza/PERFIL_PROFUNDO_Familia.md`,
colérico primario + sanguíneo secundario, validado en julio— y (3) el marco
católico. Las tres tienen que coincidir en cada pantalla o la pantalla no se hace.

---

## 1. Los diez hallazgos que mandan sobre el diseño

### 1.1 La unidad de aprendizaje es la FRASE, no la palabra

Los niños pequeños no arman oraciones juntando palabras sueltas: adquieren
**bloques prefabricados** ("formulaic sequences", "chunks") que procesan enteros,
sin descomponerlos. *"Where is the ball?"* entra a la cabeza como una sola pieza,
igual que "buenosdías" entró en español. Recién después el niño empieza a
despiezarlos y a producir combinaciones nuevas. Con adultos pasa distinto —ellos
sí prefieren palabra por palabra porque les da sensación de control— pero para un
niño de 4 años el chunk es el camino natural.

→ **La app enseña frases completas y útiles, nunca listas de palabras.** El
"nivel" no es "20 palabras nuevas"; es "8 frases que puede usar hoy".

### 1.2 El mecanismo que hace que la pantalla funcione o no es la CONTINGENCIA social

Este es el hallazgo más importante de todos, y el que descarta a la mayoría de las
apps del mercado. Roseberry, Hirsh-Pasek y Golinkoff (*Child Development*)
enseñaron verbos nuevos a niños en tres condiciones: persona en vivo, videollamada
y video grabado que *simulaba* interacción (hacía pausas como si esperara
respuesta, pero seguía igual pasara lo que pasara). **Los niños aprendieron en
vivo y por videollamada. Del video no aprendieron nada.** La diferencia no era la
pantalla: era si el otro lado **responde a este niño en particular, ahora**.

Es lo mismo que explica el "video deficit" / "transfer deficit": lo que se ve en
pantalla se transfiere peor a la vida real *salvo* que haya respuesta contingente.

→ **Todo en la app tiene que reaccionar a José, por su nombre, en el momento.**
Nada de video corrido. Y el mayor multiplicador disponible es que **papá o mamá
jueguen un pedacito con él** — eso convierte la pantalla en conversación.

### 1.3 Las cuatro columnas de una app que de verdad educa

Hirsh-Pasek y colegas (*Psychological Science in the Public Interest*, 2015)
revisaron la ciencia del aprendizaje y sacaron el criterio para juzgar apps
infantiles. Una app educa si es:

1. **Activa** — la mente trabaja, no solo el dedo. Deslizar no es aprender.
2. **Enfocada** — sin campanitas, animaciones y premios que distraigan del
   contenido. Los adornos "divertidos" compiten con el aprendizaje y ganan.
3. **Con significado** — conectada a la vida del niño, no a un mundo abstracto.
4. **Socialmente interactiva** — con otro (persona o personaje que responde).

Y todo eso **dentro de una meta de aprendizaje sostenida**, no saltando de tema.

### 1.4 El cuerpo se mueve o no queda nada (TPR)

El *Total Physical Response* de Asher —orden en inglés + movimiento del cuerpo—
tiene respaldo empírico consistente en preescolar: los gestos que acompañan
mejoran la retención de palabras, estructuras y frases nuevas, porque se codifica
por vía kinestésica, visual y auditiva a la vez. Los estudios con ejercicio físico
integrado a la clase de vocabulario en preescolar van en la misma dirección.

→ **Cada frase de la app tiene un gesto obligatorio.** "Jump!" se salta de
verdad, con la tablet apoyada. Para un niño con la energía de José esto no es un
adorno: es la única forma de que se quede.

### 1.5 Los cuentos enseñan más vocabulario que las canciones (pero las dos hacen falta)

En preescolares de inglés como lengua extranjera se comparó aprender vocabulario
con canciones, con cuentos y con las dos cosas: **el cuento gana en vocabulario
incidental**. Y el "storytelling elaborativo interactivo" —el adulto para,
pregunta, expande— superó tanto a la relectura repetida como al entrenamiento de
conciencia fonológica en un estudio con 293 preescolares.

La canción no es inútil: es lo que instala **prosodia, ritmo y automatismo** de
las frases hechas. Pero el significado lo carga el cuento.

→ **Cuento corto con preguntas dentro** como columna vertebral de cada unidad, y
canción como cierre y automatización de esas mismas frases.

### 1.6 Repetición espaciada + recuperación, no repetición seguida

Leonard, Deevy y Kueser (preescolares de 4-5 años) mostraron que el aprendizaje de
palabras nuevas mejora cuando se incluye **recuperación espaciada** —hacerlo
*recordar* la palabra después de un intervalo, no solo volvérsela a mostrar— y que
mezclar recuperación inmediata con recuperación espaciada da mejor recuerdo de
forma y significado, sostenido **una semana después**.

→ La app no repite la frase cinco veces seguidas. La pide de nuevo a los 2
minutos, al día siguiente y a los 4 días. Un motor de repaso simple, invisible
para el niño.

### 1.7 La dosis: 15-20 minutos TODOS los días le gana a una hora el sábado

El proyecto *Barcelona Age Factor* encontró que en el aprendizaje escolar de
inglés pesa más **el número total de horas de exposición** que la edad de inicio.
En el estudio *SparkLing* con niños hispanohablantes en Madrid (45 min diarios con
tutores nativos, con habla dirigida al niño, respuesta contingente, varios
hablantes y juego), las vocalizaciones en inglés por hora pasaron de 12,2 a 53,6
en 18 semanas, y la asistencia acumulada explicaba varianza adicional por encima
de la edad. El nivel socioeconómico no importó.

La cifra de "30% de las horas de vigilia" que circula es para volverse bilingüe
activo — no es nuestra meta ni sería sano por pantalla. **Nuestra meta es
comprensión sólida y producción de frases**, y para eso 15-20 minutos diarios
constantes es un objetivo real y compatible con el punto 1.10.

### 1.8 El reconocimiento de voz NO sirve para calificar a un niño de 4 años

La evidencia es clara: el ASR (reconocimiento automático del habla) es efectivo
sobre todo de 18 años para arriba; hasta que existan mejores bases de datos de
habla infantil, **los sistemas actuales son inadecuados para niños pequeños**, y
el habla de menores de 6 está particularmente poco estudiada. Un sistema que le
diga "mal" a José por su pronunciación estaría equivocado técnicamente **y** sería
catastrófico con su sensibilidad a la burla (§2).

→ **El micrófono graba y devuelve; no juzga.** José se escucha, se le aplaude
siempre, y su grabación queda para mostrársela a papá. Cero calificación de
pronunciación.

### 1.9 Primero entiende, mucho después habla (y eso está bien)

Es normal y esperable un **período silencioso**: meses de comprensión antes de
producción. Incluso con exposición intensiva, muchos niños desarrollan primero
—o solo— habilidades receptivas. Además, a los 5 años los niños todavía
categorizan vocales extranjeras como si fueran nativas y son menos consistentes
que los adultos: su sistema fonológico está en obra.

→ **Se mide comprensión** (señala la imagen correcta, ejecuta la orden), no
producción. Si José entiende y todavía no habla, la app va bien, no mal.

### 1.10 Pantalla: la regla ya no es solo el reloj, es la compañía

La AAP recomienda para 2-5 años **1 hora al día de programación de alta calidad,
viéndola con el niño**, evitando programas de ritmo rápido (los niños pequeños los
entienden peor), apps con mucho contenido distractor y cualquier violencia. Su
marco actual, las **5 C**, mueve el eje de la cantidad a la calidad: **Child** (la
etapa del niño), **Content** (qué consume), **Calm** (que no altere rutinas ni
sirva siempre para calmarlo), **Crowding Out** (que no desplace sueño, juego y
movimiento) y **Communication** (que se hable de lo que ve).

Una revisión sistemática de 2025 sobre pantallas interactivas y lenguaje hasta los
6 años encuentra lo mismo desde el otro lado: el uso prolongado (>2-4 h/día) se
asocia a retrasos expresivos, pero el **co-visionado con conversación mejora el
vocabulario**, y el contenido educativo e interactivo con un adulto presente
favorece el lenguaje mientras el consumo pasivo lo perjudica.

→ Tres decisiones duras: **tope diario con corte real** (no "un ratito más"),
**ritmo lento y con silencios** (nada de cortes rápidos ni fuegos artificiales), y
**momentos que empujan a José fuera de la pantalla** — a buscar algo en la casa, a
mostrarle algo a papá, a rezar en voz alta.

---

## 2. Lo que cambia porque es José y no "un niño de 4 años"

Del perfil validado (`crianza/PERFIL_PROFUNDO_Familia.md`, §1):

| Rasgo de José | Qué obliga en la app |
|---|---|
| **Colérico primario**: quiere mandar, ser el primero, necesita saber el plan | Pantalla de inicio con **el plan visible** (3 fichas) y **él elige el orden**. Es el capitán, no el alumno. |
| **Le mueve competir y ganar** | Retos ("¿a que no puedes decir las 3 en inglés?"), cronómetro contra sí mismo. |
| **Odia perder — se enoja, llora** | **Nunca pierde contra la app.** No hay rival, no hay "game over", no hay vidas. Compite contra su marca anterior y siempre termina. |
| **Sensibilidad a la burla — no la tolera** | **Cero sonido de error.** Nada de buzzer, cara triste o "¡uy, no!". Un fallo = el personaje lo vuelve a decir bien, tranquilo, y sigue. Modelo Don Bosco: mostrar lo lindo, nunca ridiculizar. |
| **Sanguíneo secundario: se aburre y salta** | Actividades de **2-4 minutos**, formatos alternados. Micro-hábito diario, no sesión larga (el padre Paulo: "es mejor lo menos perseverante que lo mucho ocasional"). |
| **No juega solo, necesita público** | El personaje **reacciona y aplaude** (audiencia inmediata) y la app guarda su grabación como **"para mostrarle a papá"** (audiencia diferida). Más un **"momento papá" de 3 minutos** al final. |
| **Se cierra si lo presionan** (se tapa los oídos) | Nunca se le exige repetir. Se le invita; si no habla, la actividad avanza igual. |
| **El cansancio es su disparador #1** | Corte antes de que se sature, y uso recomendado en la **ventana de la mañana** — la misma en que sí atiende en misa. |
| **Necesita anticipación** | Aviso de transición dentro de la app: "dos más y terminamos", igual que en casa. |
| **Reza si el formato es breve, compartido y sin presión** (rosario en el auto sí; misa larga no) | La oración en inglés dura **20 segundos**, tiene gesto, se canta o se dice con papá. Nunca es un "ejercicio" ni se evalúa. |

---

## 3. El marco católico: no es una capa de pintura

La pregunta no es "cómo le meto contenido católico al inglés" sino **cuál es la
pedagogía católica propia de un niño de 4-5 años**. Existe y está probada: la
**Catequesis del Buen Pastor** (Sofía Cavalletti, biblista, con Gianna Gobbi,
montessoriana; Roma, 1954).

Sus tesis, que encajan exactamente con lo que necesitamos:

- El niño de **3 a 6 años** tiene un **potencial religioso propio** — no es un
  adulto chiquito al que hay que explicarle doctrina; es una edad de especial
  capacidad de asombro y de relación con Dios.
- A esa edad lo que más lo toca es la imagen del **Buen Pastor que llama a sus
  ovejas por su nombre** y da la vida por ellas. Esa es la puerta, no el
  catecismo.
- Aprende **sensorialmente**: gestos, objetos reales, repetición, silencio.
- El catequista **no explica: presenta y se calla**, para que el niño se encuentre
  con Dios él mismo.

Es literalmente el mismo diseño que pide la ciencia del punto 1: concreto,
gestual, repetido, con significado, sin sermón. **La app puede ser católica y
efectiva con el mismo movimiento, no con dos.**

Y "el Buen Pastor llama a cada oveja **por su nombre**" es, además, la imagen que
justifica la contingencia del punto 1.2: la app le habla a José por su nombre.

**Las metas de virtud ya declaradas por ustedes** (§5 del perfil) son el destino:
1. Amor a Dios / piedad · 2. Obediencia y respeto · 3. Dominio propio ·
4. Fortaleza y esfuerzo. Cada unidad de inglés se etiqueta con la virtud que toca.

**Regla de corrección, de Don Bosco vía el padre Paulo:** para un niño de esta
edad el lenguaje moral es **"feo o lindo"**, no "bueno o malo" abstracto. Y jamás
por la fuerza ni por el miedo — "háblales de la fealdad del pecado y de la belleza
de la virtud".

---

## 4. El diseño que sale de todo lo anterior

**Nombre de trabajo:** *English with the Good Shepherd* — "Capitán José".

### La forma de una sesión (12-18 min, una al día)

```
0. EL PLAN (30 s)        José ve 3 fichas y elige el orden. Él manda.
1. PRAYER (30 s)         Oración cantada en inglés, con gesto. Siempre la misma.
2. STORY (4 min)         Cuento ilustrado, voz nativa, 6-8 frases nuevas.
                         Se detiene y le pregunta a él. Si no contesta, sigue amable.
3. MOVE IT (3 min)       TPR puro: la voz da órdenes, José las hace con el cuerpo.
4. THE CHALLENGE (3 min) Reto contra su propio récord. Nunca pierde.
5. SAY IT (2 min)        Graba su voz. Se escucha. Aplauso. Se guarda para papá.
6. TAKE IT HOME (30 s)   Misión fuera de la pantalla: "dile 'good morning' a mamá",
                         "encuentra algo blue en tu cuarto".
7. STOP                  Corte real. Se apaga. "Tomorrow, Captain."
```

### Los tres hilos del contenido

1. **Vida diaria** — saludos, comida, familia, casa, colores, números, cuerpo,
   ropa, emociones, cortesía (*please, thank you, sorry, may I...*).
2. **La fe** — el Buen Pastor, la Creación, los ángeles, la Virgen, Navidad,
   Pascua, la misa y sus objetos, santos como héroes, y las oraciones en inglés
   (*Sign of the Cross, Guardian Angel, Hail Mary, Glory Be, grace before meals*).
3. **Fútbol** — el vocabulario del juego (*ball, pass, shoot, goal, team, run,
   jump, win, lose*) y sobre todo **el puente con la virtud**: decir *"good game"*
   cuando se pierde es dominio propio y humildad. El fútbol es el gancho y a la
   vez el gimnasio de la virtud que más le cuesta.

Los tres hilos comparten las mismas frases: *"I can see the ball" / "I can see the
Shepherd" / "I can see my mom"*. Un chunk, tres mundos — eso es lo que hace que el
chunk se despiece solo (§1.1).

### Lo que la app NO va a hacer (prohibiciones que salen de la evidencia)

- ❌ Calificar pronunciación (§1.8) · ❌ Sonido o cara de error (§2)
- ❌ Perder, morir, quedarse sin vidas (§2) · ❌ Autoplay o "un video más" (§1.10)
- ❌ Cortes rápidos, confeti, animaciones de premio constantes (§1.3, §1.10)
- ❌ Texto escrito que él tenga que leer (tiene 4 años)
- ❌ Traducción como método por defecto — el español entra solo como **rescate
  breve** cuando algo no se entiende, no como muleta permanente
- ❌ Publicidad, compras, links externos, cualquier conexión que no controlemos
- ❌ Contenido que "entretenga" sin enseñar, solo para retenerlo más tiempo

### Cómo sabremos si funciona

Nada de puntajes para él. Un **panel para ustedes**, con tres cosas:

1. **Comprensión** (lo que importa a esta edad): % de aciertos al señalar la
   imagen correcta, por frase.
2. **Producción**: cuántas frases intenta decir por sesión — la métrica del
   estudio SparkLing (vocalizaciones), no la "corrección".
3. **Transferencia**: la única que cuenta de verdad — ¿le dijo *"good morning"* a
   mamá con la tablet apagada? Se marca a mano.

### Tecnología (propuesta)

- **PWA React + Vite**, igual que `crianza/app-crianza` — stack ya probado por
  ustedes, se instala en la tablet como app y **funciona 100% sin internet**.
- **Audio pregrabado** con voces nativas (varias voces: SparkLing usa múltiples
  hablantes) empaquetado dentro de la app. Sin internet, sin latencia, sin costo
  por uso y sin riesgo de que una IA en vivo le diga algo raro a un niño de 4 años.
- **Micrófono** solo para grabar y reproducir; las grabaciones se quedan en el
  dispositivo.
- **Imágenes** generadas con el mismo pipeline que ya usan en
  `creacion-de-contenido/artes` (`agy` / `codex` por CLI), con un set de personajes
  fijo y consistente.

---

## 5. Fuentes

**Adquisición temprana de segunda lengua**
- Roseberry, Hirsh-Pasek & Golinkoff, *Skype me! Socially contingent interactions help toddlers learn language*, Child Development — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3962808/
- Hirsh-Pasek, Zosh, Golinkoff et al., *Putting Education in "Educational" Apps*, Psychological Science in the Public Interest, 2015 — https://kathyhirshpasek.com/wp-content/uploads/sites/9/2019/06/HirshPasek_ScienceofLearningApps.pdf
- *Songs, stories, and vocabulary acquisition in preschool learners of EFL*, System — https://www.sciencedirect.com/science/article/abs/pii/S0346251X17302245
- *Interactive elaborative storytelling fosters vocabulary in pre-schoolers* — https://www.sciencedirect.com/science/article/abs/pii/S0885201420301507
- Leonard, Deevy, Kueser et al., *The contributions of immediate retrieval and spaced retrieval to word learning in preschoolers* — https://pmc.ncbi.nlm.nih.gov/articles/PMC9629778/
- *The Effects of Age, Dosage, and Poverty on Second Language Learning through SparkLing in Infant Education Centers in Madrid* — https://pmc.ncbi.nlm.nih.gov/articles/PMC8656938/
- *The effects of foreign language programmes in early childhood education and care: a systematic review* — https://www.tandfonline.com/doi/full/10.1080/07908318.2021.1984498
- *Formulaic Language and Second Language Acquisition: Zipf and the Phrasal Teddy Bear*, Annual Review of Applied Linguistics — https://www.cambridge.org/core/journals/annual-review-of-applied-linguistics/article/abs/formulaic-language-and-second-language-acquisition-zipf-and-the-phrasal-teddy-bear/3E6EC1794D18E72D370FF2F6CDAF6177
- *Using Total Physical Response Method in Early Childhood Foreign Language Teaching Environments* — https://www.sciencedirect.com/science/article/pii/S1877042813035581
- *When learning a second language does not mean losing the first* — https://pubmed.ncbi.nlm.nih.gov/10218259/

**Pantallas, apps y niños pequeños**
- AAP, *Media and Young Minds* (política oficial, 2-5 años) — https://publications.aap.org/pediatrics/article/138/5/e20162591/60503/Media-and-Young-Minds
- AAP, *The 5 Cs of Media Use* — https://www.aap.org/en/patient-care/media-and-children/center-of-excellence-on-social-media-and-youth-mental-health/5cs-of-media-use/
- *Impact of the Use of Interactive Screens on Language Development in Children up to 6 Years of Age: A Systematic Review* (2025) — https://pmc.ncbi.nlm.nih.gov/articles/PMC12616778/
- Leung et al., *Short-Term Exposure to Second Language Apps Modulates Brain Responses in Preschoolers*, Infant and Child Development, 2025 — https://onlinelibrary.wiley.com/doi/10.1002/icd.70015
- *Assessing the educational potential and language content of touchscreen apps for preschool children* — https://www.sciencedirect.com/science/article/pii/S2666557322000313
- *Technology-assisted vocabulary learning for preschool children: a meta-analysis* (g = 0,73) — https://www.tandfonline.com/doi/full/10.1080/09588221.2025.2507181
- *The effectiveness of automatic speech recognition in ESL/EFL pronunciation: a meta-analysis*, ReCALL — https://www.cambridge.org/core/journals/recall/article/effectiveness-of-automatic-speech-recognition-in-eslefl-pronunciation-a-metaanalysis/A915444CF252B61D14961D2FE733822D

**Marco católico**
- Catechesis of the Good Shepherd, *The CGS Approach* — https://cgsusa.org/discover/cgs-approach/
- Sofía Cavalletti, *The Religious Potential of the Child* — https://books.google.com/books/about/The_Religious_Potential_of_the_Child.html?id=JpI2EAAAQBAJ
- `crianza/PERFIL_PROFUNDO_Familia.md` §0-§1, §5, §7 (padre Paulo Ricardo: temperamentos, educar las emociones, Don Bosco)
