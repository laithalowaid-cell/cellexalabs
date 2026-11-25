/**
 * Cellexa Labs logo: the original "CL" monogram with the six-node molecule and the
 * CELLEXA / LABS wordmark, redrawn as crisp vector artwork (public/logo/*.svg).
 * Regenerate the files with scripts/build-logo.py.
 */

const LOCKUP_RATIO = 831 / 200; // width / height of cellexa-logo.svg
const MARK_RATIO = 520 / 528; // width / height of cellexa-mark.svg

/** The "CL + molecule" monogram on its own. */
export function LogoMark({
  size = 32,
  className,
  inverse = false,
}: {
  size?: number;
  className?: string;
  inverse?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={inverse ? "/logo/cellexa-mark-white.svg" : "/logo/cellexa-mark.svg"}
      alt=""
      aria-hidden="true"
      width={Math.round(size * MARK_RATIO)}
      height={size}
      className={className}
    />
  );
}

/** Kept for older imports: the small decorative mark. */
export function DnaMark({ className, size = 30 }: { className?: string; size?: number }) {
  return <LogoMark size={size} className={className} />;
}

/** Horizontal lockup for the header and footer. `size` ≈ the old text size; the logo renders ~2.3× that tall. */
export function Logo({ size = 24, inverse = false }: { size?: number; inverse?: boolean }) {
  const h = Math.round(size * 2.3);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={inverse ? "/logo/cellexa-logo-white.svg" : "/logo/cellexa-logo.svg"}
      alt="Cellexa Labs"
      width={Math.round(h * LOCKUP_RATIO)}
      height={h}
      className="block h-auto max-w-full"
      style={{ height: h, width: "auto" }}
    />
  );
}

/** Wordmark (kept for older imports). */
export function Wordmark({ className = "" }: { className?: string; tagline?: boolean }) {
  return (
    <span className={className}>
      <Logo size={20} />
    </span>
  );
}
