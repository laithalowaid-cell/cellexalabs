import { ShieldIcon, FlaskIcon, AwardIcon, PenIcon } from "./icons";

const ITEMS = [
  { icon: ShieldIcon, title: "Premium Quality", sub: "Third-Party Tested" },
  { icon: FlaskIcon, title: "Lab Verified", sub: "Minimum 99% Purity" },
  { icon: AwardIcon, title: "Research Grade", sub: "Sterile Lyophilised Form" },
  { icon: PenIcon, title: "Fast UAE Delivery", sub: "Discreet Packaging" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-2 sm:px-6 md:grid-cols-4 lg:px-8">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 px-3 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush text-rosegold-deep">
              <Icon width={20} height={20} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-ink">{title}</span>
              <span className="text-[0.72rem] text-ink-soft">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
