# -*- coding: utf-8 -*-
"""Baja las fotos REALES de los jugadores para los cromos de la app.

Por que fotos reales y no generadas: Jorge lo pidio asi —"que sean jugadores
reales con sus propias imagenes reales del jugador, eso lo enganchara a el"— y
tiene razon: el gancho de Jose son Messi, Mbappe y Luka Modric de verdad, no
un dibujo parecido. Y ademas es lo correcto: la cara de una persona real no se
inventa con una IA. Se usa su fotografia, o no se usa nada.

De donde salen: Wikimedia Commons, filtrando por licencia libre (CC BY, CC
BY-SA, CC0 o dominio publico). El credito y la licencia de cada foto quedan
escritos en `creditos.json` y se muestran en el panel de papas.

Uso:
    python bajar_cromos.py
"""
from __future__ import annotations

import io
import json
from pathlib import Path
from urllib.parse import unquote

import requests
from PIL import Image

AQUI = Path(__file__).resolve().parent
DESTINO = AQUI.parent / "app" / "public" / "img"
CREDITOS = AQUI.parent / "app" / "public" / "img" / "creditos.json"

AGENTE = "AprenderInglesJose/1.0 (proyecto familiar; contacto: gusvillavicencio@gmail.com)"

# clave del cromo -> articulo de Wikipedia del que sacamos la foto principal
JUGADORES = {
    "c-messi": "Lionel Messi",
}

# Cuando la foto principal del articulo no trae licencia legible (le paso a
# Mbappe), se nombra a mano un archivo de Commons ya verificado como libre.
ARCHIVOS_A_MANO = {
    "c-mbappe": "Kylian Mbappe France v Senegal 16 June 2026-391 (cropped 3).jpg",
    "c-modric": "Luka Modric Croatia v Portugal 2 July 2026-055.jpg",
}

LICENCIAS_OK = ("cc0", "cc by", "cc-by", "public domain", "pd-")


def foto_principal(titulo: str) -> str | None:
    """La imagen principal del articulo: casi siempre un retrato limpio."""
    r = requests.get(
        f"https://en.wikipedia.org/api/rest_v1/page/summary/{titulo.replace(' ', '_')}",
        headers={"User-Agent": AGENTE},
        timeout=30,
    )
    r.raise_for_status()
    datos = r.json()
    return (datos.get("originalimage") or {}).get("source")


def ficha_commons(url_archivo: str) -> dict:
    """Licencia y autor del archivo, para poder acreditarlo."""
    # La url viene percent-encoded y con guiones bajos; el titulo de Commons
    # lleva espacios y caracteres de verdad. Sin esto, los archivos con
    # parentesis o acentos (el caso de Mbappe) devolvian ficha vacia y se
    # descartaban como "licencia desconocida".
    nombre = unquote(url_archivo.rsplit("/", 1)[-1].split("?")[0]).replace("_", " ")
    r = requests.get(
        "https://commons.wikimedia.org/w/api.php",
        params={
            "action": "query",
            "titles": f"File:{nombre}",
            "prop": "imageinfo",
            "iiprop": "extmetadata|url",
            "format": "json",
        },
        headers={"User-Agent": AGENTE},
        timeout=30,
    )
    r.raise_for_status()
    paginas = r.json().get("query", {}).get("pages", {})
    for pagina in paginas.values():
        info = (pagina.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata", {})
        return {
            "archivo": nombre,
            "licencia": meta.get("LicenseShortName", {}).get("value", "?"),
            "autor": _sin_html(meta.get("Artist", {}).get("value", "?")),
            "pagina": info.get("descriptionurl", ""),
        }
    return {"archivo": nombre, "licencia": "?", "autor": "?", "pagina": ""}


def _sin_html(texto: str) -> str:
    fuera, dentro = [], False
    for c in texto:
        if c == "<":
            dentro = True
        elif c == ">":
            dentro = False
        elif not dentro:
            fuera.append(c)
    return " ".join("".join(fuera).split())


def cuadrar(datos: bytes, lado: int = 800) -> bytes:
    """Recorte cuadrado centrado arriba: en un retrato ahi esta la cara, que es
    lo unico que Jose necesita reconocer."""
    img = Image.open(io.BytesIO(datos)).convert("RGB")
    a, h = img.size
    corte = min(a, h)
    x = (a - corte) // 2
    y = 0 if h > a else (h - corte) // 2
    img = img.crop((x, y, x + corte, y + corte)).resize((lado, lado), Image.LANCZOS)
    salida = io.BytesIO()
    img.save(salida, "JPEG", quality=88)
    return salida.getvalue()


def url_de_archivo(nombre: str) -> str | None:
    r = requests.get(
        "https://commons.wikimedia.org/w/api.php",
        params={"action": "query", "titles": f"File:{nombre}", "prop": "imageinfo",
                "iiprop": "url", "format": "json"},
        headers={"User-Agent": AGENTE},
        timeout=30,
    )
    r.raise_for_status()
    for pagina in r.json().get("query", {}).get("pages", {}).values():
        return (pagina.get("imageinfo") or [{}])[0].get("url")
    return None


def main() -> int:
    DESTINO.mkdir(parents=True, exist_ok=True)
    creditos = {}

    objetivos = [(c, t, False) for c, t in JUGADORES.items()]
    objetivos += [(c, a, True) for c, a in ARCHIVOS_A_MANO.items()]

    for clave, titulo, a_mano in objetivos:
        print(f"{clave}: {titulo}")
        url = url_de_archivo(titulo) if a_mano else foto_principal(titulo)
        if not url:
            print("   no se encontro la foto")
            continue

        ficha = ficha_commons(url)
        licencia = ficha["licencia"].lower()
        if not any(ok in licencia for ok in LICENCIAS_OK):
            print(f"   licencia no libre ({ficha['licencia']}) — se descarta")
            continue

        datos = requests.get(url, headers={"User-Agent": AGENTE}, timeout=60).content
        (DESTINO / f"{clave}.jpg").write_bytes(cuadrar(datos))
        creditos[clave] = ficha
        print(f"   ok · {ficha['licencia']} · {ficha['autor'][:60]}")

    if creditos:
        anterior = {}
        if CREDITOS.exists():
            anterior = json.loads(CREDITOS.read_text(encoding="utf-8"))
        anterior.update(creditos)
        CREDITOS.write_text(json.dumps(anterior, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nCreditos en {CREDITOS.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
