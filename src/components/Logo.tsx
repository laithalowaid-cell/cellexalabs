/**
 * Cellexa Labs logo.
 *
 * The mark is an open molecular ring that reads as a "C": a hexagon (the ring of a peptide's
 * aromatic residue, with its inner bond) left open on one side, ending in two glacier-blue nodes,
 * the two ends of a peptide chain. Drawn as inline SVG, so it is sharp at every size.
 */

const RING = "M79.18 32 L48 14 L16.82 32 L16.82 68 L48 86 L79.18 68";
const BOND = "M28.08 42.5 L28.08 57.5";

export function LogoMark({
  size = 32,
  className,
  inverse = false,
  title,
}: {
  size?: number;
  className?: string;
  /** White ring for dark backgrounds. */
  inverse?: boolean;
  title?: string;
}) {
  const ink = inverse ? "#ffffff" : "var(--color-plum-deep)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="6 6 88 88"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={RING} fill="none" stroke={ink} strokeWidth={8.5} strokeLinejoin="round" strokeLinecap="round" />
      <path d={BOND} stroke={ink} strokeWidth={5.5} strokeLinecap="round" />
      <circle cx={79.18} cy={32} r={8.2} fill="var(--color-rosegold-deep)" />
      <circle cx={79.18} cy={68} r={8.2} fill="var(--color-rosegold-deep)" />
    </svg>
  );
}

/** Kept for older imports: the small decorative mark. */
export function DnaMark({ className, size = 30 }: { className?: string; size?: number }) {
  return <LogoMark size={size} className={className} />;
}

/** Horizontal lockup for the header and footer: mark + CELLEXA + LABS. `size` is the wordmark height. */
export function Logo({ size = 24, inverse = false }: { size?: number; inverse?: boolean }) {
  return (
    <span className="logo-lockup" style={{ fontSize: size }}>
      <LogoMark size={size * 1.55} inverse={inverse} />
      <span className={`logo-lockup__word ${inverse ? "text-white" : "text-plum-deep"}`}>
        CELLEXA
        <span className="logo-lockup__labs">LABS</span>
      </span>
      <span className="sr-only">Cellexa Labs</span>
    </span>
  );
}

/** Stacked wordmark (kept for older imports). */
export function Wordmark({ className = "" }: { className?: string; tagline?: boolean }) {
  return (
    <span className={`logo-lockup ${className}`}>
      <span className="logo-lockup__word text-plum-deep">
        CELLEXA<span className="logo-lockup__labs">LABS</span>
      </span>
    </span>
  );
}
