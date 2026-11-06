"use client";

import React, { useState, useEffect, useRef } from "react";

/** Path to the real brand artwork. Drop the official file here to use it. */
export const LOGO_SRC = "/cellexa-logo.png";
/** Path to the "C + molecule" monogram cropped out of the real artwork above. */
export const MARK_SRC = "/cellexa-mark.png";
/** Natural aspect ratio (w / h) of the cropped monogram asset. */
const MARK_ASPECT = 501 / 528;

/**
 * Cellexa Labs — the "C + molecule" monogram from the official artwork.
 * (Kept the export name `DnaMark` so existing imports across the app
 *  continue to resolve.) Used for small decorative spots. Falls back to a
 * drawn vector approximation if the image asset is ever missing.
 */
export function DnaMark({
  className,
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <DnaMarkVector className={className} size={size} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={MARK_SRC}
      alt=""
      aria-hidden
      className={className}
      style={{ height: size, width: size * MARK_ASPECT, objectFit: "contain" }}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setFailed(true);
      }}
    />
  );
}

/** Drawn vector approximation — only shown if the monogram image asset fails to load. */
function DnaMarkVector({
  className,
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Open "C" ring */}
      <path
        d="M70 24 A 30 30 0 1 0 70 72"
        stroke="var(--color-plum)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Benzene-style hexagon with bond nodes */}
      <g stroke="var(--color-plum)" strokeWidth="3.2" fill="none">
        <path d="M56 34 L68 41 L68 55 L56 62 L44 55 L44 41 Z" strokeLinejoin="round" />
        <path d="M47 43.5 L47 52.5" strokeWidth="2.4" />
        <path d="M56 34 L56 25" />
        <path d="M68 41 L76 36.5" />
        <path d="M68 55 L76 59.5" />
        <path d="M56 62 L56 71" />
        <path d="M44 55 L36 59.5" />
        <path d="M44 41 L36 36.5" />
      </g>
      <g fill="var(--color-plum)">
        <circle cx="56" cy="24" r="4" />
        <circle cx="77" cy="36" r="4" />
        <circle cx="77" cy="60" r="4" />
        <circle cx="56" cy="72" r="4" />
        <circle cx="35" cy="60" r="4" />
        <circle cx="35" cy="36" r="4" />
      </g>
    </svg>
  );
}

/** The drawn horizontal lockup — used as a fallback until the real file is present. */
function VectorLockup({ size = 26 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <DnaMark size={size * 1.5} />
      <span className="inline-flex flex-col leading-none">
        <span
          className="font-display tracking-[0.18em] text-plum"
          style={{ fontSize: size * 0.86 }}
        >
          CELLEXA
        </span>
        <span className="mt-1 flex items-center gap-1.5">
          <span className="h-px w-3 bg-rosegold" />
          <span
            className="font-serif text-plum-deep"
            style={{ fontSize: size * 0.34, letterSpacing: "0.42em" }}
          >
            LABS
          </span>
          <span className="h-px w-3 bg-rosegold" />
        </span>
      </span>
    </span>
  );
}

/** Stacked wordmark fallback. */
export function Wordmark({
  className = "",
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className="font-display tracking-[0.16em] text-plum"
        style={{ fontSize: "1.45em" }}
      >
        CELLEXA
      </span>
      {tagline && (
        <span className="mt-1.5 flex items-center gap-2">
          <span className="h-px w-5 bg-rosegold" />
          <span
            className="font-serif tracking-[0.5em] text-plum-deep"
            style={{ fontSize: "0.56em" }}
          >
            LABS
          </span>
          <span className="h-px w-5 bg-rosegold" />
        </span>
      )}
    </span>
  );
}

/**
 * Brand lockup for the header / footer.
 * Renders the official artwork at {@link LOGO_SRC} when present, and
 * gracefully falls back to the drawn vector lockup if the file is missing.
 * `size` ≈ the text size of the fallback; the image renders ~2.4× that tall.
 */
export function Logo({ size = 26 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Catch images that already failed (404) before React attached onError.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <VectorLockup size={size} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={LOGO_SRC}
      alt="Cellexa Labs"
      style={{ height: size * 2.4, width: "auto" }}
      className="w-auto object-contain"
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setFailed(true);
      }}
    />
  );
}
