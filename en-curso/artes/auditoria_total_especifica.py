from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

bible_src = BRAIN / "holy_bible_1788150718552.jpg"
altar_src = BRAIN / "altar_cross_1788150368433.jpg"
boy_src = BRAIN / "boy_angel_1788151569145.jpg"
mary_src = BRAIN / "u4_mary_1788150196687.jpg"

def crop_and_save(src, box, dest_name):
    if src.exists():
        img = Image.open(src)
        w, h = img.size
        left = int(box[0] * w)
        top = int(box[1] * h)
        right = int(box[2] * w)
        bottom = int(box[3] * h)
        crop = img.crop((left, top, right, bottom)).resize((512, 512), Image.Resampling.LANCZOS)
        crop.save(IMG_DIR / dest_name, "JPEG", quality=95)
        print(f"Generado {dest_name} exitosamente!")

# 1. Bible Solo (SOLO la Santa Biblia abierta sobre el atril con cruz dorada)
crop_and_save(bible_src, (0.16, 0.24, 0.54, 0.62), "u6-bible.jpg")
crop_and_save(bible_src, (0.16, 0.24, 0.54, 0.62), "bible-solo.jpg")

# 2. Cross Solo (SOLO la Cruz Dorada celestial del altar con sus rayos)
crop_and_save(altar_src, (0.34, 0.20, 0.66, 0.58), "u6-cross.jpg")
crop_and_save(altar_src, (0.34, 0.20, 0.66, 0.58), "cross-solo.jpg")

# 3. Little Boy (SOLO el Niñito Capitán con carita dulce)
crop_and_save(boy_src, (0.28, 0.12, 0.72, 0.56), "little-boy.jpg")
crop_and_save(boy_src, (0.28, 0.12, 0.72, 0.56), "u5-brave.jpg")
crop_and_save(boy_src, (0.28, 0.12, 0.72, 0.56), "u1-c1.jpg")

# 4. Church Solo (SOLO la Iglesia con su campanario y portal de piedra)
crop_and_save(bible_src, (0.46, 0.12, 0.94, 0.68), "u6-church.jpg")

# 5. Bell Solo (SOLO la Campana de bronce en el campanario)
crop_and_save(bible_src, (0.71, 0.13, 0.89, 0.33), "u6-bell.jpg")

# 6. Baby Jesus (SOLO el Bebé Jesús en pañales con halo dorado)
crop_and_save(mary_src, (0.48, 0.45, 0.69, 0.67), "u4-jesus.jpg")

# 7. Mother Mary (SOLO el Rostro de la Virgen María con velo azul)
crop_and_save(mary_src, (0.33, 0.14, 0.66, 0.48), "u4-mary.jpg")

print("Auditoría y recorte total específico completado!")
