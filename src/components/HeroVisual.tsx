import { DnaMark } from "./Logo";
import { ShieldIcon, FlaskIcon, AwardIcon, PenIcon } from "./icons";

const BADGES = [
  { icon: ShieldIcon, label: "99%+ Verified Purity" },
  { icon: FlaskIcon, label: "3rd-Party Lab Tested" },
  { icon: PenIcon, label: "Pens & Vials" },
  { icon: AwardIcon, label: "Fast UAE Delivery" },
];

/** Abstract branded panel for the hero — purely decorative, no product photography. */
export default function HeroVisual() {
  return (
    <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-10 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-blush via-white to-blush-deep px-8 py-12 sm:px-12">
      {/* soft glow */}
      <div
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(198,161,78,0.45), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(27,36,71,0.28), transparent 70%)" }}
      />

      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-line bg-white/80 shadow-xl backdrop-blur">
        <DnaMark size={56} />
      </div>

      <div className="relative grid w-full max-w-sm grid-cols-2 gap-3">
        {BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-2xl border border-line bg-white/70 px-4 py-3.5 shadow-sm backdrop-blur"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush text-rosegold-deep">
              <Icon width={17} height={17} />
            </span>
            <span className="text-xs font-semibold leading-tight text-ink">{label}</span>
          </div>
        ))}
      </div>

      <div className="relative lux-rule">
        <span className="eyebrow text-rosegold-deep">Cellexa Labs · UAE</span>
      </div>
    </div>
  );
}
