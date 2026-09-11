"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/collections/all", label: "Shop", icon: "shop" },
  { href: "/search", label: "Search", icon: "search" },
  { href: "/wishlist", label: "Saved", icon: "heart" },
  { href: "/cart", label: "Bag", icon: "bag" },
];

export function MobileBottomBar() {
  const pathname = usePathname();
  const hideOnPdp = pathname?.startsWith("/products/");

  if (hideOnPdp) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      style={{
        background: "var(--color-canvas)",
        borderTop: "1px solid var(--color-hairline)",
      }}
    >
      <div className="grid grid-cols-5 h-14">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center justify-center gap-1 type-utility-xs uppercase"
          >
            <span aria-hidden="true">
              {link.icon === "home" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-10.5z" />
                </svg>
              )}
              {link.icon === "shop" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              )}
              {link.icon === "search" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              )}
              {link.icon === "heart" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              {link.icon === "bag" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              )}
            </span>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
