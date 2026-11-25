import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
L = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(1.6))).astype(float)
h, w = L.shape
D = np.percentile(L, 99.5) - L          # darkness vs background
prof = np.median(D, axis=1)
on = np.where(prof > 3)[0]
# group rows, bridging highlight gaps shorter than 22% of height
groups = [[on[0], on[0]]]
for r in on[1:]:
    if r - groups[-1][1] <= max(4, int(h * 0.22)): groups[-1][1] = r
    else: groups.append([r, r])
r0, r1 = max(groups, key=lambda g: g[1] - g[0])
pad = max(3, (r1 - r0) // 12)
lo, hi = max(0, r0 - pad), min(h, r1 + pad + 1)
top = np.full(w, np.nan); bot = np.full(w, np.nan)
for x in range(w):
    col = np.where(D[lo:hi, x] > 4)[0]
    if len(col) and col[-1] - col[0] > (r1 - r0) * 0.35:
        top[x] = lo + col[0]; bot[x] = lo + col[-1]
cols = np.where(~np.isnan(top))[0]
c0, c1 = cols[0], cols[-1]
def smooth(v, k=7):
    out = v.copy()
    for x in range(c0, c1 + 1):
        s = v[max(c0, x - k):min(c1, x + k) + 1]; s = s[~np.isnan(s)]
        out[x] = np.median(s) if len(s) else np.nan
    return out
top, bot = smooth(top), smooth(bot)
mt, mb = np.nanmedian(top), np.nanmedian(bot); ph = mb - mt
top = np.where(top < mt - 0.12*ph, mt, top); bot = np.where(bot > mb + 0.12*ph, mb, bot)
mask = np.zeros((h, w), np.uint8)
for x in range(c0, c1 + 1):
    if not np.isnan(top[x]): mask[int(top[x]):int(bot[x]) + 1, x] = 255
m = Image.fromarray(mask).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
out = im.convert("RGBA"); out.putalpha(m)
bb = m.getbbox()
out.crop(bb).save(dst, optimize=True)
