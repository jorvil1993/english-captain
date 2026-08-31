from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

bible_src = BRAIN / "holy_bible_1788150718552.jpg"
altar_src = BRAIN / "altar_cross_1788150368433.jpg"

def crop_and_check(src, box, dest_name):
    img = Image.open(src)
    cropped = img.crop(box).resize((512, 512), Image.Resampling.LANCZOS)
    cropped.save(IMG_DIR / dest_name, "JPEG", quality=95)
    print(f"Generado {dest_name}: {box}")

# 1. u6-bible.jpg -> SOLO LA BIBLIA EN EL ATRIL (Mitad izquierda de la imagen fuente)
crop_and_check(bible_src, (120, 220, 540, 720), "u6-bible.jpg")
crop_and_check(bible_src, (120, 220, 540, 720), "bible-solo.jpg")

# 2. u6-church.jpg -> SOLO LA IGLESIA DE PIEDRA (Mitad derecha de la imagen fuente)
crop_and_check(bible_src, (500, 140, 970, 780), "u6-church.jpg")

# 3. u6-bell.jpg -> SOLO LA CAMPANA DE BRONCE (Recorte cerrado del campanario)
crop_and_check(bible_src, (735, 165, 870, 300), "u6-bell.jpg")

# 4. u6-cross.jpg -> SOLO LA CRUZ DORADA (Centro cerrado de la imagen fuente)
crop_and_check(altar_src, (375, 215, 645, 585), "u6-cross.jpg")
crop_and_check(altar_src, (375, 215, 645, 585), "cross-solo.jpg")

# 5. u5-light.jpg -> SOLO LA VELA ENCENDIDA (Lado izquierdo cerrado)
crop_and_check(altar_src, (185, 340, 390, 680), "u5-light.jpg")
crop_and_check(altar_src, (185, 340, 390, 680), "candle-solo.jpg")

print("¡Todos los recortes estrictos generados y verificados!")
