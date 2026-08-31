import os
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

AQUI = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

def crop_and_save(src_path, box, dest_name):
    img = Image.open(src_path)
    w, h = img.size
    # box is (left_ratio, top_ratio, right_ratio, bottom_ratio)
    left = int(box[0] * w)
    top = int(box[1] * h)
    right = int(box[2] * w)
    bottom = int(box[3] * h)
    cropped = img.crop((left, top, right, bottom))
    cropped = cropped.resize((512, 512), Image.Resampling.LANCZOS)
    dest_path = AQUI / dest_name
    cropped.save(dest_path, "JPEG", quality=92)
    print(f"Generada imagen perfecta: {dest_name}")

# 1. u3-water.jpg (Las aguas azules cristalinas del Arca)
noah_img = BRAIN / "noah_ark_1788150454215.jpg"
if noah_img.exists():
    crop_and_save(noah_img, (0.05, 0.70, 0.95, 0.98), "u3-water.jpg")

# 2. u3-trees.jpg & u3-tree.jpg (Los árboles verdes del paisaje bíblico)
mary_img = BRAIN / "u4_mary_1788150196687.jpg"
if mary_img.exists():
    crop_and_save(mary_img, (0.05, 0.20, 0.40, 0.55), "u3-tree.jpg")
    crop_and_save(mary_img, (0.05, 0.20, 0.40, 0.55), "u3-trees.jpg")

# 3. u3-flowers.jpg (Las flores del jardín de la Virgen y la ovejita)
sheep_img = BRAIN / "sheep_portrait_1788152357145.jpg"
if sheep_img.exists():
    crop_and_save(sheep_img, (0.05, 0.55, 0.95, 0.95), "u3-flowers.jpg")

# 4. u3-birds.jpg (Palomita en cielo soleado)
dove_img = BRAIN / "dove_portrait_1788152522347.jpg"
if dove_img.exists():
    crop_and_save(dove_img, (0.10, 0.10, 0.90, 0.90), "u3-birds.jpg")

# 5. u4-home.jpg (La casita acogedora con chimenea del Ángel de la Guarda)
angel_img = BRAIN / "guardian_angel_1788150642234.jpg"
if angel_img.exists():
    crop_and_save(angel_img, (0.72, 0.50, 0.95, 0.73), "u4-home.jpg")

# 6. u4-family.jpg (La Sagrada Familia: María y el Niño Jesús)
if mary_img.exists():
    crop_and_save(mary_img, (0.15, 0.15, 0.85, 0.85), "u4-family.jpg")

# 7. u3-all-good.jpg (Frutos y bendiciones de la tierra)
joseph_img = BRAIN / "u4_joseph_1788150236795.jpg"
if joseph_img.exists():
    crop_and_save(joseph_img, (0.05, 0.55, 0.35, 0.85), "u3-all-good.jpg")

# 8. u2-i-love-you.jpg (El amor y corazón de Jesús)
if mary_img.exists():
    crop_and_save(mary_img, (0.35, 0.40, 0.75, 0.80), "u2-i-love-you.jpg")

# 9. u5-brave.jpg (El niño valiente protegido por Dios)
boy_angel = BRAIN / "boy_angel_1788151569145.jpg"
if boy_angel.exists():
    crop_and_save(boy_angel, (0.25, 0.15, 0.75, 0.65), "u5-brave.jpg")

# 10. u3-thank-god.jpg (Oración y agradecimiento a Dios)
if boy_angel.exists():
    crop_and_save(boy_angel, (0.30, 0.30, 0.70, 0.70), "u3-thank-god.jpg")

print("¡Procesamiento completo de todo el set de imágenes de la app!")
