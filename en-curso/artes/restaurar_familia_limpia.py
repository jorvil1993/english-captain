import shutil
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

mary_src = BRAIN / "u4_mary_1788150196687.jpg"

if mary_src.exists():
    # Restaurar la pintura original completa sin recortes feos ni parches de collage
    shutil.copyfile(mary_src, IMG_DIR / "u4-family.jpg")
    print("u4-family.jpg restaurada a la pintura original completa y limpia!")
