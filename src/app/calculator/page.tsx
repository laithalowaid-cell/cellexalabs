import type { Metadata } from "next";
import Link from "next/link";
import ReconstitutionCalculator from "@/components/ReconstitutionCalculator";

export const metadata: Metadata = {
  title: "Dosing Calculator",
  description:
    "Work out peptide concentration, syringe draw volume, and pen clicks per dose. For laboratory reference only.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow text-rosegold-deep">Research Tools</p>
      <h1 className="mt-2 font-display text-4xl text-plum-deep sm:text-5xl">
        Dosing Calculator
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Two ways to work out a dose. For a <strong className="font-medium text-plum-deep">vial</strong>,
        reconstitute the lyophilised powder and find where the draw lands on an insulin
        syringe. For a <strong className="font-medium text-plum-deep">pen</strong>, find how many
        clicks to dial. Switch modes below.
      </p>

      <div className="mt-10">
        <ReconstitutionCalculator />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="surface-card mt-8 p-6">
          <h2 className="mb-3 text-base font-semibold text-plum-deep">Vials — how it works</h2>
          <ol className="space-y-3 text-sm leading-relaxed text-ink-soft">
            <li>
              <strong className="font-medium text-plum-deep">1. Concentration.</strong> The
              peptide mass divided by the volume of bacteriostatic water added. A 10 mg vial
              reconstituted with 2 mL gives 5 mg/mL.
            </li>
            <li>
              <strong className="font-medium text-plum-deep">2. Draw volume.</strong> The
              target dose divided by that concentration. At 5 mg/mL, a 250 mcg dose needs
              0.05 mL.
            </li>
            <li>
              <strong className="font-medium text-plum-deep">3. Syringe units.</strong> A
              U-100 syringe is marked so 100 units = 1 mL, so 0.05 mL is 5 units.
            </li>
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-ink-soft">
            Changing the water volume does not change how much peptide you have — only how
            dilute it is, and therefore how many units you draw.
          </p>
        </div>

        <div className="surface-card mt-8 p-6">
          <h2 className="mb-3 text-base font-semibold text-plum-deep">Pens — how it works</h2>
          <ol className="space-y-3 text-sm leading-relaxed text-ink-soft">
            <li>
              <strong className="font-medium text-plum-deep">1. Volume per click.</strong> Our
              pens hold 2.4 mL delivered over 240 clicks, so one click is 0.01 mL.
            </li>
            <li>
              <strong className="font-medium text-plum-deep">2. Peptide per click.</strong> The
              concentration multiplied by that volume. A 10 mg pen is 4.17 mg/mL, so each
              click carries about 41.7 mcg.
            </li>
            <li>
              <strong className="font-medium text-plum-deep">3. Clicks to dial.</strong> The
              target dose divided by the amount per click — a 250 mcg dose is 6 clicks.
            </li>
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-ink-soft">
            One click delivers 0.01 mL — the same volume as one unit on a U-100 syringe, so
            clicks and units line up at the same concentration.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-ink-soft/70">
        <Link href="/compliance" className="underline-offset-4 hover:text-plum hover:underline">
          Research Use Only — see our compliance policy
        </Link>
      </p>
    </div>
  );
}
