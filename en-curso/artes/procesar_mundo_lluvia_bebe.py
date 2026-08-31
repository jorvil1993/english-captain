from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")

# 1. World (Un Mundo / Planeta Tierra azul y verde en estilo libro de cuentos)
world_img = Image.new("RGB", (512, 512), "#f0fdf4")
draw = ImageDraw.Draw(world_img)

# Fondo suave
for y in range(512):
    draw.line([(0, y), (512, y)], fill=(int(240 - 20*y/512), int(253 - 15*y/512), int(244 - 30*y/512)))

# Aura dorada
draw.ellipse([(70, 70), (442, 442)], fill="#fef08a", outline="#f59e0b", width=8)

# Globo terráqueo (Océano azul brillante)
draw.ellipse([(90, 90), (422, 422)], fill="#38bdf8", outline="#0284c7", width=8)

# Continentes verdes
# Continente Norteamérica / Europa
draw.ellipse([(140, 130), (270, 240)], fill="#4ade80")
draw.ellipse([(240, 140), (360, 260)], fill="#22c55e")
# Continente Sudamérica / África
draw.ellipse([(160, 240), (280, 380)], fill="#16a34a")
draw.ellipse([(270, 260), (370, 370)], fill="#15803d")

# Nubes blancas sonrientes sobre el mundo
draw.ellipse([(120, 110), (200, 150)], fill="#ffffff")
draw.ellipse([(310, 210), (390, 250)], fill="#ffffff")
draw.ellipse([(200, 330), (290, 370)], fill="#ffffff")

world_img.save(IMG_DIR / "world-globe.jpg", "JPEG", quality=95)
print("world-globe.jpg creado exitosamente!")

# 2. Rain (Nube esponjosa con gotas de lluvia cayendo)
rain_img = Image.new("RGB", (512, 512), "#f0f9ff")
draw_rain = ImageDraw.Draw(rain_img)

# Fondo degradado
for y in range(512):
    draw_rain.line([(0, y), (512, y)], fill=(int(240 - 25*y/512), int(249 - 20*y/512), int(255 - 15*y/512)))

# Nube esponjosa azul suave
# Círculos que forman la nube
draw_rain.ellipse([(110, 130), (250, 250)], fill="#bae6fd")
draw_rain.ellipse([(190, 90), (330, 230)], fill="#7dd3fc")
draw_rain.ellipse([(270, 130), (410, 250)], fill="#bae6fd")
draw_rain.rectangle([(160, 170), (360, 250)], fill="#7dd3fc")

# Gotas de lluvia azules brillantes cayendo
gotas = [
    (160, 280), (230, 290), (300, 280), (360, 290),
    (190, 350), (260, 360), (330, 350),
    (150, 420), (220, 430), (290, 420), (360, 430),
]
for gx, gy in gotas:
    # Dibujar gota (elipse + punta)
    draw_rain.ellipse([(gx-10, gy), (gx+10, gy+28)], fill="#0284c7")
    draw_rain.polygon([(gx-10, gy+12), (gx+10, gy+12), (gx, gy-10)], fill="#0284c7")
    # Brillo blanco en la gota
    draw_rain.ellipse([(gx-4, gy+6), (gx+2, gy+14)], fill="#e0f2fe")

rain_img.save(IMG_DIR / "rain-drops.jpg", "JPEG", quality=95)
print("rain-drops.jpg creado exitosamente!")
