"use client";

import { useMemo, useState } from "react";

/**
 * Dosing calculator for research peptides, in two modes.
 *
 * Vial — reconstitute a lyophilised powder, then draw on a U-100 syringe:
 *   concentration (mcg/mL) = (peptide mg × 1000) / diluent mL
 *   draw volume   (mL)     = target dose mcg / concentration
 *   insulin units (U-100)  = draw volume mL × 100
 *
 * Pen — a pre-filled cartridge dialled in clicks:
 *   mL per click   = pen volume mL / clicks per pen
 *   mcg per click  = concentration mcg/mL × mL per click
 *   clicks needed  = target dose mcg / mcg per click
 *
 * Every input carries its own unit and is normalised to a base unit (mg for
 * peptide mass, mL for volume, mcg for dose) before any maths.
 *
 * `compact` renders the inline variant used on a product page.
 */

const MASS_UNITS = { mg: 1, mcg: 0.001 } as const; // -> mg
const VOLUME_UNITS = { mL: 1, cc: 1 } as const; //    -> mL (1 cc == 1 mL)
const DOSE_UNITS = { mcg: 1, mg: 1000 } as const; //  -> mcg

/** Stock pen cartridge: 2.4 mL delivered over 240 clicks (1 click = 0.01 mL). */
const PEN_VOLUME_ML = 2.4;
const PEN_CLICKS = 240;

type MassUnit = keyof typeof MASS_UNITS;
type VolumeUnit = keyof typeof VOLUME_UNITS;
type DoseUnit = keyof typeof DOSE_UNITS;
type Mode = "vial" | "pen";

/** Segmented unit switch — sits in the label row, clear of the input. */
function UnitSwitch<T extends string>({
  units,
  value,
  onChange,
  label,
}: {
  units: readonly T[];
  value: T;
  onChange: (u: T) => void;
  label: string;
}) {
  return (
    <span className="unit-switch" role="group" aria-label={label}>
      {units.map((u) => (
        <button key={u} type="button" aria-pressed={value === u} onClick={() => onChange(u)}>
          {u}
        </button>
      ))}
    </span>
  );
}

