import React from "react";

/** Cool porcelain glass tones, matching the Cellexa palette. */
const GLASS = "#f5f7fb";
const GLASS_LINE = "#d9e0ec";
const GLASS_EDGE = "#aab4c6";

/** Minimal glass-vial / pen thumbnail with colored cap. */
export function VialThumb({
  cap,
  form = "pen",
  size = 48,
}: {
  cap: string;
  form?: string;
  size?: number;
}) {
  if (form === "vial") {
    return (
      <svg width={size} height={size} viewBox="14 3 20 42" fill="none" aria-hidden>
        <rect x="17" y="6" width="14" height="6" rx="2" fill={cap} />
        <rect x="18.5" y="11" width="11" height="4" fill={GLASS_EDGE} />
        <path
          d="M17 15h14l-1 24a3 3 0 0 1-3 2.8h-3A3 3 0 0 1 18 39L17 15Z"
          fill={GLASS}
          stroke={GLASS_LINE}
          strokeWidth="1"
        />
        <rect x="20" y="26" width="8" height="9" rx="1.5" fill="#fff" stroke={GLASS_LINE} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="7 15 34 19" fill="none" aria-hidden>
      <rect x="9" y="20" width="30" height="9" rx="4.5" fill={GLASS} stroke={GLASS_LINE} />
      <rect x="33" y="21.5" width="7" height="6" rx="3" fill={cap} />
      <rect x="13" y="22.5" width="14" height="4" rx="2" fill="#fff" stroke={GLASS_LINE} />
      <circle cx="11.5" cy="24.5" r="1.4" fill={GLASS_EDGE} />
    </svg>
  );
}
