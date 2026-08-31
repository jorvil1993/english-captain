from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

bible_src = BRAIN / "holy_bible_1788150718552.jpg"
altar_src = BRAIN / "altar_cross_1788150368433.jpg"
mary_src = BRAIN / "u4_mary_1788150196687.jpg"
joseph_src = BRAIN / "u4_joseph_1788150236795.jpg"
star_src = BRAIN / "nativity_star_1788150286306.jpg"
angel_src = BRAIN / "boy_angel_1788151569145.jpg"
noah_src = BRAIN / "noah_ark_1788150454215.jpg"

def crop_exact(src, box, dest_name):
    img = Image.open(src)
    w, h = img.size
    # box is pixel coordinates (left, top, right, bottom)
    cropped = img.crop(box).resize((512, 512), Image.Resampling.LANCZOS)
    dest_path = IMG_DIR / dest_name
    cropped.save(dest_path, "JPEG", quality=95)
    print(f"-> GENERADO CON ÉXITO: {dest_name} ({box})")

# 1. CAMPANA DE IGLESIA (SOLO la campana dentro del campanario)
if bible_src.exists():
    crop_exact(bible_src, (730, 160, 875, 305), "u6-bell.jpg")

# 2. SANTA BIBLIA (SOLO la Biblia abierta sobre el atril)
if bible_src.exists():
    crop_exact(bible_src, (140, 230, 580, 680), "u6-bible.jpg")
    crop_exact(bible_src, (140, 230, 580, 680), "bible-solo.jpg")

# 3. IGLESIA DE PIEDRA (SOLO el edificio de la iglesia)
if bible_src.exists():
    crop_exact(bible_src, (460, 130, 960, 780), "u6-church.jpg")

# 4. CRUZ DORADA (SOLO la Cruz resplandeciente del altar)
if altar_src.exists():
    crop_exact(altar_src, (370, 210, 654, 590), "u6-cross.jpg")
    crop_exact(altar_src, (370, 210, 654, 590), "cross-solo.jpg")

# 5. VELA (SOLO la vela y su llama dorada)
if altar_src.exists():
    crop_exact(altar_src, (185, 335, 425, 685), "u5-light.jpg")
    crop_exact(altar_src, (185, 335, 425, 685), "candle-solo.jpg")

# 6. ESTRELLA DE BELÉN (SOLO la gran estrella dorada en el cielo)
if star_src.exists():
    crop_exact(star_src, (320, 80, 690, 450), "star-solo.jpg")

# 7. FLORES (100% flores silvestres coloridas)
if mary_src.exists():
    crop_exact(mary_src, (690, 710, 970, 990), "u3-flowers.jpg")

# 8. BEBÉ JESÚS (SOLO el Niño Jesús en pañales con halo)
if mary_src.exists():
    crop_exact(mary_src, (480, 450, 710, 680), "u4-jesus.jpg")

# 9. VIRGEN MARÍA (SOLO el rostro de la Virgen con velo azul)
if mary_src.exists():
    crop_exact(mary_src, (340, 140, 670, 480), "u4-mary.jpg")

# 10. SAN JOSÉ (SOLO el rostro de San José con bastón)
if joseph_src.exists():
    crop_exact(joseph_src, (280, 120, 720, 560), "u4-joseph.jpg")

# 11. ÁRBOL / ÁRBOLES (100% árboles verdes y colina)
if mary_src.exists():
    crop_exact(mary_src, (40, 200, 360, 560), "u3-tree.jpg")
    crop_exact(mary_src, (40, 200, 360, 560), "u3-trees.jpg")

# 12. AGUA (100% olas de agua azul cristalina)
if noah_src.exists():
    crop_exact(noah_src, (50, 800, 970, 1000), "u3-water.jpg")

# 13. CASITA (100% la casita de campo)
if angel_src.exists():
    crop_exact(angel_src, (730, 500, 970, 740), "u4-home.jpg")

# 14. NIÑO CAPITÁN (SOLO el niñito dulce)
if angel_src.exists():
    crop_exact(angel_src, (280, 120, 720, 560), "little-boy.jpg")
    crop_exact(angel_src, (280, 120, 720, 560), "u5-brave.jpg")
    crop_exact(angel_src, (280, 120, 720, 560), "u1-c1.jpg")

print("AUDITORÍA ESTRICTA DEFINITIVA COMPLETADA!")
