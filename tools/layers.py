"""2.5D layers for archival pictures that have a subject mask (the Ouija parallax, for photographs).

For each name in LAYERS (a mask made by tools/mask.py), writes
  public/img/layers/<name>_fg.png   the subject alone, soft-edged, on transparency
  public/img/layers/<name>_bg.jpg   the picture with the subject painted out, so the subject can slide over it
The background fill only has to hold up near the subject's edge: the subject layer covers the rest.

  python3 tools/layers.py            # every name in LAYERS
  python3 tools/layers.py band
"""
import json, os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, "..", "public")
OUT = os.path.join(PUB, "img", "layers")
sys.path.insert(0, HERE)
from mask import JOBS  # noqa: E402  (name -> (source, box, model))


def run(name):
    src = JOBS[name][0]
    im = np.asarray(Image.open(os.path.join(PUB, src)).convert("RGB"))
    m = np.asarray(Image.open(os.path.join(PUB, "img", "masks", name + "_subject_a.png")).convert("L"))
    if m.shape != im.shape[:2]:
        m = cv2.resize(m, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_LINEAR)
    h, w = m.shape
    k = max(3, int(round(min(h, w) / 400)) * 2 + 1)
    fg_a = cv2.GaussianBlur(cv2.dilate(m, np.ones((k, k), np.uint8)), (0, 0), max(1.0, k / 3))
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(np.dstack([im, fg_a])).save(os.path.join(OUT, name + "_fg.png"), optimize=True)
    g = max(9, int(min(h, w) / 30) | 1)
    hole = cv2.dilate(m, np.ones((g, g), np.uint8))
    s = 2 if min(h, w) > 900 else 1
    small = cv2.resize(im, (w // s, h // s), interpolation=cv2.INTER_AREA)
    hs = cv2.resize(hole, (w // s, h // s), interpolation=cv2.INTER_NEAREST)
    fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), hs, 15, cv2.INPAINT_TELEA)
    fill = cv2.cvtColor(cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB).astype(np.float32)
    fill = cv2.GaussianBlur(fill, (0, 0), 3) + np.random.default_rng(1).normal(0, 5, (h, w, 1))
    a = (cv2.GaussianBlur(hole, (0, 0), 4).astype(np.float32) / 255)[..., None]
    bg = im * (1 - a) + fill * a
    Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name + "_bg.jpg"), quality=90)
    print("layers", name, w, h)


LAYERS = [n for n in JOBS if n != "sully"]

if __name__ == "__main__":
    for n in sys.argv[1:] or LAYERS:
        run(n)
