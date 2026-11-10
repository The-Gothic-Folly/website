"""Generates one soft colour-field background per page (run once; outputs are static files).
Usage: python3 src/aura.py   ->  img/aura/<page>.jpg"""
import numpy as np, pathlib
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {"home": 11, "about": 23, "builds": 37, "folly-mix": 41, "press": 53, "gallery": 67, "support": 79, "contact": 89}
W, H = 1600, 1100
# banded like the original reference (light, dark, bright seam, light again), but only in blues and purples,
# ending in the site's own night colour
STOPS = [(0.00, (176, 132, 236)), (0.16, (138, 78, 206)), (0.30, (112, 52, 186)), (0.46, (72, 50, 172)),
         (0.60, (38, 40, 140)), (0.66, (120, 136, 236)), (0.70, (134, 80, 204)), (0.80, (96, 46, 168)),
         (0.90, (28, 26, 78)), (1.00, (11, 12, 17))]

def ramp(v):
    v = np.clip(v, 0, 1); out = np.zeros(v.shape + (3,))
    for (a, ca), (b, cb) in zip(STOPS, STOPS[1:]):
        m = (v >= a) & (v <= b); t = ((v - a) / (b - a))[m][:, None]
        out[m] = np.array(ca) * (1 - t) + np.array(cb) * t
    return out

def field(seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W] / max(W, H)
    # domain warp for the organic, smeared look
    wx = x + 0.08 * np.sin(6 * y + rng.uniform(0, 6)) + 0.05 * np.sin(11 * x + rng.uniform(0, 6))
    wy = y + 0.08 * np.cos(5 * x + rng.uniform(0, 6)) + 0.05 * np.cos(9 * y + rng.uniform(0, 6))
    f = np.zeros_like(x)
    for _ in range(6):
        cx, cy = rng.uniform(0.05, 0.95), rng.uniform(0.05, 0.65)
        sx, sy = rng.uniform(.08, .26), rng.uniform(.06, .22); a = rng.uniform(0, np.pi)
        dx, dy = wx - cx, wy - cy
        u = dx * np.cos(a) + dy * np.sin(a); v = -dx * np.sin(a) + dy * np.cos(a)
        f += rng.uniform(.5, 1.0) * np.exp(-(u * u / (2 * sx * sx) + v * v / (2 * sy * sy)))
    f = f / f.max()
    # fade to night toward one random corner, like the reference's dark lower right
    corner = rng.integers(0, 4); cxn, cyn = [(1, .73), (0, .73), (1, 0), (0, 0)][corner]
    d = np.sqrt((x - cxn) ** 2 + (y - cyn) ** 2)
    fade = np.clip(d / 0.9, 0, 1)
    v = 1 - f                         # high field -> bright centre, low -> dark
    v = v * fade + 1.0 * (1 - fade)   # pull the far corner to night
    v = np.clip(v + np.clip(0.35 - f, 0, 1) * 0.6, 0, 1)   # let the weakest areas sink to night too
    return v

for name, seed in PAGES.items():
    img = Image.fromarray(ramp(field(seed)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))
    img.save(ROOT / "img" / "aura" / f"{name}.jpg", "JPEG", quality=80, optimize=True, progressive=False)
    print(name)
