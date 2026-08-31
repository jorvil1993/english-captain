# -*- coding: utf-8 -*-
"""Genera las ilustraciones de la app de inglés de José.

Reusa el motor de imagen de creacion-de-contenido (a11_agy / a12_codex).
Reglas:
  1. ESTILO ÚNICO: Témpera/lápiz cálido, libro de cuentos infantil.
  2. JOSÉ ES SIEMPRE EL MISMO NIÑO.
  3. CERO TEXTO EN LA IMAGEN.
  4. IMÁGENES SAGRADAS van a revisar/ antes de pasar a public/img.

Uso:
    python generar_imagenes.py            # las que faltan
    python generar_imagenes.py u3-sun     # solo esa
    python generar_imagenes.py --lista    # lista completa
    python generar_imagenes.py --codex    # motor alternativo
"""
from __future__ import annotations

import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
APP = AQUI.parent / "app"
DESTINO = APP / "public" / "img"
REVISAR = AQUI / "revisar"

CREACION = AQUI.parents[3] / "creacion-de-contenido"
sys.path.insert(0, str(CREACION))
try:
    from artes import a11_agy, a12_codex  # noqa: E402
except ImportError:
    a11_agy = None
    a12_codex = None


ESTILO = (
    "Warm hand-painted children's picture-book illustration, gouache and colored "
    "pencil texture, soft rounded shapes, thick friendly outlines, warm cream "
    "background, gentle golden natural light, calm and cozy mood, flat simple "
    "composition with one clear subject, generous empty space around the subject. "
    "Square 1:1 framing. Absolutely NO text, NO letters, NO numbers, NO words, NO "
    "signs, NO logos, NO watermark and NO speech bubbles anywhere in the image. "
    "Not photorealistic, not 3D render, not anime, not glossy digital art."
)

JOSE = (
    "The boy is Jose: a cheerful 5-year-old Bolivian boy, light brown skin, short "
    "straight dark brown hair, big dark brown eyes, round cheeks, wearing a red and "
    "white striped soccer jersey, dark blue shorts and white sneakers. He is drawn "
    "exactly the same way in every illustration."
)

SAGRADO = (
    "Reverent, serene and beautiful, in the spirit of classical Catholic sacred art "
    "translated into a gentle children's book style. Dignified faces, calm "
    "expressions, no cartoon exaggeration, no silly or comical features."
)


