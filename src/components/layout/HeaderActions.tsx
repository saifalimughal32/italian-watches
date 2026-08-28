"use client";

import Link from "next/link";
import { useState } from "react";
import { CartBadge } from "@/components/cart/CartBadge";
import { WishlistBadge } from "@/components/wishlist/WishlistBadge";

const primaryNav = [
  { label: "New & Featured", href: "/collections/new-arrivals" },
  { label: "Brands", href: "/brands" },
  { label: "Men", href: "/collections/mens-watches" },
  { label: "Women", href: "/collections/womens-watches" },
  { label: "Luxury", href: "/collections/luxury-watches" },
  { label: "Premium", href: "/collections/premium-watches" },
  { label: "All Watches", href: "/collections/all" },
];

export function HeaderActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 md:gap-4">
        <form action="/search" className="search-pill hidden md:flex">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mr-2 opacity-50">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input name="q" placeholder="Search" aria-label="Search" />
        </form>
        <Link href="/search" className="btn-icon-circular md:hidden" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </Link>
        <WishlistBadge />
        <CartBadge />
        <button
          type="button"
          className="btn-icon-circular lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-0 h-full w-[min(100%,320px)] bg-[var(--color-canvas)] p-6 overflow-y-auto"
            style={{ borderLeft: "1px solid var(--color-hairline)" }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="type-body-strong">Menu</span>
              <button type="button" className="btn-icon-circular" aria-label="Close" onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="type-body-strong"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
