"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";
import { FOCUS_META, Focus } from "@/lib/products";
import { CartIcon, ChevronDown, CloseIcon, FilterIcon } from "./icons";
import SearchBox from "./SearchBox";

const FOCUS_KEYS: Focus[] = ["weightloss", "growth", "recovery", "antiaging", "wellness"];

export default function Header() {
  const { cartCount, setCartOpen } = useStore();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo size={24} />
        </Link>

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <Link href="/shop" className="nav-link rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-plum">
            Shop All
          </Link>

          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-plum"
            >
              Categories
              <ChevronDown width={15} height={15} className={catOpen ? "rotate-180 transition" : "transition"} />
            </button>
            {catOpen && (
              <div
                className="surface-card absolute left-0 z-50 mt-2 w-72 overflow-hidden p-1.5 shadow-xl"
                style={{ animation: "pop-in 0.18s ease both" }}
              >
                {FOCUS_KEYS.map((k) => (
                  <Link
                    key={k}
                    href={`/shop?focus=${k}`}
                    onClick={() => setCatOpen(false)}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-blush"
                  >
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{ background: FOCUS_META[k].cap }}
                    />
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-ink">{FOCUS_META[k].title}</span>
                      <span className="text-[0.72rem] text-ink-soft">{FOCUS_META[k].blurb}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/bundles" className="nav-link rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-plum">
            Bundles
          </Link>
          <Link href="/calculator" className="nav-link rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-plum">
            Calculator
          </Link>
          <Link href="/affiliates" className="nav-link rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-plum">
            Affiliates
          </Link>
        </nav>

        {/* Right utilities */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-blush"
            aria-label="Open cart"
          >
            <CartIcon width={21} height={21} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-plum px-1 text-[0.65rem] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-blush lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <CloseIcon /> : <FilterIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-white px-4 py-4 lg:hidden" style={{ animation: "fade-in 0.2s ease both" }}>
          <div className="mb-3">
            <SearchBox compact />
          </div>
          <Link href="/shop" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-blush">
            Shop All
          </Link>
          <Link href="/bundles" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-blush">
            Bundle Deals
          </Link>
          <Link href="/calculator" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-blush">
            Dosing Calculator
          </Link>
          <Link href="/affiliates" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-blush">
            Affiliate Program
          </Link>
          <div className="mt-1 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-ink-soft">Categories</div>
          {FOCUS_KEYS.map((k) => (
            <Link
              key={k}
              href={`/shop?focus=${k}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-blush"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: FOCUS_META[k].cap }} />
              {FOCUS_META[k].title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
