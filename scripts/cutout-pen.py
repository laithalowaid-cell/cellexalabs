import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
trim = int(sys.argv[3]) if len(sys.argv) > 3 else 0
im = Image.open(src).convert("RGB")
if trim: im = im.crop((0, trim, im.width, im.height))
L = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(0.8))).astype(float)
h, w = L.shape
bg = np.percentile(L, 99.5)
D = bg - L
D[:4] = 0
# blank any band of another photo touching the top edge (it fades out before the pen starts)
_p = np.median(bg - L, axis=1)
_c = 0
while _c < h // 3 and _p[_c] > 2: _c += 1
if _c: D[:_c + 2] = 0
D[-2:] = 0
# rough vertical extent from the median profile (bridging the highlight band)
prof = np.median(D, axis=1)
on = np.where(prof > 3)[0]
groups = [[on[0], on[0]]]
for r in on[1:]:
    if r - groups[-1][1] <= max(4, int(h * 0.22)): groups[-1][1] = r
    else: groups.append([r, r])
r0, r1 = max(groups, key=lambda g: g[1] - g[0])
ph = r1 - r0
lo, hi = max(0, r0 - ph // 6), min(h, r1 + ph // 6)
mid = (r0 + r1) // 2
top = np.full(w, np.nan); bot = np.full(w, np.nan)
for x in range(w):
    col = D[lo:hi, x]
    # bottom rim: darkest point in the lower half; the pen ends just below it, before the soft shadow
    base = mid - lo + int(ph * 0.28)
    lower = col[base:]
    k = int(np.argmax(lower)); peak = lower[k]
    if peak < 14: continue
    # walk down past the rim while it stays dark
    j = k
    while j + 1 < len(lower) and lower[j + 1] > peak * 0.55: j += 1
    b = lo + base + j
    # top rim: first row from the top that is clearly darker than background
    upper = col[: mid - lo]
    idx = np.where(upper > 6)[0]
    if not len(idx): continue
    t = lo + idx[0]
    if b - t < ph * 0.5: continue
    top[x], bot[x] = t, b
cols = np.where(~np.isnan(top))[0]
c0, c1 = cols[0], cols[-1]
def med(v, k):
    out = v.copy()
    for x in range(c0, c1 + 1):
        s = v[max(c0, x - k):min(c1, x + k) + 1]; s = s[~np.isnan(s)]
        out[x] = np.median(s) if len(s) else np.nan
    return out
top, bot = med(top, 4), med(bot, 4)
span = c1 - c0
core = slice(c0 + int(span * 0.06), c1 - int(span * 0.09))
mt, mb = np.nanmedian(top[core]), np.nanmedian(bot[core])
# body: perfectly straight edges; ends: may only move inward (rounded corners, narrower dial)
top = np.where(np.isnan(top), np.nan, np.maximum(top, mt)); bot = np.where(np.isnan(bot), np.nan, np.minimum(bot, mb))
xs_all = np.arange(len(top))
inner = (xs_all >= core.start) & (xs_all < core.stop)
top[inner & ~np.isnan(top)] = mt; bot[inner & ~np.isnan(bot)] = mb
# sub-pixel mask: 1 inside, soft 1px edge, shrunk half a pixel so no background survives
yy = np.arange(h)[:, None]
T = np.nan_to_num(top, nan=1e9)[None, :] + 0.6
B = np.nan_to_num(bot, nan=-1e9)[None, :] - 0.6
alpha = np.clip(np.minimum(yy - T + 1, B - yy + 1), 0, 1)
# horizontal ends: soften the first and last columns
xs = np.arange(w)[None, :]
alpha *= np.clip(np.minimum(xs - c0 - 0.5, c1 - xs - 0.5), 0, 1)
a = (alpha * 255).astype(np.uint8)
out = im.convert("RGBA"); out.putalpha(Image.fromarray(a))
out = out.crop(Image.fromarray(a).getbbox())
out.save(dst)
