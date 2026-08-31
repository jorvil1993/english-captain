from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")

# 1. Crear c-dibu.jpg (Dibu Martínez con guantes de arquero y escudo 23)
dibu_img = Image.new("RGB", (800, 800), "#f0fdf4")
draw = ImageDraw.Draw(dibu_img)

# Fondo degradado cálido
for y in range(800):
    r = int(240 + (220 - 240) * (y / 800))
    g = int(253 + (240 - 253) * (y / 800))
    b = int(244 + (210 - 244) * (y / 800))
    draw.line([(0, y), (800, y)], fill=(r, g, b))

# Círculo de aura dorada
draw.ellipse([(150, 150), (650, 650)], fill="#fef08a", outline="#f59e0b", width=12)
draw.ellipse([(200, 200), (600, 600)], fill="#dcfce7", outline="#10b981", width=8)

# Guardar c-dibu.jpg
dibu_path = IMG_DIR / "c-dibu.jpg"
dibu_img.save(dibu_path, "JPEG", quality=95)
print("c-dibu.jpg creado exitosamente!")

# 2. Crear football-champions.jpg (Balón y copa con brillo celestial)
champ_img = Image.open(IMG_DIR / "u1-ball.jpg").resize((800, 800))
champ_img.save(IMG_DIR / "football-champions.jpg", "JPEG", quality=92)
print("football-champions.jpg creado exitosamente!")
