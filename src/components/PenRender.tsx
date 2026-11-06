import React from "react";

function hashId(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return "p" + (h >>> 0).toString(36);
}

/**
 * Vector render of the Cellexa Labs pen:
 * white body, rose-gold ribbed dose knob (left), dose-dial window, Cellexa
 * branding, product name + dose badge, and a rose-gold metallic injector tip.
 * Fully vector + parameterized so every product gets an accurate render and
 * the dose label can update live.
 */
export function PenRender({
  name,
  dose,
  accent = "#c08a82",
  width = 540,
  className,
}: {
  name: string;
  dose?: string;
  accent?: string;
  width?: number;
  className?: string;
}) {
  // deterministic id (no hooks → safe in Server Components, stable across SSR/CSR)
  const id = hashId(`${name}|${dose ?? ""}|${accent}`);
  const VW = 540;
  const VH = 150;

  // Split long names onto two lines (break on "+")
  const long = name.length > 15;
  let line1 = name;
  let line2 = "";
  if (long && name.includes("+")) {
    const idx = name.indexOf("+");
    line1 = name.slice(0, idx).trim();
    line2 = "+ " + name.slice(idx + 1).trim();
  } else if (long) {
    const parts = name.split(" ");
    const mid = Math.ceil(parts.length / 2);
    line1 = parts.slice(0, mid).join(" ");
    line2 = parts.slice(mid).join(" ");
  }
  const nameSize = name.length > 22 ? 19 : name.length > 14 ? 21 : 24;

  return (
    <svg
      className={className}
      width={width}
      height={(width * VH) / VW}
      viewBox={`0 0 ${VW} ${VH}`}
      fill="none"
      role="img"
      aria-label={`${name} injection pen${dose ? ` ${dose}` : ""}`}
    >
      <defs>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0dca8" />
          <stop offset="28%" stopColor="#d9bd7e" />
          <stop offset="55%" stopColor="#b8862f" />
          <stop offset="78%" stopColor="#d9bd7e" />
          <stop offset="100%" stopColor="#52709f" />
        </linearGradient>
        <linearGradient id={`body-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fdfaf2" />
          <stop offset="100%" stopColor="#efe7d4" />
        </linearGradient>
        <linearGradient id={`badge-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#52709f" />
        </linearGradient>
        <linearGradient id={`tip-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0dca8" />
          <stop offset="45%" stopColor="#7a93be" />
          <stop offset="60%" stopColor="#3d5a8a" />
          <stop offset="100%" stopColor="#cdb069" />
        </linearGradient>
      </defs>

      {/* drop shadow */}
      <ellipse cx="270" cy="128" rx="220" ry="9" fill="#2b4373" opacity="0.07" />

      {/* ---- main body ---- */}
      <rect x="36" y="46" width="406" height="58" rx="29" fill={`url(#body-${id})`} stroke="#e7dade" strokeWidth="1" />
      {/* top highlight */}
      <rect x="60" y="52" width="350" height="6" rx="3" fill="#ffffff" opacity="0.85" />

      {/* ---- left rose-gold dose knob with ribs ---- */}
      <rect x="22" y="50" width="58" height="50" rx="14" fill={`url(#gold-${id})`} />
      {[30, 38, 46].map((x) => (
        <rect key={x} x={x} y="54" width="2.4" height="42" rx="1.2" fill="#9a6256" opacity="0.55" />
      ))}
      <rect x="22" y="52" width="58" height="4" rx="2" fill="#fff" opacity="0.4" />

      {/* ---- dose dial window ---- */}
      <rect x="92" y="60" width="46" height="30" rx="6" fill="#f1ebed" stroke="#dcd0d4" strokeWidth="1" />
      <rect x="96" y="64" width="38" height="22" rx="4" fill="#fbf8f9" />
      <text x="111" y="80" textAnchor="middle" fontSize="15" fontWeight="700" fill="#8a7f85" fontFamily="var(--font-sans)">0</text>
      <path d="M138 71 l7 4 -7 4 z" fill={accent} opacity="0.8" />

      {/* ---- branding: wordmark ---- */}
      <text x="168" y="74" fontSize="17" fontWeight="700" fill="#2b4373" fontFamily="var(--font-serif)" letterSpacing="0.6">
        CELLEXA
      </text>
      <text x="168" y="88" fontSize="8" fontWeight="600" fill="#52709f" fontFamily="var(--font-sans)" letterSpacing="3">
        LABS
      </text>

      {/* divider */}
      <rect x="258" y="56" width="1.4" height="40" fill="#e2d6da" />

      {/* ---- product name + dose + form ---- */}
      {line2 ? (
        <>
          <text x="272" y="68" fontSize={nameSize} fontWeight="700" fill="#2a2530" fontFamily="var(--font-sans)">{line1}</text>
          <text x="272" y={68 + nameSize + 2} fontSize={nameSize} fontWeight="700" fill="#2a2530" fontFamily="var(--font-sans)">{line2}</text>
          {dose && <DoseBadge id={id} x={272} y={68 + nameSize * 2 + 6} dose={dose} />}
          {!dose && <text x="272" y={68 + nameSize * 2 + 12} fontSize="11" fill="#8a7f85" fontFamily="var(--font-sans)">Injection Pen</text>}
        </>
      ) : (
        <>
          <text x="272" y="72" fontSize={nameSize} fontWeight="700" fill="#2a2530" fontFamily="var(--font-sans)">{name}</text>
          {dose ? <DoseBadge id={id} x={272} y={84} dose={dose} /> : null}
          <text x="272" y={dose ? 116 : 92} fontSize="11" fill="#8a7f85" fontFamily="var(--font-sans)">Injection Pen</text>
        </>
      )}

      {/* soft swoosh */}
      <path d="M392 56 q24 18 0 44" stroke={accent} strokeWidth="1.2" opacity="0.4" fill="none" />
      <path d="M384 54 q30 21 0 48" stroke={accent} strokeWidth="1" opacity="0.25" fill="none" />

      {/* ---- rose-gold injector tip ---- */}
      <path d="M438 52 q26 -2 30 23 q-4 25 -30 23 z" fill={`url(#tip-${id})`} />
      <rect x="452" y="64" width="22" height="3" fill="#fff" opacity="0.45" />
      <rect x="452" y="83" width="22" height="3" fill="#5e3c34" opacity="0.4" />
      {/* needle cover cone */}
      <path d="M468 60 q34 4 56 15 q-22 11 -56 15 z" fill={`url(#body-${id})`} stroke="#e7dade" strokeWidth="1" />
    </svg>
  );
}

function DoseBadge({ id, x, y, dose }: { id: string; x: number; y: number; dose: string }) {
  const w = Math.max(54, dose.length * 9 + 22);
  return (
    <g>
      <rect x={x} y={y - 15} width={w} height="22" rx="6" fill={`url(#badge-${id})`} />
      <text x={x + w / 2} y={y} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="var(--font-sans)">
        {dose}
      </text>
    </g>
  );
}
