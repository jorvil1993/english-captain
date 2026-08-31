import shutil
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")

# Copiar heart-love.jpg a u2-i-love-you.jpg para que cualquier referencia a Heart muestre el Corazón Rojo y Brillante
heart_src = IMG_DIR / "heart-love.jpg"
if heart_src.exists():
    shutil.copyfile(heart_src, IMG_DIR / "u2-i-love-you.jpg")
    print("u2-i-love-you.jpg actualizado con el CORAZÓN ROJO Y DORADO!")
