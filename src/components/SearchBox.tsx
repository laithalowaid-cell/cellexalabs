"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { SearchIcon } from "./icons";

export default function SearchBox({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = q.trim()
    ? PRODUCTS.filter((p) =>
        (p.name + " " + (p.subtitle ?? "") + " " + p.summary)
          .toLowerCase()
          .includes(q.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <div ref={ref} className={`relative ${compact ? "w-full" : "w-full max-w-xs"}`}>
      <div className="flex items-center gap-2 rounded-full border border-line bg-mist/60 px-3.5 py-2 transition-colors focus-within:border-rosegold focus-within:bg-white">
        <SearchIcon width={16} height={16} className="text-ink-soft" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search peptides…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/70"
        />
      </div>
      {open && results.length > 0 && (
        <ul
          className="surface-card absolute left-0 right-0 z-50 mt-2 overflow-hidden p-1 shadow-lg"
          style={{ animation: "pop-in 0.18s ease both" }}
        >
          {results.map((p) => (
            <li key={p.id}>
              <Link
                href={`/shop/${p.id}`}
                onClick={() => {
                  setOpen(false);
                  setQ("");
                }}
                className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-blush"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: p.cap }}
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                  {p.subtitle && (
                    <span className="text-[0.7rem] text-ink-soft">{p.subtitle}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