# (clave, prompt, es_sagrada)
PIEZAS: list[tuple[str, str, bool]] = [
    # ── Portada y navegación ────────────────────────────────────────────────
    ("portada", f"{JOSE} He stands on a green grass soccer field at sunrise, holding a "
                "soccer ball under his arm, smiling at the viewer, arms open, ready to play.", False),
    ("plan-story", "An open storybook lying on a wooden table, its pages showing soft "
                   "colorful shapes, a small green hill and a sheep drawn inside, a warm "
                   "reading lamp glowing beside it.", False),
    ("plan-move", f"{JOSE} He is running and jumping joyfully in mid-air on green grass, "
                  "both arms up, full of energy.", False),
    ("plan-challenge", "A shiny golden trophy cup with a small soccer ball resting beside "
                       "it on green grass, warm sunlight, festive but calm.", False),
    ("fin", "A calm night sky with one big warm golden star over a small quiet house, "
            "soft dark blue tones, peaceful and sleepy.", False),
    ("fin-dia", "A cozy bedroom window at night with a crescent moon outside and a small "
                "soccer ball resting on the floor, warm lamp light, very calm.", False),

    # ── Unidad 1 · The Big Game ─────────────────────────────────────────────
    ("u1-ball", "A single classic black and white soccer ball resting on bright green "
                "grass, centered, warm sunlight, nothing else in the frame.", False),
    ("u1-run", f"{JOSE} He is running fast across green grass, side view, legs mid-stride, "
               "happy determined face.", False),
    ("u1-jump", f"{JOSE} He is jumping high with both feet off the ground and both arms "
                "raised, joyful.", False),
    ("u1-kick", f"{JOSE} He is kicking a soccer ball with his right foot, side view, the "
                "ball just leaving his foot.", False),
    ("u1-stop", f"{JOSE} He stands completely still with one open palm raised forward in a "
                "clear stop gesture, calm face.", False),
    ("u1-goal", "A soccer goal with a white net on green grass, a ball hitting the back of "
                "the net, bright celebratory sunlight.", False),
    ("u1-i-can", f"{JOSE} He stands strong with both fists pressed to his chest, chin up, "
                 "confident and proud.", False),
    ("u1-good-game", "Two little boys in soccer jerseys, one in red and white stripes and one "
                     "in blue, shaking hands and smiling warmly at each other on a grass "
                     "field after a match.", False),
    ("u1-c1", f"{JOSE} He stands at the entrance of a small friendly neighborhood soccer "
              "stadium at sunrise, ball under his arm, looking excited.", False),
    ("u1-c2", "A soccer ball sitting alone in the center circle of a green field, morning "
              "light, empty stadium behind, calm anticipation.", False),
    ("u1-c3", f"{JOSE} He is running and leaping over the grass chasing the ball, other "
              "small players blurred softly in the background.", False),
    ("u1-c4", f"{JOSE} He has just kicked the ball into the goal and the net is bulging, he "
              "is celebrating with both arms raised.", False),
    ("u1-c5", f"{JOSE} He sits alone on the grass with his chin on his knees, quiet and sad, "
              "the ball resting beside him, soft late afternoon light. Gentle and tender.", False),
    ("u1-c6", f"{JOSE} He stands up and shakes hands with a boy in a blue jersey, both "
              "smiling, warm golden light, a moment of real friendship.", False),
    ("mision-u1", "Two hands, one small child's hand and one adult hand, clasping in a warm "
                  "handshake, soft warm light.", False),

    # ── Unidad 2 · The Lost Sheep (SAGRADAS) ────────────────────────────────
    ("u2-shepherd", f"{SAGRADO} The Good Shepherd: a young shepherd in a simple blue and "
                    "cream robe standing on a green hill among his sheep, a shepherd's staff "
                    "in his hand, gentle and loving face, warm golden light.", True),
    ("u2-sheep", "One small fluffy white lamb standing on green grass, looking up, soft and "
                 "gentle, warm light.", False),
    ("u2-my-name", f"{SAGRADO} The Good Shepherd kneels down to the level of one single lamb "
                   "and looks straight into its eyes, calling it, tender and personal.", True),
    ("u2-come", f"{SAGRADO} The Good Shepherd stands with one hand extended forward in a "
                "welcoming inviting gesture, sheep walking toward him.", True),
    ("u2-follow", "A path of small footprints going up a green hill toward a warm golden "
                  "light, a few sheep walking along the path.", False),
    ("u2-lost", "One small white lamb alone among grey rocks at dusk, looking around, small "
                "and lost but not frightening, a soft distant light on the horizon.", False),
    ("u2-found", f"{SAGRADO} The Good Shepherd has found the lost lamb and lifts it gently "
                 "with both arms, overwhelming joy and relief on his face, golden light.", True),
    ("u2-i-love-you", f"{SAGRADO} The Good Shepherd carries the lamb on his shoulders, "
                      "walking home along a green hill at sunset, deeply peaceful.", True),
    ("u2-c1", f"{SAGRADO} The Good Shepherd on a wide green hillside surrounded by a large "
              "flock of white sheep under a warm blue sky.", True),
    ("u2-c2", f"{SAGRADO} The Good Shepherd calls out with his hands cupped near his mouth "
              "and the sheep turn their heads toward him and start walking to him.", True),
    ("u2-c3", "A single small white lamb standing alone in a wide empty rocky field, seen "
              "from far away, quiet and small, soft dusk light.", False),
    ("u2-c4", f"{SAGRADO} The Good Shepherd walks with his staff through rocks and bushes at "
              "dusk, searching, lantern light, determined and calm.", True),
    ("u2-c5", f"{SAGRADO} The Good Shepherd finds the lamb behind a rock and reaches out to "
              "it with both hands, the lamb looking up at him, great joy.", True),
    ("u2-c6", f"{SAGRADO} The Good Shepherd carries the lamb on his shoulders back to the "
              "flock at sunset, all the sheep gathered around, warm and homey.", True),
    ("mision-u2", "A small family dinner table seen from above with simple plates and bread, "
                  "warm lamp light, two pairs of hands joined in a short prayer.", False),

    # ── Unidad 3 · God Made the World ───────────────────────────────────────
    ("u3-sun", "A brilliant warm golden sun smiling softly in a clear pastel blue sky, "
               "gentle warm rays shining down on green rolling hills.", False),
    ("u3-stars", "A peaceful night sky filled with twinkling warm golden stars and a "
                 "gentle crescent moon, deep soft indigo blue background.", False),
    ("u3-water", "A crystal-clear gentle stream of blue water flowing over smooth stones, "
                 "warm sunlight reflecting on the ripples, fresh and clean.", False),
    ("u3-trees", "Three lush green leafy trees standing on a small grassy hill with colorful "
                 "wildflowers at their base, gentle breeze.", False),
    ("u3-birds", "Two little colorful songbirds perched on a blooming branch, singing "
                 "joyfully with tiny musical notes floating in the warm air.", False),
    ("u3-beautiful", "A colorful meadow with flowers, butterflies and a rainbow in the soft "
                     "distance, radiant and peaceful.", False),
    ("u3-thank-god", f"{JOSE} He stands with his hands folded in prayer, looking up at the "
                     "sky with a grateful happy smile, warm light.", False),
    ("u3-all-good", "A bright green apple, a flower and a shining sun grouped harmoniously, "
                    "symbolizing goodness in creation.", False),
    ("u3-c1", "A luminous warm golden light spreading over quiet mountains and green hills at dawn.", False),
    ("u3-c2", f"{JOSE} He looks up at a starry night sky with wonder, pointing at a bright star.", False),
    ("u3-c3", "A wide blue ocean with gentle waves under a warm sunny sky, dolphins leaping softly.", False),
    ("u3-c4", f"{JOSE} He listens with his hand cupped to his ear as little birds sing in a tree.", False),
    ("u3-c5", "A blooming meadow with green trees, bright flowers and gentle sunshine.", False),
    ("u3-c6", f"{JOSE} He sits with hands together in prayer under a tree, smiling at the sky.", False),
    ("mision-u3", "A small child and father looking up together at the blue sky and sun.", False),

    # ── Unidad 4 · The Holy Family ──────────────────────────────────────────
    ("u4-jesus", f"{SAGRADO} Baby Jesus in a simple wooden crib with soft straw, glowing "
                  "with gentle divine warmth, serene and holy.", True),
    ("u4-mary", f"{SAGRADO} The Virgin Mary in a soft blue mantle, looking down with infinite "
                 "motherly tenderness and love, holding white lilies.", True),
    ("u4-joseph", f"{SAGRADO} Saint Joseph holding a carpenter's tool and a flowering staff, "
                   "gentle, strong, protective and noble face.", True),
    ("u4-family", f"{SAGRADO} The Holy Family: Mary, Joseph and little boy Jesus holding hands "
                   "together in a loving circle in Nazareth.", True),
    ("u4-home", "A cozy warm stone house in Nazareth with flowers in the window and a wooden "
                "door, gentle sunlight.", False),
    ("u4-help", f"{JOSE} He carries a small wooden bowl carefully with two hands, helping out "
                "with a proud happy smile.", False),
    ("u4-pray", "A father, mother and little boy praying together with hands folded around a "
                "warm candlelight in their living room.", False),
    ("u4-bless", "Two open hands offering a warm gentle golden blessing over a happy home.", False),
    ("u4-c1", "A tranquil village scene of ancient Nazareth with olive trees and simple houses at sunrise.", False),
    ("u4-c2", f"{SAGRADO} Mary holding young Jesus close, singing softly to him.", True),
    ("u4-c3", f"{SAGRADO} Saint Joseph carving a piece of wood in his workshop, calm and strong.", True),
    ("u4-c4", f"{SAGRADO} Boy Jesus handing a wooden block to Saint Joseph in the workshop with joy.", True),
    ("u4-c5", f"{SAGRADO} The Holy Family standing together at evening prayer with peaceful expressions.", True),
    ("u4-c6", f"{SAGRADO} The Holy Family embracing warmly in the golden sunset light.", True),
    ("mision-u4", "A family smiling warmly around a table, blessing one another.", False),

    # ── Unidad 5 · Holy Angels & Heroes ─────────────────────────────────────
    ("u5-angel", f"{SAGRADO} A radiant Guardian Angel in a cream robe with luminous feathered "
                  "wings, standing protectively near a little child.", True),
    ("u5-michael", f"{SAGRADO} Saint Michael the Archangel with a golden shield and a shining "
                    "breastplate, brave, noble, triumphant and victorious.", True),
    ("u5-brave", f"{JOSE} He stands tall with a small toy shield and a brave confident smile, "
                 "warm golden light around him.", False),
    ("u5-no-fear", "A little child looking calmly at shadows that transform into soft warm light, "
                   "peaceful and secure.", False),
    ("u5-light", "A single burning candle flame glowing brightly in a cozy warm golden lantern.", False),
    ("u5-guide", "Two glowing footprints of light leading safely along a peaceful path through a green forest.", False),
    ("u5-friend", f"{JOSE} He walks happily on grass beside the translucent glowing form of his Guardian Angel.", False),
    ("u5-glory-god", "A choir of gentle little angels with golden halos rejoicing in the clouds with trumpets and harps.", True),
    ("u5-c1", f"{SAGRADO} A Guardian Angel watching lovingly over a child sleeping soundly in bed.", True),
    ("u5-c2", f"{SAGRADO} Saint Michael holding his shield of truth, defending with strength and peace.", True),
    ("u5-c3", f"{JOSE} He smiles fearlessly in the dim evening light, knowing he is protected.", False),
    ("u5-c4", f"{JOSE} He stands with his fists on his hips, full of courage and joy.", False),
    ("u5-c5", f"{JOSE} He walks down a sunny path with his Guardian Angel guiding him.", False),
    ("u5-c6", "Angels and children looking up together praising God in golden sunlight.", True),
    ("mision-u5", "A child kneeling beside his bed at night with hands folded in prayer.", False),

    # ── Unidad 6 · The House of God ─────────────────────────────────────────
    ("u6-church", "A beautiful, welcoming Catholic parish church with a cross on the steeple, "
                  "surrounded by green trees and flowers.", False),
    ("u6-altar", f"{SAGRADO} A reverent church altar covered in a clean white cloth, two "
                  "burning candles and a golden crucifix centered.", True),
    ("u6-cross", "A simple noble wooden crucifix with a golden halo behind it, peaceful and sacred.", True),
    ("u6-bible", "A large open Holy Bible with gold-edged pages and a red ribbon bookmark on a wooden lectern.", False),
    ("u6-bell", "A bronze church bell swinging joyfully in a belfry with golden sound rings floating out.", False),
    ("u6-quiet", f"{JOSE} He enters a quiet church with his finger to his lips, reverent and peaceful.", False),
    ("u6-bread", "A simple golden paten with holy bread on an altar table, soft divine light.", True),
    ("u6-peace", "A pure white dove carrying a green olive branch in its beak against a soft sky.", False),
    ("u6-c1", "A church exterior with ringing bells and families walking warmly to the door.", False),
    ("u6-c2", f"{JOSE} He walks into the sunlit church with respectful quiet steps.", False),
    ("u6-c3", f"{JOSE} He dips his fingers in the holy water font and makes the Sign of the Cross.", False),
    ("u6-c4", "A priest in green vestments reading the gospel from the ambo.", True),
    ("u6-c5", "The golden altar illuminated by soft warm sanctuary lamps and candlelight.", True),
    ("u6-c6", "People in church shaking hands with warm smiles exchanging the sign of peace.", False),
    ("mision-u6", "Two people exchanging a friendly handshake and a smile of peace.", False),

    # ── Unidad 7 · A Day with Mom & Dad ─────────────────────────────────────
    ("u7-good-morning", "A bright morning sun rising over a small house, birds singing, fresh and cheerful.", False),
    ("u7-good-night", "A calm crescent moon and stars over a small cozy house at night, soft blue, safe.", False),
    ("u7-how-are-you", f"{JOSE} He stands with both palms open and raised in a friendly questioning gesture, smiling.", False),
    ("u7-im-happy", f"{JOSE} Close up of his face beaming with a huge genuine happy smile.", False),
    ("u7-please", "A tall clear glass of milk on a wooden kitchen table in warm morning light.", False),
    ("u7-thank-you", f"{JOSE} He has one hand on his chest moving outward in a thank-you gesture.", False),
    ("u7-im-sorry", f"{JOSE} He stands with his hand on his heart, looking down, quiet and sincere.", False),
    ("u7-i-love-you-all", f"{JOSE} He embraces both his mother and father together in a warm family hug.", False),
    ("u7-c1", "A sunny bedroom in the morning with golden light streaming onto a small bed.", False),
    ("u7-c2", f"{JOSE} He waves cheerful good morning to his parents in the sunny kitchen.", False),
    ("u7-c3", "A family breakfast table with fruit, milk, bread and happy morning conversation.", False),
    ("u7-c4", "A glass of milk tipped over on the table, handled calmly without anger.", False),
    ("u7-c5", f"{JOSE} He looks up at his parents with his hand on his heart saying sorry.", False),
    ("u7-c6", "Parents tucking their little son into bed with a bedtime hug and prayer.", False),
    ("mision-u7", "A child greeting his parents with a big morning smile.", False),

    # ── Oraciones (SAGRADAS) ────────────────────────────────────────────────
    ("o-cross", f"{SAGRADO} A simple wooden cross standing on a green hill at sunrise, warm "
                "golden light behind it, peaceful and hopeful.", True),
    ("o-angel", f"{SAGRADO} A gentle guardian angel with soft large wings watching over a "
                "sleeping child in bed, warm protective light, serene.", True),
    ("o-grace", "A simple loaf of bread and a bowl on a wooden table with warm light from a "
                "window, humble and grateful.", False),
    ("o-hail-mary", f"{SAGRADO} The Virgin Mary in a blue mantle with her hands joined in "
                    "prayer, serene and motherly face, soft golden light, white roses at her "
                    "feet.", True),
    ("o-glory", f"{SAGRADO} Warm golden rays of light breaking through soft clouds over a "
                "green landscape, luminous and joyful.", True),
    ("o-michael", f"{SAGRADO} Saint Michael the Archangel standing firm with his shield and "
                  "gentle protective radiance.", True),
    ("o-trust", f"{SAGRADO} The merciful heart of Jesus radiating soft red and pale rays of "
                "love and peace, deeply comforting.", True),

    # ── Fondos de los mini juegos de movimiento ─────────────────────────────
    # Son FONDOS, no escenas: los personajes se dibujan encima y se mueven con
    # el dedo. Por eso los tres piden explícitamente el centro vacío — una
    # imagen "completa" y bien compuesta acá sería un estorbo, porque taparía
    # justo donde ocurre el juego. Y por eso ninguno lleva figura sagrada: un
    # fondo se coloca solo, y las imágenes sagradas las aprueba Jorge a mano
    # (regla 10).
    ("mjx-hillside", "An empty grassy green hillside on a warm sunny day, gentle rolling "
                     "slope, a few small wildflowers near the bottom edge, wide soft blue "
                     "sky with two or three small clouds in the upper area. Completely "
                     "empty: no people, no animals, no buildings, no baskets. The centre of "
                     "the image is plain grass and plain sky with nothing in it.", False),
    ("mjx-belfry", "The inside of a small old country church bell tower, warm sandstone "
                   "walls, two tall rounded arch windows on the left and right sides showing "
                   "pale morning sky, a thick wooden beam crossing the very top of the frame, "
                   "worn wooden floor at the bottom. Completely empty: no bells, no ropes, no "
                   "people. The whole middle of the image is empty air between the walls.", False),
    ("mjx-dawn-sky", "A wide calm dawn sky in soft blue and warm cream, a few small round "
                     "clouds near the top corners, and a strip of green meadow along the very "
                     "bottom edge with tiny daisies. Completely empty: no people, no animals, "
                     "no buildings. The whole centre is open sky with nothing in it.", False),
]


