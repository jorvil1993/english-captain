from PIL import Image, ImageDraw
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")

# Crear strength-arm.jpg (Brazo fuerte haciendo fuerza con bíceps y aura dorada)
arm_img = Image.new("RGB", (512, 512), "#fffbeb")
draw = ImageDraw.Draw(arm_img)

# Fondo degradado cálido
for y in range(512):
    draw.line([(0, y), (512, y)], fill=(int(255 - 15*y/512), int(248 - 25*y/512), int(220 - 45*y/512)))

# Aura dorada de fuerza y bendición
draw.ellipse([(60, 60), (452, 452)], fill="#fef08a", outline="#f59e0b", width=10)

# Destellos de fuerza (rayos de energía / estrellas)
destellos = [(120, 120), (390, 130), (100, 360), (400, 370)]
for dx, dy in destellos:
    draw.line([(dx-16, dy), (dx+16, dy)], fill="#eab308", width=5)
    draw.line([(dx, dy-16), (dx, dy+16)], fill="#eab308", width=5)

# Dibujar el Brazo Fuerte (Estilo ilustración infantil cálida)
# 1. Bíceps y brazo flexionado (Tono piel cálido)
skin_color = "#fed7aa"
outline_color = "#ea580c"

# Antebrazo vertical
draw.rounded_rectangle([(270, 160), (370, 350)], radius=30, fill=skin_color, outline=outline_color, width=8)

# Bíceps flexionado a la izquierda
draw.ellipse([(170, 220), (320, 360)], fill=skin_color, outline=outline_color, width=8)

# Curva de músculo bíceps pronunciado
draw.ellipse([(200, 190), (310, 290)], fill="#fdba74", outline=outline_color, width=7)

# Puño cerrado arriba
draw.ellipse([(260, 120), (380, 220)], fill=skin_color, outline=outline_color, width=8)
# Dedos del puño cerrado
draw.line([(280, 160), (360, 160)], fill=outline_color, width=5)
draw.line([(290, 185), (355, 185)], fill=outline_color, width=5)

# Muñequera / brazalete dorado de fuerza
draw.rounded_rectangle([(260, 210), (380, 250)], radius=8, fill="#f59e0b", outline="#b45309", width=5)
draw.ellipse([(310, 220), (330, 240)], fill="#fef08a") # Gema brillante en brazalete

# Línea de fuerza y definición en el bíceps
draw.arc([(220, 230), (280, 280)], 30, 150, fill="#c2410c", width=5)

arm_img.save(IMG_DIR / "strength-arm.jpg", "JPEG", quality=95)
arm_img.save(IMG_DIR / "u5-brave.jpg", "JPEG", quality=95)
print("strength-arm.jpg y u5-brave.jpg: Brazo de fuerza generado exitosamente!")
