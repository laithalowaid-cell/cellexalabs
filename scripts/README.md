# Image scripts

Python 3 with numpy and Pillow.

## Mountain layers (`public/mountain/`)
Renders the rock-and-snow range as three depth layers for the parallax hero.

```bash
python3 scripts/render-mountain.py 2400 1500 layer far.png 0.72 1.0
python3 scripts/render-mountain.py 2400 1500 layer massif.png 0.18 0.72
python3 scripts/render-mountain.py 2400 1500 layer snow.png -0.40 0.18
```
Then save each as WebP (`<name>.webp` at 2400 px and `<name>-sm.webp` at 1200 px).

## Pen cut-outs (`public/pens/`)
Removes the white background from a pen photo so it can float over the mountain.

```bash
python3 scripts/cutout-pen.py public/products/<pen>.png /tmp/<pen>.png
```
Save the result as `public/pens/<pen>.webp` (max 1200 px wide) and add its size to
`src/lib/cutout-sizes.json`.
