"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { usePage } from "@/engine/next";
import { prefersReducedMotion } from "@/engine";

// Real pen facts, the same numbers the dosing calculator uses.
const PARTS = [
  {
    key: "dial",
    title: "Dial cap",
    body: "240 clicks per pen. Each click is 0.01 mL, so the dose is counted, not judged by eye.",
    data: "1 click = 0.01 mL",
  },
  {
    key: "label",
    title: "Labelled dose",
    body: "The amount of peptide is printed on the pen. Every batch is third-party tested to a minimum 99% purity.",
    data: "≥ 99% purity",
  },
  {
    key: "barrel",
    title: "Pre-filled barrel",
    body: "2.4 mL, already reconstituted. No mixing, no drawing up, no syringe to prepare.",
    data: "2.4 mL cartridge",
  },
];

/**
 * A pinned close-up of one pen. As you scroll the pen glides past, right end first, and three
 * callouts explain the parts. A click counter runs 000 to 240 alongside.
 */
export default function PenAnatomy({ image, name }: { image: string; name: string }) {
  const root = useRef<HTMLElement>(null);

  usePage(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    const counter = q("[data-clicks]")[0] as HTMLElement;
    const parts = q("[data-part]");
    const ticks = { v: 0 };

    gsap.set(parts, { autoAlpha: 0, y: 30 });
    gsap.set(parts[0], { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
    });
    tl.fromTo(q("[data-anatomy-pen]"), { xPercent: -52 }, { xPercent: 4, duration: 3 }, 0)
      .to(ticks, { v: 240, duration: 3, onUpdate: () => (counter.textContent = String(Math.round(ticks.v)).padStart(3, "0")) }, 0)
      .to(q("[data-progress]"), { scaleX: 1, duration: 3 }, 0)
      .to(parts[0], { autoAlpha: 0, y: -30, duration: 0.25 }, 0.85)
      .to(parts[1], { autoAlpha: 1, y: 0, duration: 0.25 }, 1.05)
      .to(parts[1], { autoAlpha: 0, y: -30, duration: 0.25 }, 1.85)
      .to(parts[2], { autoAlpha: 1, y: 0, duration: 0.25 }, 2.05);
  });

  return (
    <section ref={root} className="anatomy relative" aria-labelledby="anatomy-title">
      <div className="anatomy__stage">
        <div className="anatomy__head">
          <h2 id="anatomy-title" className="display-xl text-[clamp(2.4rem,7vw,6.5rem)] text-plum-deep" data-split="lines">
            Anatomy of a pen
          </h2>
          <p className="anatomy__counter font-data" aria-hidden="true">
            <span data-clicks>000</span>
            <span className="text-ink-soft"> / 240 clicks</span>
          </p>
        </div>

        <div className="anatomy__track" aria-hidden="true">
          <div data-anatomy-pen className="anatomy__pen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" width={1200} height={160} loading="lazy" />
          </div>
        </div>

        <ol className="anatomy__parts" aria-label={`Parts of the ${name} pen`}>
          {PARTS.map((p) => (
            <li key={p.key} data-part className="anatomy__part">
              <p className="font-data text-xs uppercase tracking-[0.16em] text-rosegold-deep">{p.data}</p>
              <h3 className="font-display mt-2 text-3xl font-semibold text-plum-deep sm:text-4xl">{p.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-ink">{p.body}</p>
            </li>
          ))}
        </ol>

        <div className="anatomy__progress" aria-hidden="true">
          <span data-progress />
        </div>
      </div>
    </section>
  );
}
