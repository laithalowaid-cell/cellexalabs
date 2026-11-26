"""Rock-and-snow range, rendered as depth layers. v2: domain-warped ridges, cast shadows,
snow cover except on cliffs, sky ambient light, aerial perspective, 2x supersampling."""
import numpy as np, sys
from PIL import Image
N = 2048
rng = np.random.default_rng(7)

def vnoise(cells, seed):
    r = np.random.default_rng(seed).random((cells + 3, cells + 3)).astype(np.float32)
    im = Image.fromarray(r, mode="F").resize(((cells + 3) * N // cells,) * 2, Image.BICUBIC)
    return np.asarray(im)[:N, :N]

def fbm(octs, seed):
    h = sum(vnoise(c, seed + i) * a for i, (c, a) in enumerate(octs))
    return h / sum(a for _, a in octs)

yy, xx = (np.mgrid[0:N, 0:N] / N).astype(np.float32)
# domain warp for natural, non-grid ridges
wx = fbm([(3, 1), (6, .5), (12, .25)], 100) - .5
wz = fbm([(3, 1), (6, .5), (12, .25)], 200) - .5
def warped_ridged(seed, octs):
    h = np.zeros((N, N), np.float32); amp = 0; prev = np.ones((N, N), np.float32)
    for i, (cells, a) in enumerate(octs):
        n = vnoise(cells, seed + i)
        # sample warped coordinates via index lookup
        fx = np.clip((xx + wx * .18) * (N - 1), 0, N - 1.001)
        fz = np.clip((yy + wz * .18) * (N - 1), 0, N - 1.001)
        x0 = fx.astype(int); z0 = fz.astype(int); tx = fx - x0; tz = fz - z0
        n = (n[z0, x0] * (1 - tx) + n[z0, x0 + 1] * tx) * (1 - tz) + (n[z0 + 1, x0] * (1 - tx) + n[z0 + 1, x0 + 1] * tx) * tz
        r = (1 - np.abs(2 * n - 1)) ** 2
        h += r * a * (0.45 + 0.55 * prev); prev = r; amp += a
    return h / amp
ridge = warped_ridged(10, [(4, 1), (8, .55), (16, .34), (32, .22), (64, .14), (128, .08), (256, .045)])
low = fbm([(2, 1), (4, .5), (8, .25)], 300)
g = lambda cx, cz, sx, sz: np.exp(-(((xx - cx) / sx) ** 2 + ((yy - cz) / sz) ** 2))
massif = g(.52, .64, .19, .15) * 1.0 + g(.27, .58, .15, .12) * .62 + g(.79, .6, .16, .14) * .7 + np.exp(-(((yy - .92) / .12) ** 2)) * (.42 + .3 * low)
H = massif * (.5 + .8 * ridge) + ridge * .1 + low * .06
H *= np.clip((yy - .1) / .28, 0, 1) ** 1.3
H = H.astype(np.float32)
H[:8] = H[8]

# ---------- snow-smoothed surface: snow fills gullies and rounds edges ----------
def blur(a, k):
    out = a.copy()
    for _ in range(k):
        out = (out * 2 + np.roll(out, 1, 0) + np.roll(out, -1, 0) + np.roll(out, 1, 1) + np.roll(out, -1, 1)) / 6
    return out
Hs = blur(H, 1)
# normals
def normals(h, scale):
    gy, gx = np.gradient(h * scale)
    nx, nz, ny = -gx * N / 60, -gy * N / 60, np.ones_like(h)
    l = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    return nx / l, ny / l, nz / l
nx, ny, nz = normals(Hs, 9.0)
lx, ly, lz = normals(blur(H, 1), 17.0)  # sharper relief for light and shade
slope = 1 - ny

# ---------- snow cover: everywhere except steep cliffs and a few wind-scoured ribs ----------
patch = fbm([(10, 1), (24, .6), (60, .3)], 400)
cliff = np.clip((slope - .62) * 6, 0, 1)                      # steep faces shed snow
ribs = np.clip((ridge - .62) * 5, 0, 1) * np.clip((slope - .32) * 4, 0, 1) * (patch > .55)
rock = np.clip(cliff * (.35 + .5 * patch) + ribs * .3, 0, .8)
rock *= np.clip((Hs - .08) * 6, 0, 1)                           # valley floor fully white
snow = 1 - rock

# ---------- lighting: low sun from the left, cast shadows, sky ambient ----------
sun = np.array([-.7, .34, -.45]); sun /= np.linalg.norm(sun)
lam = np.clip(lx * sun[0] + ly * sun[1] + lz * sun[2], 0, 1)
# cast shadows: march toward the sun in heightmap space
HS = (blur(H, 1) * 0.255).astype(np.float32)  # world height units used by the camera
shadow = np.zeros((N, N), np.float32)
step_xy = np.array([sun[0], sun[2]]) / np.hypot(sun[0], sun[2])
rise = sun[1] / np.hypot(sun[0], sun[2])
for k in range(1, 300):
    d = k * 1.4
    ox, oz = int(round(step_xy[0] * d)), int(round(step_xy[1] * d))
    shifted = np.full_like(HS, -1.0)
    sz0, sz1 = max(0, -oz), N - max(0, oz); dz0 = max(0, oz)
    sx0, sx1 = max(0, -ox), N - max(0, ox); dx0 = max(0, ox)
    shifted[sz0:sz1, sx0:sx1] = HS[dz0:dz0 + (sz1 - sz0), dx0:dx0 + (sx1 - sx0)]
    shadow = np.maximum(shadow, np.clip((shifted - HS - rise * d / N) * 900, 0, 1))
shadow = blur(shadow.astype(np.float32), 5)
direct = lam * (1 - shadow * .95)
amb = .35 + .45 * ly                                            # open sky above flat snow
# colours
snow_lit = np.array([253, 253, 255.]); snow_shade = np.array([112, 144, 198.]); snow_deep = np.array([92, 124, 182.])
rock_lit = np.array([120, 130, 150.]); rock_dark = np.array([48, 60, 86.])
bright = np.clip(direct * 1.55 + .3 * ly, 0, 1)
t = bright[..., None] ** .9
snowc = snow_shade * (1 - t) + snow_lit * t
snowc = snowc * (.84 + .16 * amb[..., None])

snowc = np.where((shadow[..., None] > .5) & (amb[..., None] < .55), snowc * .9 + snow_deep * .1, snowc)
grain = (fbm([(200, 1)], 500)[..., None] - .5) * 14
rockc = rock_dark + (rock_lit - rock_dark) * np.clip(direct * 1.1 + .1, 0, 1)[..., None] + grain
COL = snowc * snow[..., None] + rockc * rock[..., None]
COL = blur(COL.astype(np.float32), 1)
COL[:24] = COL[24]

# ---------- camera ----------
W, Ht = int(sys.argv[1]), int(sys.argv[2])
SS = 2
Wr, Hr = W * SS, Ht * SS
cam = np.array([.5, .11, -.46])
focal = Wr * 1.15; horizon = Hr * .63
HZ = np.array([214, 230, 246.])
def sample(A, wx_, wz_):
    wx_ = np.clip(0.5 + (wx_ - 0.5) * 0.7, 0, 1)
    fx = np.clip(wx_ * (N - 1), 0, N - 1.001); fz = np.clip(wz_ * (N - 1), 0, N - 1.001)
    x0 = fx.astype(int); z0 = fz.astype(int); tx = fx - x0; tz = fz - z0
    a = A[z0, x0]; b = A[z0, x0 + 1]; c = A[z0 + 1, x0]; d = A[z0 + 1, x0 + 1]
    if A.ndim == 3: tx = tx[..., None]; tz = tz[..., None]
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz
def render(z_from, z_to, nz=4200):
    d = np.geomspace(max(z_from - cam[2], .02), z_to - cam[2], nz)
    cols = (np.arange(Wr) - Wr / 2) / focal
    wx_ = cam[0] + cols[None, :] * d[:, None]
    wz_ = cam[2] + d[:, None] * np.ones((1, Wr))
    h = sample(HS, wx_, wz_)
    ytop = horizon - (h - cam[1]) * focal / d[:, None]
    colr = sample(COL, wx_, wz_)
    img = np.zeros((Hr, Wr, 4), np.float32)
    rows = np.arange(Hr)
    for i in range(Wr):
        m = np.minimum.accumulate(ytop[:, i])
        idx = np.searchsorted(-m, -rows, side="left")
        vis = idx < len(d)
        idx = np.minimum(idx, len(d) - 1)
        # interpolate between the two depth steps that bracket the hit, so faces are smooth
        ip = np.maximum(idx - 1, 0)
        a0 = m[ip]; a1 = m[idx]
        tt = np.clip((a0 - rows) / np.maximum(a0 - a1, 1e-6), 0, 1)[:, None]
        tt = np.where((idx > 0)[:, None], tt, 1.0)
        c = colr[ip, i] * (1 - tt) + colr[idx, i] * tt
        dist = d[ip] * (1 - tt[:, 0]) + d[idx] * tt[:, 0]
        near = np.clip(1 - (dist - .05) / .8, 0, 1)[:, None] ** 1.3
        c = c * (1 - near) + np.array([240, 244, 251.]) * near
        fog = (np.clip((dist - .7) / 1.4, 0, 1) ** 1.15 * .58)[:, None]
        img[:, i, :3] = c * (1 - fog) + HZ * fog
        img[:, i, 3] = vis * 255
    out = Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGBA")
    return out.resize((W, Ht), Image.LANCZOS)
mode = sys.argv[3]
if mode == "full":
    a = render(-.42, 1.0)
    t = (np.arange(Ht) / Ht)[:, None, None]
    sky = (np.array([28, 74, 150.]) * (1 - t) + np.array([206, 226, 246.]) * t) * np.ones((1, W, 1))
    bg = Image.fromarray(sky.astype(np.uint8)).convert("RGBA"); bg.alpha_composite(a)
    bg.convert("RGB").save(sys.argv[4])
else:
    render(float(sys.argv[5]), float(sys.argv[6])).save(sys.argv[4])
