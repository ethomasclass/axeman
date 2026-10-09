"""Hand-traced masks for pictures rembg can't cut out (halftone newspaper clippings, line drawings).

Each entry is a polygon (or circle) in source pixels around the subject. The edge is softened so the teal trace reads
as a loose hand-drawn loop. Writes the same files as tools/mask.py:
public/img/masks/<name>_subject(_a).png and <name>.json.

  python3 tools/polymask.py            # all
  python3 tools/polymask.py besumer
"""
import os, sys
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from trace import save  # noqa: E402

PUB = os.path.join(HERE, "..", "public")
POLYS = {
    # the woman pounding the piano on the sheet-music cover
    "sheet_piano": ("img/ch01/mysterious_axman_jazz_cover_1919_display.jpg", [[(283, 262), (305, 252), (322, 262), (326, 300), (345, 318), (372, 340), (388, 380), (388, 425),
        (375, 452), (330, 462), (280, 466), (262, 480), (258, 520), (248, 552), (212, 553), (208, 520), (222, 470), (205, 430), (200, 405), (186, 395), (186, 372), (212, 362),
        (240, 350), (262, 330), (278, 312), (278, 285)]]),
    # Louis Besumer, head and shoulders
    "besumer": ("img/ch03/besumer_clipping_1918.jpg", [[(150, 8), (198, 16), (232, 42), (246, 80), (244, 125), (228, 165), (220, 215), (250, 260), (300, 300), (300, 349),
        (20, 349), (30, 300), (80, 265), (85, 215), (75, 175), (62, 140), (62, 110), (75, 90), (80, 50), (110, 20)]]),
    # the man sitting up with his shotgun in the Times-Picayune cartoon
    "cartoon_guard": ("img/ch07/axeman_cartoon_1919.jpg", [[(140, 135), (165, 132), (180, 150), (178, 175), (175, 190), (252, 196), (262, 205), (205, 300), (190, 320), (190, 360),
        (175, 420), (160, 450), (120, 450), (100, 420), (80, 380), (73, 330), (80, 290), (100, 265), (125, 240), (130, 200), (135, 170)]]),
    # the cornet player at the centre of the Eagle Band, 1916 (the last shot: "It played.")
    "eagle_cornet": ("img/ch01/eagle_band_nola_1916.jpg", [[(340, 95), (368, 98), (380, 128), (392, 135), (388, 150), (395, 185), (418, 200), (425, 240), (440, 290),
        (458, 320), (452, 350), (430, 360), (425, 420), (432, 470), (420, 495), (395, 495), (390, 440), (360, 360), (330, 350), (320, 380), (318, 440), (310, 492),
        (285, 492), (285, 440), (290, 370), (300, 320), (305, 260), (298, 215), (310, 190), (300, 160), (302, 132), (318, 128), (325, 100)]]),
    # Mr. and Mrs. Maggio in their portrait medallion: (cx, cy, r)
    "maggios": ("img/ch02/maggio_clipping_1918.jpg", ("circle", 122, 258, 110)),
}


def run(name):
    src, shape = POLYS[name]
    im = Image.open(os.path.join(PUB, src))
    w, h = im.size
    m = np.zeros((h, w), np.uint8)
    if shape[0] == "circle":
        cv2.circle(m, (shape[1], shape[2]), shape[3], 255, -1)
    else:
        for poly in shape:
            cv2.fillPoly(m, [np.array(poly, np.int32)], 255)
    k = max(3, int(min(w, h) / 120) | 1)
    m = (cv2.GaussianBlur(m, (0, 0), k) > 127).astype(np.uint8) * 255
    save(name, (w, h), {"subject": m})
    print("mask", name, w, h)


if __name__ == "__main__":
    for n in sys.argv[1:] or list(POLYS):
        run(n)
