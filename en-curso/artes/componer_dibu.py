from PIL import Image, ImageDraw
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

boy_img = Image.open(BRAIN / "boy_angel_1788151569145.jpg")
w, h = boy_img.size
face = boy_img.crop((int(0.28*w), int(0.12*h), int(0.72*w), int(0.56*h)))
face = face.resize((460, 460), Image.Resampling.LANCZOS)

dibu_card = Image.new("RGB", (800, 800), "#f0fdf4")
# Fondo degradado
draw = ImageDraw.Draw(dibu_card)
for y in range(800):
    draw.line([(0, y), (800, y)], fill=(int(240 - 20*y/800), int(253 - 15*y/800), int(244 - 30*y/800)))

# Pegar carita en el centro
dibu_card.paste(face, (170, 160))

# Borde dorado circular
draw.ellipse([(150, 140), (650, 640)], outline="#f59e0b", width=14)

dibu_card.save(IMG_DIR / "c-dibu.jpg", "JPEG", quality=95)
print("c-dibu.jpg generado con rostro ilustrado y aura!")
