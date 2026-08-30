# -*- coding: utf-8 -*-
"""Genera las ilustraciones de la app de ingles de Jose.

Reusa el MISMO motor de imagen que ya usa creacion-de-contenido
(`artes/a11_agy.py`, la herramienta nativa de agy). No se copia pega nada del
motor: se importa. Es la regla que ya esta escrita en AGENTS.md y que existe
porque cada copia a mano del blindaje se quedo vieja y termino pidiendole a la
IA cosas que no existian.

Tres reglas propias de esta app:

  1. ESTILO UNICO. Todas las imagenes salen del mismo bloque ESTILO. Un niño de
     4 años que no lee se orienta por el dibujo: si cada pantalla parece de otro
     libro, la app deja de ser un mundo y pasa a ser un catalogo.

  2. JOSE ES SIEMPRE EL MISMO NIÑO. El bloque JOSE se repite literal en cada
     escena donde aparece. Sin eso el modelo lo redibuja distinto cada vez.

  3. NADA DE TEXTO EN LA IMAGEN. Jose no lee. Una letra en el dibujo es ruido,
     y encima el modelo las escribe mal.

Las imagenes sagradas (Jesus, la Virgen, los angeles, los santos) NO van
directo a la app: caen en `revisar/` y Jorge las aprueba una por una antes de
moverlas a public/img. Fue su decision explicita y es la correcta: una cara
sagrada mal generada es peor que no tener imagen.

Dos motores, misma interfaz. `agy` (Imagen de Google) es el de casa; `codex`
(GPT Image 2) es el plan B para cuando agy se queda sin cuota, que pasa seguido
y paso el 2026-08-30 a mitad de esta app: 13 imagenes salieron y las otras 43
se cortaron con "Quota Exhausted, resetea en 4 horas". No se espera: se cambia
de motor. Los dos modulos viven en creacion-de-contenido y se IMPORTAN.

Uso:
    python generar_imagenes.py            # las que faltan, saltando las que ya estan
    python generar_imagenes.py u1-ball    # solo esa
    python generar_imagenes.py --lista    # que hay y que falta
    python generar_imagenes.py --codex    # con el motor de Codex en vez de agy
"""
from __future__ import annotations

import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
APP = AQUI.parent / "app"
DESTINO = APP / "public" / "img"
REVISAR = AQUI / "revisar"

# El motor de imagen vive en creacion-de-contenido. Se importa, no se copia.
CREACION = AQUI.parents[3] / "creacion-de-contenido"
sys.path.insert(0, str(CREACION))
from artes import a11_agy, a12_codex  # noqa: E402


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
    # ── Portada y navegacion ────────────────────────────────────────────────
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
              "the ball resting beside him, soft late afternoon light. Gentle and tender, "
              "never pitiful or dramatic.", False),
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

    # ── Unidad 3 · A Day with Mom ───────────────────────────────────────────
    ("u3-good-morning", "A bright morning sun rising over a small house, warm yellow and "
                        "orange sky, birds, fresh and cheerful.", False),
    ("u3-good-night", "A calm crescent moon and stars over a small house at night, deep blue "
                      "and soft, sleepy and safe.", False),
    ("u3-how-are-you", f"{JOSE} He stands with both palms open and raised in a friendly "
                       "questioning gesture, curious and warm expression.", False),
    ("u3-im-happy", f"{JOSE} Close up of his face beaming with a huge genuine happy smile.", False),
    ("u3-please", "A tall clear glass of milk on a wooden kitchen table in warm morning "
                  "light, simple and inviting.", False),
    ("u3-thank-you", f"{JOSE} He has one hand on his chest moving outward in a thank-you "
                     "gesture, grateful and warm expression.", False),
    ("u3-im-sorry", f"{JOSE} He stands with his hand on his heart, looking down, quiet and "
                    "sincere, gentle and tender, never humiliated or scolded.", False),
    ("u3-i-love-you-mom", "A warm hug between a young Bolivian mother with long dark hair and "
                          "her small son in a red and white striped shirt, both with eyes "
                          "closed, very tender.", False),
    ("u3-c1", "A sunny bedroom in the early morning, warm light coming through the curtains "
              "onto a small bed, a soccer ball on the floor, cheerful.", False),
    ("u3-c2", f"{JOSE} He waves good morning to his mother in a warm sunny kitchen, both "
              "smiling.", False),
    ("u3-c3", "A simple breakfast on a wooden kitchen table: a glass of milk, bread and "
              "fruit, warm morning light.", False),
    ("u3-c4", "A glass of milk tipped over on a wooden kitchen table with milk spilling, "
              "seen calmly and gently, not dramatic, warm light.", False),
    ("u3-c5", f"{JOSE} He looks up at his mother with his hand on his heart, saying sorry, "
              "sincere and calm, warm forgiving atmosphere.", False),
    ("u3-c6", "A young Bolivian mother hugging her small son in a red and white striped "
              "shirt in a cozy bedroom at night, soft lamp light, deeply peaceful.", False),
    ("mision-u3", "A bright sunrise seen through a kitchen window with two coffee cups on "
                  "the sill, hopeful and warm.", False),

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
                "green landscape, luminous and joyful, no figures.", True),
]


def ruta(clave: str, sagrada: bool) -> Path:
    return (REVISAR if sagrada else DESTINO) / f"{clave}.jpg"


def generar(clave: str, prompt: str, sagrada: bool, motor: str = "agy") -> Path:
    destino = ruta(clave, sagrada)
    destino.parent.mkdir(parents=True, exist_ok=True)
    completo = f"{prompt}\n\n{ESTILO}"
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
        print("Todas las imagenes ya estan.")
        return 0

    print(f"Generando {len(pendientes)} imagenes con {motor}...")
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
        print("Volve a correr el script: retoma solo las que faltan.")
        if motor == "agy":
            print("Si el motivo es la cuota de agy, proba: python generar_imagenes.py --codex")
        return 1
    print("\nListo.")
    if REVISAR.exists() and any(REVISAR.iterdir()):
        print(f"Revisa las sagradas en {REVISAR} y mové a mano las que apruebes a")
        print(f"{DESTINO}. Ninguna imagen de Jesus, la Virgen o un angel entra a la")
        print("app sin que Jorge la haya visto.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
