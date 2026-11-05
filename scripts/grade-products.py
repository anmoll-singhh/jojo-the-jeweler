"""
Colour-grade every product photo to one look: the black satin is matched to the same depth and the
same neutral tone, so a grid of products reads as one shoot. Jewellery is protected: corrections are
measured on the satin only and applied mostly to the shadows.

Usage: python3 scripts/grade-products.py   (originals are kept once in content/media-originals/products)
Re-run after new product photos are collected; it always grades from the kept original.
"""
import glob, os, shutil
import numpy as np
from PIL import Image

SRC = 'public/media/products'
KEEP = 'content/media-originals/products'
TARGET_SATIN = 0.075          # median satin luminance after grading (0..1)
TINT = np.array([1.0, 0.985, 0.955])  # warm-neutral black, like the brand ground

os.makedirs(KEEP, exist_ok=True)
for f in sorted(glob.glob(f'{SRC}/*.webp')):
    if f.endswith('-800.webp'):
        continue
    keep = os.path.join(KEEP, os.path.basename(f))
    if not os.path.exists(keep):
        shutil.copy2(f, keep)
    a = np.asarray(Image.open(keep).convert('RGB')).astype(np.float32) / 255
    lum = a @ np.array([0.2126, 0.7152, 0.0722])
    mx, mn = a.max(2), a.min(2)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    satin = (sat < 0.28) & (lum < 0.42) & (lum > 0.005)
    if satin.mean() < 0.05:
        satin = lum < np.percentile(lum, 40)
    # 1 white balance from the satin, limited so metal colour isn't pushed
    med = np.median(a[satin], axis=0)
    gain = np.clip(med.mean() / np.maximum(med, 1e-4), 0.85, 1.18) * TINT
    # apply the cast correction fully in the shadows, fading out toward highlights
    w = np.clip(1 - lum / 0.6, 0, 1)[..., None]
    a = a * (1 + (gain - 1) * w)
    lum = a @ np.array([0.2126, 0.7152, 0.0722])
    # 2 black point
    bp = np.percentile(lum, 0.5)
    a = np.clip((a - bp) / (1 - bp), 0, 1)
    lum = a @ np.array([0.2126, 0.7152, 0.0722])
    # 3 satin depth: gamma on luminance so the satin median hits the target; highlights stay put
    m = float(np.median(lum[satin]))
    g = float(np.clip(np.log(TARGET_SATIN) / np.log(max(m, 1e-3)), 0.7, 1.7))
    nl = np.power(np.maximum(lum, 1e-5), g)
    a = np.clip(a * (nl / np.maximum(lum, 1e-5))[..., None], 0, 1)
    # 4 one shared finish: gentle S-curve for snap
    a = np.clip(a + 0.06 * np.sin(np.pi * a) * (a - 0.5) * 2, 0, 1)
    out = Image.fromarray((a * 255 + 0.5).astype(np.uint8))
    out.save(f, 'WEBP', quality=88, method=6)
    small = out.copy(); small.thumbnail((800, 800 * out.height // out.width + 1))
    small.save(f.replace('.webp', '-800.webp'), 'WEBP', quality=82, method=6)
    print(f'{os.path.basename(f):40s} satin {m:.3f} -> gamma {g:.2f}, gain {np.round(gain, 3)}')
