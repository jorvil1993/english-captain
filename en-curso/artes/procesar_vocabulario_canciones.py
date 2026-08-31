from PIL import Image, ImageDraw
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

# 1. Star Solo (La Estrella dorada de Belén en primer plano exclusivo)
nativity_src = BRAIN / "nativity_star_1788150286306.jpg"
if nativity_src.exists():
    img = Image.open(nativity_src)
    w, h = img.size
    star_box = (int(0.32 * w), int(0.08 * h), int(0.68 * h), int(0.44 * h))
    star_crop = img.crop(star_box).resize((512, 512), Image.Resampling.LANCZOS)
    star_crop.save(IMG_DIR / "star-solo.jpg", "JPEG", quality=95)
    print("star-solo.jpg: Estrella en primer plano generada!")

# 2. Shine (Rayos y destellos dorados de luz celestial)
sun_src = BRAIN / "sun_illustration_1788153340438.jpg"
if sun_src.exists():
    img = Image.open(sun_src)
    w, h = img.size
    shine_box = (int(0.15 * w), int(0.15 * h), int(0.85 * w), int(0.85 * h))
    shine_crop = img.crop(shine_box).resize((512, 512), Image.Resampling.LANCZOS)
    shine_crop.save(IMG_DIR / "shine-rays.jpg", "JPEG", quality=95)
    print("shine-rays.jpg: Destellos y brillo de luz generados!")

# 3. Heart (Corazón de Amor de Jesús con resplandor dorado)
heart_img = Image.new("RGB", (512, 512), "#fffbeb")
draw = ImageDraw.Draw(heart_img)
# Fondo con gradiente cálido
for y in range(512):
    draw.line([(0, y), (512, y)], fill=(int(255 - 15*y/512), int(251 - 30*y/512), int(235 - 50*y/512)))

# Resplandor dorado circular
draw.ellipse([(90, 90), (422, 422)], fill="#fef08a", outline="#f59e0b", width=10)

# Dibujar Corazón rojo brillante en el centro
# Puntos del corazón:
draw.ellipse([(140, 160), (280, 300)], fill="#ef4444")
draw.ellipse([(232, 160), (372, 300)], fill="#ef4444")
draw.polygon([(145, 240), (367, 240), (256, 380)], fill="#ef4444")
# Brillo en el corazón
draw.ellipse([(175, 185), (215, 225)], fill="#fca5a5")

heart_img.save(IMG_DIR / "heart-love.jpg", "JPEG", quality=95)
print("heart-love.jpg: Sagrado Corazón y Amor generado exitosamente!")
