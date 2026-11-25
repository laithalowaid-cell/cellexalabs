"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePage } from "@/engine/next";
import { ease, isTouch, prefersReducedMotion } from "@/engine";
import { useStore } from "@/lib/store";
import { ArrowRight } from "../icons";
import Snowfall from "./Snowfall";

gsap.registerPlugin(ScrollTrigger);

export interface HeroPen {
  id: string;
  name: string;
  dose: string;
  price: number;
  image: string;
  count: number;
}

/**
 * The signature moment. A pinned stage: sky, far ridge, the CELLEXA wordmark, the massif,
 * the snowfield and a pen, each on its own depth. Scrolling climbs the mountain: nearer layers
 * move faster, the pen glides across the snow, and snow keeps falling while you read.
 */
export default function SummitHero({ pen }: { pen: HeroPen }) {
  const { fmt } = useStore();
  const root = useRef<HTMLElement>(null);

  usePage(({ intro }) => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    if (prefersReducedMotion()) return;

    // Intro: the range rises out of the snow, the pen glides in from the right.
    intro.add(
      gsap
        .timeline()
        .from(q("[data-layer='far']"), { yPercent: 6, autoAlpha: 0, duration: 1.8, ease: ease.out }, 0)
        .from(q("[data-layer='massif']"), { yPercent: 10, duration: 1.8, ease: ease.out }, 0.05)
        .from(q("[data-layer='snow']"), { yPercent: 12, duration: 1.6, ease: ease.out }, 0.1)
        .from(q("[data-wordmark] span"), { yPercent: 105, duration: 1.4, stagger: 0.05, ease: ease.out }, 0.15)
        .from(q("[data-pen-glide]"), { xPercent: 70, autoAlpha: 0, duration: 2, ease: ease.out }, 0.35)
        .from(q("[data-hero-meta] > *"), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.06, ease: ease.out }, 0.9),
      0,
    );

    // Idle: the pen hovers over the snow.
    gsap.to(q("[data-pen-float]"), { y: -8, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // Scroll: the climb.
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
    });
    tl.to(q("[data-sky]"), { "--sky-top": "#123a7c", "--sky-mid": "#3f78c6" }, 0)
      .to(q("[data-layer='far']"), { yPercent: 5, scale: 1.03 }, 0)
      .to(q("[data-wordmark]"), { yPercent: 28 }, 0)
      .to(q("[data-layer='massif']"), { yPercent: 12, scale: 1.08 }, 0)
      .to(q("[data-layer='snow']"), { yPercent: 34 }, 0)
      .to(q("[data-pen-glide]"), { xPercent: -46, yPercent: -40, rotate: -6, scale: 0.86 }, 0)
      .to(q("[data-hero-copy]"), { y: -80, autoAlpha: 0 }, 0)
      .to(q("[data-hero-meta]"), { y: -40, autoAlpha: 0 }, 0)
      .to(q("[data-hero-next]"), { autoAlpha: 1, y: 0 }, 0.55);

    // Pointer: the light shifts a little before anyone scrolls.
    if (!isTouch()) {
      const layers = [
        [q("[data-layer='far']")[0], 6],
        [q("[data-layer='massif']")[0], 14],
        [q("[data-pen-float]")[0], 26],
      ] as const;
      const movers = layers.map(([node, amt]) => ({ fn: gsap.quickTo(node, "x", { duration: 1.2, ease: ease.soft }), amt }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5;
        movers.forEach(({ fn, amt }) => fn(-nx * amt));
      };
      addEventListener("pointermove", onMove, { passive: true });
      return () => removeEventListener("pointermove", onMove);
    }
  });

  return (
    <section ref={root} className="summit relative" aria-labelledby="summit-title">
      <div className="summit__stage">
        {/* Sky */}
        <div data-sky className="summit__sky absolute inset-0" aria-hidden="true" />

        {/* Far ridge */}
        <picture data-layer="far" className="summit__layer">
          <source media="(max-width: 767px)" srcSet="/mountain/far-sm.webp" />
          <img src="/mountain/far.webp" alt="" width={2400} height={1500} />
        </picture>

        {/* Wordmark sits behind the massif so the peak cuts through it */}
        <p data-wordmark className="summit__wordmark display-xl" aria-hidden="true">
          {"CELLEXA".split("").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </p>

        {/* Massif */}
        <picture data-layer="massif" className="summit__layer">
          <source media="(max-width: 767px)" srcSet="/mountain/massif-sm.webp" />
          <img src="/mountain/massif.webp" alt="" width={2400} height={1500} fetchPriority="high" />
        </picture>

        {/* Snowfield */}
        <picture data-layer="snow" className="summit__layer">
          <source media="(max-width: 767px)" srcSet="/mountain/snow-sm.webp" />
          <img src="/mountain/snow.webp" alt="" width={2400} height={1500} />
        </picture>
        <div className="summit__ground" aria-hidden="true" />

        {/* The pen */}
        <div data-pen-glide className="summit__pen">
          <Link href={`/shop/${pen.id}`} className="group block" aria-label={`${pen.name} ${pen.dose} pen`}>
            <div data-pen-float className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pen.image}
                alt={`${pen.name} ${pen.dose} pre-filled pen`}
                className="relative z-10 w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3"
                width={1200}
                height={160}
              />
              <span className="summit__shadow" aria-hidden="true" />
            </div>
          </Link>
        </div>

        <Snowfall className="z-20" />

        {/* Copy */}
        <div className="summit__copy">
          <div data-hero-copy className="max-w-xl">
            <h1 id="summit-title" className="font-display text-[2.15rem] font-semibold leading-[1.02] text-plum-deep sm:text-5xl lg:text-[3.6rem]">
              Research peptides, pre&#8209;filled in a pen.
            </h1>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink sm:text-base">
              No mixing and no drawing up. Dial the dose in clicks. Every batch is third-party tested to a
              minimum 99% purity and delivered across the UAE.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop?form=pen" className="btn-primary">
                Shop {pen.count} pens
                <ArrowRight width={17} height={17} />
              </Link>
              <Link href="/shop" className="btn-ghost">
                Full catalog
              </Link>
            </div>
          </div>

          <dl data-hero-meta className="summit__meta font-data">
            <div>
              <dt>Pen</dt>
              <dd>{pen.name}</dd>
            </div>
            <div>
              <dt>Dose</dt>
              <dd>{pen.dose}</dd>
            </div>
            <div>
              <dt>Units</dt>
              <dd>240</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>{fmt(pen.price)}</dd>
            </div>
          </dl>
        </div>

        <p data-hero-next className="summit__next font-data" aria-hidden="true">
          Keep climbing
        </p>
      </div>
    </section>
  );
}
