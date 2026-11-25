import math, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
D = sys.argv[1]
def inst(path, wght):
    f = TTFont(path)
    return instantiateVariableFont(f, {"wght": wght}, inplace=False)
FONTS = {
  "corm": inst(f"{D}/CormorantGaramond.ttf", 500),
  "cinzel": inst(f"{D}/Cinzel.ttf", 400),
  "mont": inst(f"{D}/Montserrat.ttf", 400),
}
def glyph_path(font, ch, x, y, size):
    gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font["head"].unitsPerEm
    g = cmap[ord(ch)]; s = size / upm
    pen = SVGPathPen(gs)
    tp = TransformPen(pen, (s, 0, 0, -s, x, y))
    gs[g].draw(tp)
    adv = font["hmtx"][g][0] * s
    bp = BoundsPen(gs); gs[g].draw(bp)
    b = bp.bounds
    bounds = (x + b[0]*s, y - b[3]*s, x + b[2]*s, y - b[1]*s) if b else None
    return pen.getCommands(), adv, bounds
def text_paths(font, text, x, y, size, tracking=0.0):
    out = []; cx = x; last = None
    for ch in text:
        if ch == " ":
            cx += size * 0.3; continue
        d, adv, b = glyph_path(font, ch, cx, y, size)
        out.append(d); last = b
        cx += adv + tracking * size
    return " ".join(out), cx - tracking * size

NAVY = "#1b3567"
# ---------- Mark (viewBox 0 0 500 528 like the original) ----------
C_d, _, Cb = glyph_path(FONTS["corm"], "C", 0, 0, 640)
L_d, _, Lb = glyph_path(FONTS["corm"], "L", 0, 0, 470)
def place(d_fn, ch, font, size, left, bottom):
    d, adv, b = glyph_path(font, ch, 0, 0, size)
    dx = left - b[0]; dy = bottom - b[3]
    d2, _, b2 = glyph_path(font, ch, dx, dy, size)
    return d2, b2
Cd, Cb = place(None, "C", FONTS["corm"], 800, 2, 524)
Ld, Lb = place(None, "L", FONTS["corm"], 630, 150, 518)
# molecule: benzene ring with double bond, six substituent bonds and end nodes
cx, cy, r = 386, 300, 56
pts = [(cx + r*math.cos(math.radians(-90+60*i)), cy + r*math.sin(math.radians(-90+60*i))) for i in range(6)]
ring = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"
# inner double bond parallel to the left side (between vertices 4 and 5)
ax, ay = pts[5]; bx, by = pts[4]
ix, iy = (cx - ax) * 0.2, (cy - ay) * 0.0
inner = f"M{ax+13:.1f} {ay+11:.1f} L{bx+13:.1f} {by-11:.1f}"
stubs = []; nodes = []
for (x, y) in pts:
    ux, uy = (x - cx) / r, (y - cy) / r
    ex, ey = x + ux*54, y + uy*54
    stubs.append(f"M{x:.1f} {y:.1f} L{ex:.1f} {ey:.1f}")
    nodes.append((ex, ey))
mol = f'<path d="{ring} {inner} {" ".join(stubs)}" fill="none" stroke="{{ink}}" stroke-width="4.6" stroke-linejoin="round" stroke-linecap="round"/>' + "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="12" fill="{{dot}}"/>' for x, y in nodes)
grad = '<defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3d63a6"/><stop offset="0.55" stop-color="#244680"/><stop offset="1" stop-color="#15295a"/></linearGradient></defs>'
def mark_svg(ink=NAVY, dot=NAVY, cfill="url(#cg)", w=None, h=None):
    size = f' width="{w}" height="{h}"' if w else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 528"{size}>' + (grad if cfill.startswith("url") else "") +
            f'<path d="{Cd}" fill="{cfill}"/><path d="{Ld}" fill="{cfill}"/>' + mol.replace("{ink}", ink).replace("{dot}", dot) + "</svg>")
open(f"{D}/mark.svg", "w").write(mark_svg())
open(f"{D}/mark-white.svg", "w").write(mark_svg(ink="#ffffff", dot="#ffffff", cfill="#ffffff"))
# ---------- Lockup ----------
# mark scaled to height 200 at x=0, wordmark to the right
ms = 200 / 528
word_d, word_end = text_paths(FONTS["cinzel"], "CELLEXA", 0, 0, 100, tracking=0.24)
# measure CELLEXA bounds
_, _, b0 = glyph_path(FONTS["cinzel"], "C", 0, 0, 100)
cap = 100 * 0.70
WX = 240; WY = 112
word_d, word_end = text_paths(FONTS["cinzel"], "CELLEXA", WX, WY, 100, tracking=0.24)
labs_d, labs_end = text_paths(FONTS["mont"], "LABS", 0, 0, 40, tracking=0.7)
labs_w = labs_end
mid = (WX + word_end) / 2
LX = mid - labs_w / 2; LY = 184
labs_d, labs_end = text_paths(FONTS["mont"], "LABS", LX, LY, 40, tracking=0.7)
rule_y = LY - 14
rules = f'<path d="M{WX+40:.1f} {rule_y} L{LX-34:.1f} {rule_y} M{labs_end+34:.1f} {rule_y} L{word_end-40:.1f} {rule_y}" stroke="{{ink}}" stroke-width="2" stroke-linecap="round"/>'
W = word_end + 6; H = 200
def lockup_svg(ink=NAVY, dot=NAVY, cfill="url(#cg)"):
    inner_mark = mark_svg(ink, dot, cfill).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 528">', "").replace("</svg>", "")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H}">' +
            f'<g transform="scale({ms:.5f})">{inner_mark}</g>' +
            f'<path d="{word_d}" fill="{ink}"/><path d="{labs_d}" fill="{ink}"/>' + rules.replace("{ink}", ink) + "</svg>")
open(f"{D}/logo.svg", "w").write(lockup_svg())
open(f"{D}/logo-white.svg", "w").write(lockup_svg(ink="#ffffff", dot="#ffffff", cfill="#ffffff"))
print("lockup", round(W), H)
