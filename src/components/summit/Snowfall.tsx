"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { usePage } from "@/engine/next";
import { isMobile, onScroll, prefersReducedMotion } from "@/engine";

/**
 * Falling snow on a canvas. Runs on the GSAP ticker (the site's one clock), pauses when off screen,
 * leans with scroll velocity, and is skipped entirely under reduced motion.
 */
export default function Snowfall({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  usePage(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    type Flake = { x: number; y: number; r: number; s: number; d: number; o: number };
    let flakes: Flake[] = [];

    const make = (anyY: boolean): Flake => ({
      x: Math.random() * w,
      y: anyY ? Math.random() * h : -10,
      r: 0.6 + Math.random() ** 2 * 2.6,
      s: 0.25 + Math.random() * 0.9,
      d: Math.random() * Math.PI * 2,
      o: 0.45 + Math.random() * 0.5,
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(((w * h) / (isMobile() ? 9000 : 8000)) * density);
      flakes = Array.from({ length: Math.min(n, 260) }, () => make(true));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let wind = 0;
    const offScroll = onScroll(({ velocity }) => {
      wind = gsap.utils.clamp(-3, 3, velocity * 0.08);
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let t = 0;
    const tick = (_time: number, delta: number) => {
      if (!visible) return;
      const k = Math.min(delta, 50) / 16.67;
      t += 0.01 * k;
      wind *= 0.96;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      for (const f of flakes) {
        f.y += (f.s + f.r * 0.18) * k;
        f.x += (Math.sin(t + f.d) * 0.35 + wind * f.r * 0.25) * k;
        if (f.y > h + 6) Object.assign(f, make(false));
        if (f.x > w + 6) f.x = -6;
        if (f.x < -6) f.x = w + 6;
        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      offScroll();
    };
  });

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
