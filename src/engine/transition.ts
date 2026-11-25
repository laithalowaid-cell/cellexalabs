// White-out page transition: a snow-white panel sweeps up over the page, then lifts off the new one.
import { gsap } from "gsap";
import { ease, prefersReducedMotion } from "./env";

const curtain = () => document.getElementById("curtain") as HTMLElement;

export function playLeave() {
  const c = curtain();
  if (!c) return Promise.resolve();
  const panel = c.querySelector(".curtain__panel");
  const peak = c.querySelector(".curtain__peak");
  if (prefersReducedMotion()) return Promise.resolve(gsap.timeline().set(c, { autoAlpha: 1 }).fromTo(panel, { yPercent: 0, opacity: 0 }, { opacity: 1, duration: 0.2 }));
  return Promise.resolve(
    gsap
      .timeline()
      .set(c, { autoAlpha: 1 })
      .fromTo(panel, { yPercent: 100, opacity: 1 }, { yPercent: 0, duration: 0.75, ease: ease.inOut })
      .fromTo(peak, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: ease.out }, 0.35),
  );
}

export function playEnter() {
  const c = curtain();
  if (!c) return Promise.resolve();
  const panel = c.querySelector(".curtain__panel");
  const peak = c.querySelector(".curtain__peak");
  if (prefersReducedMotion()) return Promise.resolve(gsap.timeline().to(panel, { opacity: 0, duration: 0.2 }).set(c, { autoAlpha: 0 }));
  return Promise.resolve(
    gsap
      .timeline()
      .to(peak, { yPercent: -30, autoAlpha: 0, duration: 0.45, ease: ease.soft })
      .to(panel, { yPercent: -100, duration: 0.85, ease: ease.inOut }, 0.1)
      .set(c, { autoAlpha: 0 }),
  );
}
