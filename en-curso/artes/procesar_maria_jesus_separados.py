from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

mary_src = BRAIN / "u4_mary_1788150196687.jpg"

if mary_src.exists():
    img = Image.open(mary_src)
    w, h = img.size
    
    # 1. Mother Mary: Primer plano del rostro tierno de la Virgen con velo azul y halo dorado
    mary_box = (int(0.33 * w), int(0.14 * h), int(0.66 * w), int(0.48 * h))
    mary_crop = img.crop(mary_box).resize((512, 512), Image.Resampling.LANCZOS)
    mary_crop.save(IMG_DIR / "u4-mary.jpg", "JPEG", quality=95)
    print("u4-mary.jpg: Rostro de la Virgen María generado exitosamente!")

    # 2. Baby Jesus: Primer plano exclusivo del Niño Jesús envuelto en pañales con halo dorado
    jesus_box = (int(0.48 * w), int(0.45 * h), int(0.69 * w), int(0.67 * h))
    jesus_crop = img.crop(jesus_box).resize((512, 512), Image.Resampling.LANCZOS)
    jesus_crop.save(IMG_DIR / "u4-jesus.jpg", "JPEG", quality=95)
    print("u4-jesus.jpg: Niño Jesús solo generado exitosamente!")
