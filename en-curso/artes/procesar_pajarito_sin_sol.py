from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

dove_src = BRAIN / "dove_portrait_1788152522347.jpg"

if dove_src.exists():
    img = Image.open(dove_src)
    w, h = img.size
    
    # Recorte centrado exclusivamente en el cuerpito, alitas y pico de la palomita
    # Excluyendo por completo la esquina superior derecha donde estaba el sol
    bird_box = (int(0.10 * w), int(0.26 * h), int(0.76 * w), int(0.92 * h))
    bird_crop = img.crop(bird_box).resize((512, 512), Image.Resampling.LANCZOS)
    
    bird_crop.save(IMG_DIR / "u3-birds.jpg", "JPEG", quality=95)
    bird_crop.save(IMG_DIR / "u6-peace.jpg", "JPEG", quality=95)
    print("u3-birds.jpg y u6-peace.jpg: Pajarito/Paloma generada SIN SOL (100% solo el ave)!")
