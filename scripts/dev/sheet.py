# usage: python3 scripts/dev/sheet.py in.png out.jpg [colh] — slices a tall screenshot into side-by-side columns
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; colh = int(sys.argv[3]) if len(sys.argv) > 3 else 2600
im = Image.open(src); W, H = im.size
cols = [im.crop((0, y, W, min(H, y + colh))) for y in range(0, H, colh)]
sheet = Image.new('RGB', (len(cols) * (W + 12), colh), (70, 70, 70))
for i, c in enumerate(cols): sheet.paste(c, (i * (W + 12), 0))
sheet.thumbnail((2000, 2000)); sheet.save(out, quality=70); print(out, sheet.size)
