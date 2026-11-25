# Cellexa Labs: design system

## Brief
- Subject: Cellexa Labs, an online shop in the UAE selling research peptides, mainly as pre-filled pens (dial-dose, 240 units), plus vials. Prices in AED. Orders go out by WhatsApp.
- Audience: buyers in the UAE comparing suppliers on purity, format and price, mostly on phones.
- Job: make the pens the hero, show the range clearly, and get people to a product page and into the cart.
- Owner direction: white and blue, smooth, fully animated, "a full mountain of rock and snow", pens as the star.
- Constraints: products, prices and legal text stay as they are. Research-use-only wording stays on every product.

## Concepts considered
| | Idea | Anchor | Signature | O/F/Fe/P |
|---|---|---|---|---|
| A. Place / material | **Summit.** The shop is a mountain of rock and snow. Scrolling is the ascent; the pen sits at the summit as the cleanest thing on the mountain | owner asked for rock and snow; the pens are white with navy type, the colours of snow and shadowed rock | pinned hero: the camera climbs past three depth layers while the pen glides across the snowfield; snow keeps falling at rest | 4 / 5 / 4 / 2 |
| B. Material | The dial: scrolling clicks a dose dial; a units counter ticks 0 to 240 | "240 units" printed on every pen | a giant dial cap that turns with scroll | 4 / 4 / 3 / 2 |
| C. Formal | Everything is horizontal like a pen barrel | pens are long horizontal objects | the page is one long rail | 2 / 3 / 4 / 4 |

Picked **A**, because it is what the owner asked for and it gives every page a world. Stolen from B: the "240 units" dial appears as the pen anatomy callout and the units counter in the hero.

## Concept card
```
Idea:        The pens live at the summit of a mountain of rock and snow; scrolling is the climb.
Metaphor:    An alpine ascent: base, ridge, summit. Snowfall, cold light, clean air.
Signature:   Pinned hero. Far ridge, massif and snowfield move at different speeds as you scroll,
             the "CELLEXA" wordmark sits behind the peak, and a pen glides across the snow.
Emotion:     Cold, clean, quiet confidence.
Motion verb: glide like a ski across snow (long horizontal travel, soft stop), settle like snowfall.
Screenshot:  The peak cutting through the giant wordmark with a pen floating over the snowfield.
```

## Palette
| Role | Hex | Notes |
|---|---|---|
| ground (snow) | #ffffff | main background |
| frost | #f3f7fc | alternate section ground |
| ink (rock shadow) | #0b1a35 | text, same navy as the pen labels |
| muted | #55667f | secondary text, 5.6:1 on white |
| line | #dce5f1 | hairlines |
| accent (glacier blue) | #1d55c0 | links, focus, active states |
| sky top / horizon | #2a5fae / #d7e7f7 | hero sky only |

## Type
- Display: Archivo (variable, wdth 62 to 125). Expanded width (wdth 118 to 125) and tight tracking for display, matching the wide-tracked caps on the pen labels.
- Text: Geist 400/500/600, 16px base.
- Data: Geist Mono for doses, units, prices and molecular data.

## Grid & rhythm
12 columns, 24px gutter, 16px phone margin. Sections alternate between full-bleed scenes (hero, pen anatomy) and contained index layouts (range, bundles). Pens always run horizontally and are never rotated more than 8 degrees.

## Shape
Radius 0 on scenes, 999px on pills and buttons, 16px on cards. No drop shadows on cards; pens get a soft contact shadow on the snow.

## Motion
- Eases: expo.out for entrances, expo.inOut for transitions, power3.out for small UI.
- Primary targets glide: buttons slide their label up and a fill floods from the left; pen rows glide the pen 24px to the right on hover.
- Page transition: a white-out. A snow-white panel sweeps up from the bottom, then lifts.
- Idle: snow keeps falling in the hero and on the product page; the pen floats 6px.
- Reduced motion: no smooth scroll, no snowfall, no pinning; everything visible and still.

## Sections (home)
```
[ HERO  sticky 220svh ]  sky / far / WORDMARK / massif / snow / pen / snowfall
[ PEN ANATOMY ]          one big pen, callouts: dial cap, 240 units, pre-filled barrel
[ THE RANGE ]            index list of pens, name | doses | from price, pen glides in
[ VIALS ]                small band, three vials, link
[ BUNDLES ]              existing bundle cards
[ CATEGORIES ]           four lines, big type
[ SUMMIT CLOSER ]        mountain crop + CTA
```

## Genericness check
- Hero is not centred over a gradient blob: the composition is a real rendered mountain with the type behind the peak.
- No eyebrow above every heading; labels only where they carry data (units, doses).
- Changed the first palette idea (frosted glass cards) to flat white surfaces: glassmorphism everywhere was the generic answer.

## Imagery
- The mountain is rendered, not photographed: a heightfield of ridged noise with a main peak, lit by a low sun, snow above a noisy snowline and on gentle slopes, haze with distance. Script: scripts/render-mountain.py.
- Three layers (far ridge, massif, snowfield) give real parallax depth.
- Pens and vials are the owner's product photos with the white background removed (scripts/cutout-pen.py).

## Idle state
The hero and product scene keep moving at rest: snow falls and the pen hovers. Other pages are still at rest by decision; their hovers carry the motion.
