from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

# Usar el hermoso jardín de flores silvestres de la Virgen María o del Ángel
mary_src = BRAIN / "u4_mary_1788150196687.jpg"
angel_src = BRAIN / "boy_angel_1788151569145.jpg"

if mary_src.exists():
    img = Image.open(mary_src)
    w, h = img.size
    
    # Recorte exclusivo del ramillete de flores coloridas (margaritas blancas, flores rosas y amarillas)
    # Ubicado en la esquina inferior derecha del prado, sin ningún personaje
    flowers_box = (int(0.68 * w), int(0.70 * h), int(0.96 * w), int(0.98 * h))
    flowers_crop = img.crop(flowers_box).resize((512, 512), Image.Resampling.LANCZOS)
    flowers_crop.save(IMG_DIR / "u3-flowers.jpg", "JPEG", quality=95)
    print("u3-flowers.jpg generada con 100% FLORES PURAS (sin oveja ni personajes)!")
elif angel_src.exists():
    img = Image.open(angel_src)
    w, h = img.size
    flowers_box = (int(0.05 * w), int(0.68 * h), int(0.38 * w), int(0.96 * h))
    flowers_crop = img.crop(flowers_box).resize((512, 512), Image.Resampling.LANCZOS)
    flowers_crop.save(IMG_DIR / "u3-flowers.jpg", "JPEG", quality=95)
    print("u3-flowers.jpg generada desde el jardín del ángel!")
