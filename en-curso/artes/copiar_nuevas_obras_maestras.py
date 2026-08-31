import shutil
from pathlib import Path

IMG_DIR = Path(r"c:\Users\devic\OneDrive\CLAUDE CODE\Jose\aprender-ingles\en-curso\app\public\img")
BRAIN = Path(r"C:\Users\devic\.gemini\antigravity-ide\brain\48e5e126-cbda-41ad-9eba-563f43573162")

mapeo = {
    "church_bell_art_1788187149259.jpg": ["u6-bell.jpg"],
    "candle_art_1788187202865.jpg": ["u5-light.jpg", "candle-solo.jpg"],
    "golden_cross_art_1788187532373.jpg": ["u6-cross.jpg", "cross-solo.jpg"],
    "holy_bible_art_1788187595319.jpg": ["u6-bible.jpg", "bible-solo.jpg"],
    "wildflowers_art_1788187774983.jpg": ["u3-flowers.jpg"],
    "baby_jesus_art_1788187844607.jpg": ["u4-jesus.jpg"],
    "food_basket_art_1788188024005.jpg": ["u3-all-good.jpg", "food-basket.jpg"],
    "strength_art_1788188211991.jpg": ["strength-arm.jpg", "u5-brave.jpg"],
    "flying_dove_art_1788188313348.jpg": ["u3-birds.jpg", "u6-peace.jpg"],
    "dibu_goalkeeper_art_1788188406831.jpg": ["c-dibu.jpg"],
    "world_globe_art_1788188634529.jpg": ["world-globe.jpg"],
    "rain_drops_art_1788188873151.jpg": ["rain-drops.jpg"],
}

for src_name, dest_list in mapeo.items():
    src_path = BRAIN / src_name
    if src_path.exists():
        for dest in dest_list:
            shutil.copyfile(src_path, IMG_DIR / dest)
            print(f"Copiada nueva obra maestra: {dest}")
    else:
        print(f"No encontrada: {src_name}")

print("¡Todas las nuevas obras maestras desplegadas en public/img!")
