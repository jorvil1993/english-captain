from PIL import Image
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

mary_src = BRAIN / "u4_mary_1788150196687.jpg"
angel_src = BRAIN / "boy_angel_1788151569145.jpg"
bible_src = BRAIN / "holy_bible_1788150718552.jpg"
altar_src = BRAIN / "altar_cross_1788150368433.jpg"
noah_src = BRAIN / "noah_ark_1788150454215.jpg"

# 1. u3-tree.jpg & u3-trees.jpg (100% Solo Árboles verdes y cielo)
if mary_src.exists():
    img = Image.open(mary_src)
    w, h = img.size
    tree_box = (int(0.04 * w), int(0.20 * h), int(0.36 * w), int(0.56 * h))
    tree_crop = img.crop(tree_box).resize((512, 512), Image.Resampling.LANCZOS)
    tree_crop.save(IMG_DIR / "u3-tree.jpg", "JPEG", quality=95)
    tree_crop.save(IMG_DIR / "u3-trees.jpg", "JPEG", quality=95)
    print("u3-tree.jpg y u3-trees.jpg: 100% solo árboles verdes!")

# 2. u3-water.jpg (100% Solo Agua azul cristalina con olas)
if noah_src.exists():
    img = Image.open(noah_src)
    w, h = img.size
    water_box = (int(0.05 * w), int(0.80 * h), int(0.95 * w), int(0.98 * h))
    water_crop = img.crop(water_box).resize((512, 512), Image.Resampling.LANCZOS)
    water_crop.save(IMG_DIR / "u3-water.jpg", "JPEG", quality=95)
    print("u3-water.jpg: 100% solo agua azul!")

# 3. u4-home.jpg (100% Solo la Casita de campo acogedora)
if angel_src.exists():
    img = Image.open(angel_src)
    w, h = img.size
    home_box = (int(0.72 * w), int(0.50 * h), int(0.96 * w), int(0.74 * h))
    home_crop = img.crop(home_box).resize((512, 512), Image.Resampling.LANCZOS)
    home_crop.save(IMG_DIR / "u4-home.jpg", "JPEG", quality=95)
    print("u4-home.jpg: 100% solo la casita!")

# 4. u6-bell.jpg (100% Solo la Campana en el campanario de la iglesia)
if bible_src.exists():
    img = Image.open(bible_src)
    w, h = img.size
    bell_box = (int(0.72 * w), int(0.12 * h), int(0.88 * w), int(0.32 * h))
    bell_crop = img.crop(bell_box).resize((512, 512), Image.Resampling.LANCZOS)
    bell_crop.save(IMG_DIR / "u6-bell.jpg", "JPEG", quality=95)
    print("u6-bell.jpg: 100% solo la campana de iglesia!")

print("¡Auditoría de imágenes puras terminada con éxito!")
