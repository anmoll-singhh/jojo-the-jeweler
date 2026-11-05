"""
JPG (or PNG, when the image has transparency) copies of every WebP under public/media, for the few
browsers without WebP (Safari 13 and older). The site only requests them when WebP isn't supported
(src/lib/formats.ts). Run after adding or re-grading images: python3 scripts/fallback-images.py
"""
import glob, os
from PIL import Image
n = 0
for f in glob.glob('public/media/**/*.webp', recursive=True):
    im = Image.open(f)
    alpha = im.mode in ('RGBA', 'LA') and im.getchannel('A').getextrema()[0] < 255
    out = f[:-5] + ('.png' if alpha else '.jpg')
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(f):
        continue
    if alpha: im.save(out, 'PNG', optimize=True)
    else: im.convert('RGB').save(out, 'JPEG', quality=82, optimize=True, progressive=True)
    n += 1
print(n, 'fallbacks written')
