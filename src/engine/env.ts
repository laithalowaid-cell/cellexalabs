export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
export const isMobile = () => matchMedia("(max-width: 767px)").matches;

/** Shared easing vocabulary. Motion verb: glide like a ski across snow. */
export const ease = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
} as const;
