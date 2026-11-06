"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { DnaMark } from "./Logo";

export default function AgeGate() {
  const { verified, verify } = useStore();
  const [acknowledged, setAcknowledged] = useState(false);

  if (verified) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ animation: "scrim-in 0.3s ease both" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
    >
      {/* Scrim */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(44, 22, 38, 0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />
      {/* Card */}
      <div
        className="relative w-full max-w-md surface-card px-8 py-10 text-center shadow-2xl"
        style={{ animation: "pop-in 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="mb-5 flex justify-center">
          <DnaMark size={34} />
        </div>
        <div className="eyebrow text-rosegold-deep">Verification Required</div>
        <h2
          id="agegate-title"
          className="font-display mt-3 text-3xl font-medium text-plum-deep"
        >
          Confirm your access
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          You must be at least <strong className="text-ink">21 years of age</strong>, or the age
          of majority in your jurisdiction, and a qualified researcher purchasing solely for
          in vitro laboratory research use. Read the full{" "}
          <Link
            href="/compliance"
            target="_blank"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            Compliance &amp; Research-Use-Only Acknowledgement
          </Link>
          .
        </p>

        <label className="mt-6 flex items-start gap-3 text-left text-xs leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-rosegold)]"
          />
          <span>
            I confirm I am 21 or older, a qualified researcher acting in a research capacity, and
            I have read and agree to the{" "}
            <Link href="/terms" target="_blank" className="text-rosegold-deep underline-offset-4 hover:underline">
              Terms
            </Link>
            ,{" "}
            <Link href="/privacy-policy" target="_blank" className="text-rosegold-deep underline-offset-4 hover:underline">
              Privacy Notice
            </Link>
            , and{" "}
            <Link href="/compliance" target="_blank" className="text-rosegold-deep underline-offset-4 hover:underline">
              Compliance &amp; Research-Use-Only Policy
            </Link>
            , including that I will not administer, ingest, inject, or otherwise introduce any
            product into the body of a human or animal.
          </span>
        </label>

        <button
          onClick={verify}
          disabled={!acknowledged}
          className="btn-primary mt-6 w-full text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enter Storefront
        </button>
        <a
          href="https://www.google.com"
          className="mt-4 inline-block text-xs font-medium text-ink-soft underline-offset-4 hover:text-plum hover:underline"
        >
          Exit
        </a>

        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft/70">
          Cellexa Labs · Research Use Only
        </p>
      </div>
    </div>
  );
}
