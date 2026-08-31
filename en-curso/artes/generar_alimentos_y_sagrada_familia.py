from PIL import Image, ImageDraw
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

mary_src = BRAIN / "u4_mary_1788150196687.jpg"
joseph_src = BRAIN / "u4_joseph_1788150236795.jpg"

# 1. GENERAR FOOD (Alimentos claros: Manzanas rojas, pan horneado y uvas sobre mantel)
food_img = Image.new("RGB", (512, 512), "#fffbeb")
draw = ImageDraw.Draw(food_img)

# Fondo degradado cálido
for y in range(512):
    draw.line([(0, y), (512, y)], fill=(int(255 - 15*y/512), int(251 - 25*y/512), int(235 - 45*y/512)))

# Mantel de mesa rústico
draw.rectangle([(0, 320), (512, 512)], fill="#fed7aa")
draw.line([(0, 320), (512, 320)], fill="#ea580c", width=6)

# Cesta de mimbre tejida
draw.ellipse([(100, 240), (412, 400)], fill="#d97706", outline="#b45309", width=6)
# Líneas de tejido de cesta
for x in range(120, 400, 24):
    draw.line([(x, 260), (x, 380)], fill="#92400e", width=3)

# 1.1 Pan horneado dorado (Loaf of Bread)
draw.ellipse([(140, 180), (280, 270)], fill="#fde047", outline="#ca8a04", width=5)
draw.arc([(170, 200), (250, 250)], 20, 160, fill="#a16207", width=3)

# 1.2 Manzana roja brillante 1
draw.ellipse([(260, 200), (350, 290)], fill="#ef4444", outline="#b91c1c", width=4)
draw.ellipse([(280, 215), (310, 245)], fill="#fca5a5") # Brillo
draw.line([(305, 200), (315, 180)], fill="#78350f", width=4) # Ramita
draw.polygon([(315, 180), (335, 175), (325, 190)], fill="#22c55e") # Hoja verde

# 1.3 Manzana roja 2
draw.ellipse([(190, 240), (270, 320)], fill="#dc2626", outline="#991b1b", width=4)
draw.ellipse([(205, 255), (230, 280)], fill="#fca5a5") # Brillo

# 1.4 Racimo de uvas moradas dulces (Grapes)
uvas = [
    (330, 260), (360, 260), (390, 270),
    (345, 285), (375, 285),
    (360, 310)
]
for ux, uy in uvas:
    draw.ellipse([(ux-15, uy-15), (ux+15, uy+15)], fill="#9333ea", outline="#6b21a8", width=3)
    draw.ellipse([(ux-6, uy-6), (ux, uy)], fill="#d8b4fe") # Brillo

# Resplandor dorado de bendición de Dios
draw.ellipse([(60, 60), (452, 452)], outline="#f59e0b", width=6)

food_img.save(IMG_DIR / "u3-all-good.jpg", "JPEG", quality=95)
food_img.save(IMG_DIR / "food-basket.jpg", "JPEG", quality=95)
print("u3-all-good.jpg: Cesta de alimentos (Pan, manzanas, uvas) generada con éxito!")


# 2. GENERAR SAGRADA FAMILIA COMPLETA (San José + Virgen María + Niño Jesús)
if mary_src.exists() and joseph_src.exists():
    img_m = Image.open(mary_src)
    img_j = Image.open(joseph_src)
    
    # Crear lienzo de la Sagrada Familia
    family = Image.new("RGB", (512, 512), "#fffbeb")
    
    # San José a la izquierda (rostro y busto con halo)
    j_crop = img_j.crop((280, 100, 720, 560)).resize((290, 300), Image.Resampling.LANCZOS)
    
    # Virgen María y Niño Jesús a la derecha y centro
    m_crop = img_m.crop((320, 120, 720, 680)).resize((340, 420), Image.Resampling.LANCZOS)
    
    # Fondo con cielo suave y aura dorada
    draw_f = ImageDraw.Draw(family)
    for y in range(512):
        draw_f.line([(0, y), (512, y)], fill=(int(255 - 15*y/512), int(248 - 20*y/512), int(220 - 40*y/512)))
    draw_f.ellipse([(40, 40), (472, 472)], fill="#fef08a", outline="#f59e0b", width=8)
    
    # Pegar a San José detrás a la izquierda
    family.paste(j_crop, (20, 80))
    # Pegar a María con el Niño Jesús al frente y derecha
    family.paste(m_crop, (160, 92))
    
    # Marco dorado exterior
    draw_final = ImageDraw.Draw(family)
    draw_final.rectangle([(0, 0), (511, 511)], outline="#f59e0b", width=8)
    
    family.save(IMG_DIR / "u4-family.jpg", "JPEG", quality=95)
    print("u4-family.jpg: Sagrada Familia COMPLETA (San José, María y Jesús) generada con éxito!")
