import Link from "next/link";

const primaryNav = [
  { label: "New & Featured", href: "/collections/new-arrivals" },
  { label: "Brands", href: "/brands" },
  { label: "Men", href: "/collections/mens-watches" },
  { label: "Women", href: "/collections/womens-watches" },
  { label: "Luxury", href: "/collections/luxury-watches" },
  { label: "Premium", href: "/collections/premium-watches" },
];

export function Header() {
  return (
    <header>
      {/* utility-bar */}
      <div
        className="flex items-center justify-end h-9 px-4 md:px-10"
        style={{ background: "#000000" }}
      >
        <div className="type-caption-sm flex gap-4 text-[var(--color-on-primary)]">
          <Link href="/contact">Private Client</Link>
          <span className="text-[var(--color-stone)]">·</span>
          <Link href="/faq">Help</Link>
          <span className="hidden sm:inline text-[var(--color-stone)]">·</span>
          <Link href="/contact" className="hidden sm:inline">
            Join Us
          </Link>
          <span className="text-[var(--color-stone)]">·</span>
          <Link href="/contact">Sign In</Link>
        </div>
      </div>

      {/* primary-nav */}
      <div
        className="sticky top-0 z-50 sticky-subnav"
        style={{ background: "var(--color-canvas)" }}
      >
        <div className="container-nike flex items-center justify-between h-14 md:h-16 gap-4">
          <Link href="/" className="type-body-strong shrink-0 tracking-tight text-sm md:text-base">
            ITALIAN WATCHES
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="type-body-strong text-[var(--color-ink)] hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </nav>

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
            <Link href="/wishlist" className="btn-icon-circular" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>
            <Link href="/cart" className="btn-icon-circular" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
