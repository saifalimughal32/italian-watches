import Link from "next/link";
import { HeaderActions } from "@/components/layout/HeaderActions";

const primaryNav: Array<{ label: string; href: string; badge?: string }> = [
  { label: "New & Featured", href: "/collections/new-arrivals", badge: "New" },
  { label: "Brands", href: "/brands" },
  { label: "Men", href: "/collections/mens-watches" },
  { label: "Women", href: "/collections/womens-watches" },
  { label: "Luxury", href: "/collections/luxury-watches" },
  { label: "Premium", href: "/collections/premium-watches" },
];

export function Header() {
  return (
    <header>
      {/* announcement + utility — single row */}
      <div className="announcement-bar">
        <p className="announcement-bar__message">
          <span className="announcement-bar__desktop">
            Free insured shipping across Pakistan on orders over Rs 50,000 · Authenticity
            guaranteed
          </span>
          <span className="announcement-bar__mobile">Free insured shipping over Rs 50,000</span>
        </p>
        <div className="announcement-bar__links type-caption-sm">
          <Link href="/faq">Help</Link>
          <span className="text-[var(--color-stone)]">·</span>
          <Link href="/contact">Join Us</Link>
          <span className="text-[var(--color-stone)]">·</span>
          <Link href="/contact">Sign In</Link>
        </div>
      </div>

      {/* primary-nav */}
      <div
        className="sticky top-0 z-50 sticky-subnav"
        style={{ background: "var(--color-canvas)" }}
      >
        <div className="container-nike flex items-center justify-between h-14 md:h-16 gap-2 md:gap-4 min-w-0">
          <Link href="/" className="type-body-strong shrink-0 tracking-tight text-sm md:text-base">
            ITALIAN WATCHES
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-item-with-badge type-body-strong text-[var(--color-ink)] hover:opacity-70"
              >
                {item.badge ? <span className="nav-item-badge">{item.badge}</span> : null}
                {item.label}
              </Link>
            ))}
          </nav>

          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
