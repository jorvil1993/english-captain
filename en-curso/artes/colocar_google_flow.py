# -*- coding: utf-8 -*-
"""Ubica UNA imagen de `entrada-google-flow/` en su lugar final, ya sabiendo
a qué clave corresponde (eso se decide mirando el contenido de la imagen,
no por el orden en que se generó — ver `generar_imagenes.py` para la lista
completa de claves y si son sagradas).

Convierte a JPG, no pisa un destino que ya exista, y archiva el original en
`entrada-google-flow/procesadas/`.

Uso:
    python colocar_google_flow.py <archivo_en_entrada_google_flow> <clave> [--sagrada]

Ejemplo:
    python colocar_google_flow.py "descarga (3).png" u2-shepherd --sagrada
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

AQUI = Path(__file__).resolve().parent
APP = AQUI.parent / "app"
DESTINO = APP / "public" / "img"
REVISAR = AQUI / "revisar"
ENTRADA = AQUI / "entrada-google-flow"
PROCESADAS = ENTRADA / "procesadas"


def colocar(nombre_archivo: str, clave: str, sagrada: bool) -> int:
    origen = ENTRADA / nombre_archivo
    if not origen.exists():
        print(f"No existe {origen}")
        return 1

    carpeta = REVISAR if sagrada else DESTINO
    carpeta.mkdir(parents=True, exist_ok=True)
    destino = carpeta / f"{clave}.jpg"

    if destino.exists():
        print(f"YA EXISTE {destino} — no se pisó. Borrala a mano primero si querés reemplazarla.")
        return 1

    img = Image.open(origen).convert("RGB")
    img.save(destino, "JPEG", quality=92)

    PROCESADAS.mkdir(parents=True, exist_ok=True)
    origen.rename(PROCESADAS / origen.name)

    print(f"OK: {nombre_archivo} -> {destino.relative_to(AQUI.parent)}")
    return 0


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        print("Uso: python colocar_google_flow.py <archivo> <clave> [--sagrada]")
        raise SystemExit(1)
    raise SystemExit(colocar(args[0], args[1], "--sagrada" in sys.argv))