def ruta(clave: str, sagrada: bool) -> Path:
    return (REVISAR if sagrada else DESTINO) / f"{clave}.jpg"


def generar(clave: str, prompt: str, sagrada: bool, motor: str = "agy") -> Path:
    destino = ruta(clave, sagrada)
    destino.parent.mkdir(parents=True, exist_ok=True)
    completo = f"{prompt}\n\n{ESTILO}"
    if a11_agy is None:
        raise RuntimeError("Los módulos de arte no están disponibles en este entorno.")
    modulo = a12_codex if motor == "codex" else a11_agy
    salida, _ = modulo.generar_imagen(completo, destino)
    return salida


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    solo_listar = "--lista" in sys.argv
    motor = "codex" if "--codex" in sys.argv else "agy"

    pendientes = []
    for clave, prompt, sagrada in PIEZAS:
        if args and clave not in args:
            continue
        if ruta(clave, sagrada).exists() and not args:
            continue
        pendientes.append((clave, prompt, sagrada))

    if solo_listar:
        hechas = sum(1 for c, _, s in PIEZAS if ruta(c, s).exists())
        print(f"{hechas}/{len(PIEZAS)} listas. Faltan {len(pendientes)}:")
        for c, _, s in pendientes:
            print(f"  {'[sagrada] ' if s else ''}{c}")
        return 0

    if not pendientes:
        print("Todas las imágenes ya están.")
        return 0

    print(f"Generando {len(pendientes)} imágenes con {motor}...")
    fallos = []
    for i, (clave, prompt, sagrada) in enumerate(pendientes, 1):
        marca = " [SAGRADA -> revisar/]" if sagrada else ""
        print(f"  [{i}/{len(pendientes)}] {clave}{marca}", flush=True)
        try:
            salida = generar(clave, prompt, sagrada, motor)
            print(f"      -> {salida.relative_to(AQUI.parent)}", flush=True)
        except Exception as e:  # noqa: BLE001
            print(f"      FALLO: {e}", flush=True)
            fallos.append(clave)

    if fallos:
        print(f"\nFallaron {len(fallos)}: {', '.join(fallos)}")
        return 1
    print("\nListo.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
