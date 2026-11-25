"use client";

import Link from "next/link";
import { CSSProperties, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { ArrowRight } from "./icons";

export interface IceScene {
  id: string;
  name: string;
  subtitle?: string;
  dose: string;
  summary: string;
  purity: string;
  price: number;
  /** Transparent vial cut-out under /public/ice */
  image: string;
}

/**
 * Scroll-driven glacier showcase for the homepage.
 *
 * The section is several screens tall. A full-screen "stage" stays pinned while
 * you scroll, and scroll progress moves between scenes: the brand intro, one
 * scene per featured vial, then a closing "All compounds" line-up. A drift of
 * frost sweeps across the screen between scenes.
 */
export default function IceShowcase({
  intro,
  scenes,
}: {
  intro: IceScene;
  scenes: IceScene[];
}) {
  const { fmt } = useStore();
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vialRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // intro + product scenes + finale
  const steps = scenes.length + 2;
  const all = [intro, ...scenes];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const travel = root.offsetHeight - window.innerHeight;
      // p runs from 0 (intro) to steps - 1 (finale)
      const p = clamp(-rect.top / Math.max(travel, 1)) * (steps - 1);
      const m = reduce.matches ? 0 : 1;

      for (let i = 0; i < steps; i++) {
        const local = p - i; // 0 = this scene is centred
        const vis = clamp(1 - Math.abs(local) * 1.9);
        const t = textRefs.current[i];
        if (t) {
          t.style.opacity = String(vis);
          t.style.transform = `translate3d(0, ${-local * 60 * m}px, 0)`;
          t.style.pointerEvents = vis > 0.6 ? "auto" : "none";
          t.style.visibility = vis < 0.01 ? "hidden" : "visible";
        }
        const v = vialRefs.current[i];
        if (v) {
          v.style.opacity = String(clamp(1 - Math.abs(local) * 1.6));
          v.style.transform = `translate3d(${local * 6 * m}vw, ${-local * 28 * m}vh, 0) rotate(${
            -local * 10 * m
          }deg) scale(${1 - Math.min(Math.abs(local), 1) * 0.12 * m})`;
          v.style.visibility = Math.abs(local) > 0.9 ? "hidden" : "visible";
        }
        const d = dotRefs.current[i];
        if (d) d.dataset.active = String(Math.round(p) === i);
      }

      // Frost peaks halfway between two scenes, clears when one is centred.
      const between = Math.abs((p % 1) - 0.5) * 2; // 0 at midpoint, 1 at a scene
      const fog = p >= steps - 1 ? 0 : clamp(1 - between * 1.35);
      if (fogRef.current) {
        fogRef.current.style.opacity = String(fog * 0.95);
        fogRef.current.style.transform = `translate3d(${(p % 1) * -12 * m}%, 0, 0) scale(1.2)`;
      }
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${-p * 1.6 * m}%, ${-p * 1.2 * m}%, 0) scale(${
          1.15 + p * 0.03 * m
        })`;
        bgRef.current.style.filter = `blur(${fog * 6}px) brightness(${1 + fog * 0.25})`;
      }
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p * 4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
    };
  }, [steps]);

  const goTo = (i: number) => {
    const root = rootRef.current;
    if (!root) return;
    const travel = root.offsetHeight - window.innerHeight;
    const top = root.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (travel * i) / (steps - 1), behavior: "smooth" });
  };

  const labels = ["Intro", ...scenes.map((s) => s.name), "All"];

  return (
    <section
      ref={rootRef}
      aria-label="Featured compounds"
      className="relative"
      style={{ height: `${steps * 90 + 10}svh` }}
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden bg-[#2a6db5]">
        {/* Glacier backdrop */}
        <div
          ref={bgRef}
          aria-hidden
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: "url(/ice/glacier.jpg)", transform: "scale(1.15)" }}
        />
        {/* Frosted light veil: bright on the text side */}
        <div aria-hidden className="ice-veil absolute inset-0" />

        {/* Frost that sweeps through between scenes */}
        <div
          ref={fogRef}
          aria-hidden
          className="ice-fog pointer-events-none absolute inset-0 z-30 opacity-0 will-change-transform"
        />

        {/* ---------- Intro + product scenes ---------- */}
        {all.map((s, i) => {
          const isIntro = i === 0;
          return (
            <div key={s.id + i} className="absolute inset-0">
              {/* Vial on its ice block */}
              <div
                ref={(el) => {
                  vialRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-[4%] flex justify-center will-change-transform md:inset-x-auto md:right-[8%] md:top-[12%] md:w-[38%] lg:right-[10%]"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <VialOnIce src={s.image} alt={`${s.name} ${s.dose} vial`} size="lg" />
              </div>

              {/* Copy */}
              <div
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0 z-20 px-5 pb-24 sm:px-8 md:inset-y-0 md:flex md:w-[54%] md:items-center md:pb-0 md:pl-[6%] lg:pl-[8%]"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {isIntro ? (
                  <div className="max-w-xl">
                    <p className="eyebrow text-rosegold-deep">Premium Research Peptides · UAE</p>
                    <h1 className="font-display mt-4 text-[2.3rem] font-light leading-[1.02] text-plum-deep sm:text-6xl lg:text-7xl">
                      Research-grade peptides.
                      <br />
                      <span className="italic text-rosegold-deep">Kept pure.</span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-ink sm:mt-5 sm:text-[0.95rem]">
                      Synthesized to a minimum <strong>99% purity</strong> and independently
                      third-party tested. Pens and vials, discreetly packed and delivered fast
                      across the UAE.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
                      <Link href="/shop" className="btn-primary px-6 py-3 text-sm">
                        Shop the catalog
                        <ArrowRight width={17} height={17} />
                      </Link>
                    </div>
                    <div className="mt-8 hidden gap-8 sm:flex">
                      {[
                        ["99%+", "Verified purity"],
                        ["3rd-party", "Lab tested"],
                        ["UAE", "Fast delivery"],
                      ].map(([big, small]) => (
                        <div key={small}>
                          <p className="font-display text-2xl font-medium text-plum-deep">{big}</p>
                          <p className="text-[0.68rem] uppercase tracking-wider text-ink-soft">
                            {small}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md">
                    <p className="eyebrow text-rosegold-deep">
                      {String(i).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")} ·
                      Lyophilised vial
                    </p>
                    <h2 className="font-display mt-3 text-5xl font-light leading-none tracking-tight text-plum-deep sm:text-7xl lg:text-8xl">
                      {s.name}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-ink">{s.summary}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-soft">
                      <span>{s.dose}</span>
                      <span>{s.purity} purity</span>
                      <span>
                        From <strong className="text-plum-deep">{fmt(s.price)}</strong>
                      </span>
                    </div>
                    <Link
                      href={`/shop/${s.id}`}
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-plum-deep px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-plum"
                    >
                      View {s.name}
                      <ArrowRight width={15} height={15} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ---------- Finale: all compounds ---------- */}
        <div className="absolute inset-0">
          <div
            ref={(el) => {
              vialRefs.current[steps - 1] = el;
            }}
            className="absolute inset-x-0 bottom-[50%] flex items-end justify-center gap-1 px-2 will-change-transform sm:gap-4 md:bottom-[10%] md:left-[38%] md:right-[4%] md:gap-6"
            style={{ opacity: 0 }}
          >
            {all.map((s, i) => (
              <VialOnIce
                key={s.id}
                src={s.image}
                alt={`${s.name} vial`}
                size="sm"
                blockHeight={[70, 100, 55, 85][i % 4]}
              />
            ))}
          </div>
          <div
            ref={(el) => {
              textRefs.current[steps - 1] = el;
            }}
            className="absolute inset-x-0 bottom-0 z-20 px-5 pb-24 sm:px-8 md:inset-y-0 md:flex md:w-[40%] md:items-center md:pb-0 md:pl-[6%] lg:pl-[8%]"
            style={{ opacity: 0 }}
          >
            <div className="max-w-sm">
              <p className="eyebrow text-rosegold-deep">The full range</p>
              <h2 className="font-display mt-3 text-5xl font-light leading-none text-plum-deep sm:text-7xl">
                All compounds
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink">
                Browse the complete catalog of research peptides, in pens and vials.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/shop" className="btn-primary px-6 py-3 text-sm">
                  Shop all
                  <ArrowRight width={17} height={17} />
                </Link>
                <Link
                  href="/shop?form=vial"
                  className="inline-flex items-center rounded-full border border-plum-deep/25 bg-white/60 px-5 py-3 text-sm font-semibold text-plum-deep backdrop-blur transition hover:bg-white"
                >
                  Vials
                </Link>
                <Link
                  href="/shop?form=pen"
                  className="inline-flex items-center rounded-full border border-plum-deep/25 bg-white/60 px-5 py-3 text-sm font-semibold text-plum-deep backdrop-blur transition hover:bg-white"
                >
                  Pens
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scene dots */}
        <nav
          aria-label="Showcase scenes"
          className="absolute right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
        >
          {labels.map((label, i) => (
            <button
              key={label + i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              onClick={() => goTo(i)}
              aria-label={`Go to ${label}`}
              data-active={i === 0}
              className="group flex items-center justify-end gap-2"
            >
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition group-hover:opacity-100 group-data-[active=true]:opacity-90">
                {label}
              </span>
              <span className="h-2 w-2 rounded-full bg-white/50 ring-1 ring-white/70 transition group-data-[active=true]:scale-125 group-data-[active=true]:bg-white" />
            </button>
          ))}
        </nav>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          aria-hidden
          className="absolute bottom-5 left-1/2 z-40 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white md:flex"
        >
          Scroll
          <span className="ice-scroll-line block h-10 w-px bg-white/70" />
        </div>
      </div>
    </section>
  );
}

function VialOnIce({
  src,
  alt,
  size,
  blockHeight = 90,
}: {
  src: string;
  alt: string;
  size: "lg" | "sm";
  blockHeight?: number;
}) {
  const lg = size === "lg";
  return (
    <div className={`flex flex-col items-center ${lg ? "" : "min-w-0 flex-1"}`}>
      <div className="ice-float relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`relative w-auto object-contain drop-shadow-[0_30px_30px_rgba(8,30,70,0.35)] ${
            lg ? "h-[29svh] md:h-[52svh]" : "h-[11svh] max-w-full md:h-[24svh]"
          }`}
        />
      </div>
      <div
        className="ice-block relative -mt-[6%] h-[calc(var(--bh)*0.5)] md:h-[var(--bh)]"
        style={
          {
            width: lg ? "min(56vw, 340px)" : "100%",
            maxWidth: lg ? undefined : 190,
            "--bh": `${lg ? blockHeight * 1.2 : blockHeight}px`,
          } as CSSProperties
        }
        aria-hidden
      />
    </div>
  );
}