export default function ReconstitutionCalculator({
  defaultMg,
  defaultMode = "vial",
  compact = false,
}: {
  defaultMg?: number;
  defaultMode?: Mode;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);

  const [mass, setMass] = useState(String(defaultMg ?? 10));
  const [massUnit, setMassUnit] = useState<MassUnit>("mg");
  const [dose, setDose] = useState("250");
  const [doseUnit, setDoseUnit] = useState<DoseUnit>("mcg");

  // Vial-only
  const [vol, setVol] = useState("2");
  const [volUnit, setVolUnit] = useState<VolumeUnit>("mL");

  // Pen-only
  const [penVol, setPenVol] = useState(String(PEN_VOLUME_ML));
  const [penVolUnit, setPenVolUnit] = useState<VolumeUnit>("mL");
  const [clicks, setClicks] = useState(String(PEN_CLICKS));

  const r = useMemo(() => {
    const mg = parseFloat(mass) * MASS_UNITS[massUnit];
    const mcg = parseFloat(dose) * DOSE_UNITS[doseUnit];
    if (!(mg > 0) || !(mcg > 0)) return null;

    if (mode === "pen") {
      const mL = parseFloat(penVol) * VOLUME_UNITS[penVolUnit];
      const totalClicks = parseFloat(clicks);
      if (!(mL > 0) || !(totalClicks > 0)) return null;

      const concMcgPerMl = (mg * 1000) / mL;
      const mlPerClick = mL / totalClicks;
      const mcgPerClick = concMcgPerMl * mlPerClick;
      const clicksNeeded = mcg / mcgPerClick;

      return {
        mode: "pen" as const,
        headline: clicksNeeded,
        concMgPerMl: mg / mL,
        mcgPerClick,
        mlPerClick,
        doses: Math.floor((mg * 1000) / mcg),
        scaleMax: totalClicks,
        overfill: clicksNeeded > totalClicks,
        tiny: clicksNeeded < 1,
      };
    }

    const mL = parseFloat(vol) * VOLUME_UNITS[volUnit];
    if (!(mL > 0)) return null;

    const concMcgPerMl = (mg * 1000) / mL;
    const drawMl = mcg / concMcgPerMl;
    const units = drawMl * 100;

    return {
      mode: "vial" as const,
      headline: units,
      concMgPerMl: mg / mL,
      drawMl,
      doses: Math.floor((mg * 1000) / mcg),
      scaleMax: 100,
      overfill: units > 100,
      tiny: units < 2,
    };
  }, [mode, mass, massUnit, vol, volUnit, dose, doseUnit, penVol, penVolUnit, clicks]);

  /** Label row + unit switch above a spinner-free numeric input. */
  const field = <T extends string>(
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    units: readonly T[] | null,
    unit?: T,
    setUnit?: (u: T) => void
  ) => (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-ink-soft">
          {label}
        </label>
        {units && units.length > 1 && unit && setUnit ? (
          <UnitSwitch units={units} value={unit} onChange={setUnit} label={`${label} unit`} />
        ) : unit ? (
          <span className="text-[0.68rem] font-semibold text-ink-soft">{unit}</span>
        ) : null}
      </div>
      <input
        id={id}
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(e) => set(e.target.value)}
        className="input input-number"
      />
    </div>
  );

  const isPen = mode === "pen";

  return (
    <div className={compact ? "" : "surface-card p-6 sm:p-8"}>
      {/* Mode switch */}
      <div className="mb-5 flex items-center gap-2">
        {(
          [
            ["vial", "Vial — reconstitute"],
            ["pen", "Pen — clicks"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              mode === m
                ? "border-rosegold bg-blush text-plum"
                : "border-line text-ink-soft hover:border-rosegold-soft hover:text-plum"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {field(
          "rc-mass",
          isPen ? "Peptide in pen" : "Peptide in vial",
          mass,
          setMass,
          Object.keys(MASS_UNITS) as MassUnit[],
          massUnit,
          setMassUnit
        )}
        {isPen
          ? field(
              "rc-penvol",
              "Pen volume",
              penVol,
              setPenVol,
              Object.keys(VOLUME_UNITS) as VolumeUnit[],
              penVolUnit,
              setPenVolUnit
            )
          : field(
              "rc-vol",
              "Bacteriostatic water",
              vol,
              setVol,
              Object.keys(VOLUME_UNITS) as VolumeUnit[],
              volUnit,
              setVolUnit
            )}
        {field(
          "rc-dose",
          "Target dose",
          dose,
          setDose,
          Object.keys(DOSE_UNITS) as DoseUnit[],
          doseUnit,
          setDoseUnit
        )}
      </div>

      {isPen && (
        <div className="mt-5 sm:max-w-[calc(33.333%-0.833rem)]">
          {field("rc-clicks", "Clicks per pen", clicks, setClicks, null)}
        </div>
      )}

      {r ? (
        <div className="mt-6 rounded-card bg-blush p-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-4xl font-semibold tabular-nums leading-none text-plum">
              {r.mode === "pen" ? r.headline.toFixed(1) : r.headline.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-plum-deep">
              {r.mode === "pen" ? "clicks on the pen dial" : "units on a U-100 insulin syringe"}
            </span>
          </div>

          {/* Where that dose sits across the full pen / syringe */}
          <div className="mt-4">
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-rosegold-deep transition-[width] duration-200"
                style={{ width: `${Math.min(100, (r.headline / r.scaleMax) * 100)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[0.62rem] tabular-nums text-ink-soft">
              <span>0</span>
              <span>{Math.round(r.scaleMax * 0.25)}</span>
              <span>{Math.round(r.scaleMax * 0.5)}</span>
              <span>{Math.round(r.scaleMax * 0.75)}</span>
              <span>{r.scaleMax}{r.mode === "pen" ? "" : " u"}</span>
            </div>
          </div>

          <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <div className="flex justify-between sm:block">
              <dt className="text-ink-soft">Concentration</dt>
              <dd className="font-medium tabular-nums text-ink">
                {r.concMgPerMl.toFixed(2)} mg/mL
              </dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-ink-soft">{r.mode === "pen" ? "Per click" : "Draw volume"}</dt>
              <dd className="font-medium tabular-nums text-ink">
                {r.mode === "pen"
                  ? `${r.mcgPerClick.toFixed(1)} mcg`
                  : `${r.drawMl.toFixed(3)} mL`}
              </dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-ink-soft">{r.mode === "pen" ? "Doses per pen" : "Doses per vial"}</dt>
              <dd className="font-medium tabular-nums text-ink">{r.doses}</dd>
            </div>
          </dl>

          {r.overfill && (
            <p className="mt-4 rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-plum-deep">
              {r.mode === "pen" ? (
                <>
                  That dose needs{" "}
                  <strong className="font-semibold">{r.headline.toFixed(0)} clicks</strong>, more
                  than the whole pen holds. Check the peptide amount and target dose.
                </>
              ) : (
                <>
                  That draw is{" "}
                  <strong className="font-semibold">{r.headline.toFixed(0)} units</strong>, more
                  than a 1 mL U-100 syringe holds. Use less bacteriostatic water to concentrate
                  the solution, or split the dose.
                </>
              )}
            </p>
          )}
          {r.tiny && !r.overfill && (
            <p className="mt-4 rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-plum-deep">
              {r.mode === "pen"
                ? "That dose is under a single click, so the pen dial cannot measure it accurately."
                : "Under 2 units is difficult to measure accurately. Adding more bacteriostatic water will give a larger, easier-to-read draw."}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 rounded-card bg-blush p-5 text-sm text-ink-soft">
          Enter a peptide amount, {isPen ? "pen volume" : "diluent volume"} and target dose to see
          the result.
        </p>
      )}

      {!compact && (
        <div className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-ink-soft">
          <p>
            {isPen
              ? `Our pens hold ${PEN_VOLUME_ML} mL delivered over ${PEN_CLICKS} clicks, so one click is 0.01 mL — the same volume as one unit on a U-100 insulin syringe. Adjust the fields above if your pen differs.`
              : "A U-100 insulin syringe is graduated so that 100 units = 1 mL (1 cc)."}{" "}
            Figures are rounded for display; the underlying calculation is unrounded.
          </p>
          <p className="mt-2">
            Research use only — not for human or veterinary use. This tool does not constitute
            dosing guidance.
          </p>
        </div>
      )}
    </div>
  );
}
