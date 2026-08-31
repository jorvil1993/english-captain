from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

altar_src = BRAIN / "altar_cross_1788150368433.jpg"

if altar_src.exists():
    img = Image.open(altar_src)
    w, h = img.size
    
    # Recorte perfecto centrado de la vela izquierda con su candelabro y llama dorada
    left = int(0.19 * w)
    top = int(0.34 * h)
    right = int(0.41 * w)
    bottom = int(0.66 * h)
    
    candle = img.crop((left, top, right, bottom))
    candle = candle.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Guardar como u5-light.jpg y candle-solo.jpg
    candle.save(IMG_DIR / "u5-light.jpg", "JPEG", quality=95)
    candle.save(IMG_DIR / "candle-solo.jpg", "JPEG", quality=95)
    print("u5-light.jpg procesada como VELA SOLA en primer plano!")
