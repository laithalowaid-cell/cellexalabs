import numpy as np, sys
from PIL import Image, ImageFilter
rng = np.random.default_rng(21)
N = 2048  # heightmap res over world [0,1]x[0,1]
def vnoise(cells, seed):
    r = np.random.default_rng(seed).random((cells + 3, cells + 3))
    im = Image.fromarray((r * 65535).astype(np.uint16).astype(np.int32)).convert('F')
    big = np.asarray(im.resize(((cells + 3) * N // cells, (cells + 3) * N // cells), Image.BICUBIC))
    return big[:N, :N] / 65535.0
def ridged(oct_list, seed):
    h = np.zeros((N, N)); amp_sum = 0; w = 1.0
    for i, (cells, amp) in enumerate(oct_list):
        n = vnoise(cells, seed + i)
        r = 1 - np.abs(2 * n - 1); r = r ** 2
        h += r * amp * (0.5 + 0.5 * w); w = r; amp_sum += amp
    return h / amp_sum
yy, xx = np.mgrid[0:N, 0:N] / N   # yy = depth (z), xx = x
ridge = ridged([(4, 1.0), (8, .6), (16, .4), (32, .25), (64, .14), (128, .08)], 5)
fbm = sum(vnoise(c, 50 + c) * a for c, a in [(3, 1), (6, .5), (12, .25)]) / 1.75
# main massif behind centre, two shoulders, valley in front
peak = np.exp(-(((xx - .52) / .16) ** 2 + ((yy - .62) / .13) ** 2))
sh1 = np.exp(-(((xx - .25) / .14) ** 2 + ((yy - .55) / .12) ** 2)) * .62
sh2 = np.exp(-(((xx - .8) / .15) ** 2 + ((yy - .58) / .14) ** 2)) * .7
back = np.exp(-(((yy - .9) / .12) ** 2)) * (.45 + .3 * fbm)
H = (peak * 1.0 + sh1 + sh2 + back) * (.55 + .75 * ridge) + ridge * .12 + fbm * .05
H *= np.clip((yy - .08) / .25, 0, 1) ** 1.2      # flatten the foreground valley
crag = (np.exp(-(((xx - .04) / .07) ** 2 + ((yy - .1) / .07) ** 2)) * .75 + np.exp(-(((xx - .97) / .08) ** 2 + ((yy - .14) / .08) ** 2)) * .9)
H += crag * (.45 + .9 * ridge)
H = (H + np.roll(H,1,0) + np.roll(H,-1,0) + np.roll(H,1,1) + np.roll(H,-1,1)) / 5
Hb = H.copy()
for _ in range(6): Hb = (Hb + np.roll(Hb,3,0) + np.roll(Hb,-3,0) + np.roll(Hb,3,1) + np.roll(Hb,-3,1)) / 5
cav = np.clip(.5 + (H - Hb) * 14, 0, 1)
# normals
gy, gx = np.gradient(H * 9.0)
nx, nz, ny = -gx * N / 60, -gy * N / 60, np.ones_like(H)
ln = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2); nx, ny, nz = nx / ln, ny / ln, nz / ln
sun = np.array([-.55, .62, -.55]); sun /= np.linalg.norm(sun)
lam = np.clip(nx * sun[0] + ny * sun[1] + nz * sun[2], 0, 1)
# snow: above a noisy snowline and on gentler slopes
snowline = .5 + fbm * .2 - np.clip(yy - .6, 0, 1) * .3
slope = 1 - ny
snow = np.clip((H - snowline) * 7, 0, 1) * np.clip(1 - (slope - .22) * 5.5, 0, 1)
snow = np.clip(snow + np.clip((H - .9) * 6, 0, 1) * .6, 0, 1)
flat = np.clip(1 - slope * 9, 0, 1)
snow = np.clip(snow + flat * np.clip(.35 + fbm, 0, 1) + np.clip(.22 - H, 0, 1) * 5, 0, 1)
snow = np.clip(snow * 1.15 + np.clip((H - snowline + .12) * 3, 0, 1) * np.clip(1 - (slope - .3) * 3, 0, 1) * .7, 0, 1)
rock_lit = np.array([124, 140, 164.]); rock_dark = np.array([30, 40, 62.])
snow_lit = np.array([250, 252, 255.]); snow_shade = np.array([150, 176, 214.])
strata = (np.sin(H * 140 + fbm * 9) * .5 + .5) * .06
rock = rock_dark + (rock_lit - rock_dark) * np.clip(lam * 1.35 * (.35 + 1.0 * cav) - strata, 0, 1)[..., None]
snowc = snow_shade + (snow_lit - snow_shade) * (np.clip(lam * 1.3 - .1, 0, 1) * (.75 + .3 * cav))[..., None] ** .8
COL = rock * (1 - snow[..., None]) + snowc * snow[..., None]
COL = (COL*2 + np.roll(COL,1,1) + np.roll(COL,-1,1) + np.roll(COL,1,0) + np.roll(COL,-1,0)) / 6
COL[:24] = COL[24]
H[:6] = H[6]

W, Ht = int(sys.argv[1]), int(sys.argv[2])
cam = np.array([.5, .13, -.42])   # x, height, z
focal = W * 0.95; horizon = Ht * 0.50; tilt = 0
def sample(A, wx, wz):
    wx = 1 - np.abs(1 - np.mod(wx, 2))
    fx = np.clip(wx * (N - 1), 0, N - 1.001); fz = np.clip(wz * (N - 1), 0, N - 1.001)
    x0 = fx.astype(int); z0 = fz.astype(int); tx = fx - x0; tz = fz - z0
    a = A[z0, x0]; b = A[z0, x0 + 1]; c = A[z0 + 1, x0]; d = A[z0 + 1, x0 + 1]
    if A.ndim == 3: tx = tx[..., None]; tz = tz[..., None]
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz
def render(z_from, z_to, nz=2400):
    d = np.geomspace(max(z_from - cam[2], .02), z_to - cam[2], nz)       # distances
    cols = (np.arange(W) - W / 2) / focal
    wx = cam[0] + cols[None, :] * d[:, None]
    wz = cam[2] + d[:, None] * np.ones((1, W))
    h = sample(H, wx, wz) * .34
    ytop = horizon - (h - cam[1]) * focal / d[:, None]
    img = np.zeros((Ht, W, 4))
    rows = np.arange(Ht)
    colr = sample(COL, wx, wz)
    for i in range(W):
        m = np.minimum.accumulate(ytop[:, i])           # running min (front-to-back occlusion)
        # first depth index whose running-min top is above this row
        idx = np.searchsorted(-m, -rows, side='left')
        vis = idx < len(d)
        idx = np.minimum(idx, len(d) - 1)
        c = colr[idx, i]
        dist = d[idx]
        fog = np.clip((dist - .7) / 1.4, 0, 1) ** 1.2 * .5
        sky_near = np.array([214, 230, 246.])
        c = c * (1 - fog[:, None]) + sky_near * fog[:, None]
        img[:, i, :3] = c; img[:, i, 3] = vis * 255
    return img
mode = sys.argv[3]
if mode == 'full':
    img = render(-0.40, 1.0)
    sky = np.zeros((Ht, W, 3))
    t = (np.arange(Ht) / Ht)[:, None, None]
    sky = (np.array([42, 92, 168.]) * (1 - t) + np.array([206, 226, 246.]) * t) * np.ones((1, W, 1))
    a = img[..., 3:4] / 255
    out = img[..., :3] * a + sky * (1 - a)
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(sys.argv[4])
else:
    z0, z1 = float(sys.argv[5]), float(sys.argv[6])
    img = render(z0, z1)
    Image.fromarray(img.clip(0, 255).astype(np.uint8), 'RGBA').save(sys.argv[4])
