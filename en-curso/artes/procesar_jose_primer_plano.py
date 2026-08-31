from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

joseph_src = BRAIN / "u4_joseph_1788150236795.jpg"

if joseph_src.exists():
    img = Image.open(joseph_src)
    w, h = img.size
    
    # Primer plano centrado del rostro y busto de San José con halo y báculo
    joseph_box = (int(0.28 * w), int(0.12 * h), int(0.72 * w), int(0.56 * h))
    joseph_crop = img.crop(joseph_box).resize((512, 512), Image.Resampling.LANCZOS)
    joseph_crop.save(IMG_DIR / "u4-joseph.jpg", "JPEG", quality=95)
    print("u4-joseph.jpg: San José en primer plano generado exitosamente!")
