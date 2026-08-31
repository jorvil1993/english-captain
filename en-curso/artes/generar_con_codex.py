import sys
from pathlib import Path

# Añadir ruta de creacion-de-contenido/artes al path
CREACION_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\creacion-de-contenido\artes")
sys.path.insert(0, str(CREACION_DIR))

import a12_codex

APP_IMG = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")

print("1. Generando Sagrada Familia Completa con Codex...")
prompt_familia = (
    "Beautiful sacred children storybook oil painting of the complete Holy Family: "
    "Saint Joseph with beard holding a wooden staff, tender Mother Mary wearing a sky blue veil, "
    "and Baby Jesus in Mary's arms wrapped in swaddling clothes with a golden halo, "
    "all together in a warm cozy Bethlehem home with golden light, unified and heartwarming sacred art, high resolution, 1:1 square"
)
dest_familia = APP_IMG / "u4-family.jpg"
try:
    ruta_f, tid_f = a12_codex.generar_imagen(prompt_familia, dest_familia, timeout=300)
    print(f"¡Sagrada Familia generada exitosamente con Codex en: {ruta_f}!")
except Exception as e:
    print(f"Error generando con Codex: {e}")

print("2. Generando God's Creation con Codex...")
prompt_creacion = (
    "Beautiful sacred children picture book gouache painting of God's Creation of the World: "
    "a smiling golden sun in brilliant blue sky, crystal clear sparkling river waterfall, "
    "lush green trees, blooming colorful meadow flowers, gentle songbirds flying, "
    "pure paradise nature landscape, vibrant, whimsical, peaceful, high resolution, 1:1 square"
)
dest_creacion = APP_IMG / "u3-beautiful.jpg"
try:
    ruta_c, tid_c = a12_codex.generar_imagen(prompt_creacion, dest_creacion, timeout=300)
    print(f"¡God's Creation generada exitosamente con Codex en: {ruta_c}!")
except Exception as e:
    print(f"Error generando creación con Codex: {e}")
