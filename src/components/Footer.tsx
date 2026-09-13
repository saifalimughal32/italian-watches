import Link from "next/link";
import { SiteLogo } from "@/components/brand/SiteLogo";

const columns = [
  {
    title: "Resources",
    links: [
      { label: "All Brands", href: "/brands" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "Tissot PRX", href: "/collections/tissot-prx" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Authenticity", href: "/authenticity" },
      { label: "Warranty", href: "/warranty" },
      { label: "Private Client", href: "/contact" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Rolex", href: "/collections/rolex" },
      { label: "Audemars Piguet", href: "/collections/audemars-piguet" },
      { label: "Patek Philippe", href: "/collections/patek-philippe" },
      { label: "Hublot", href: "/collections/hublot" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="pb-2 md:pb-0"
      style={{ borderTop: "1px solid var(--color-hairline)" }}
    >
      <div className="container-nike py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="type-body-strong mb-3 md:mb-4">{col.title}</h3>
            <ul className="space-y-2.5 md:space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="type-caption-md hover:opacity-70">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--color-hairline)" }}>
        <div className="container-nike py-6 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <SiteLogo variant="footer" />
            <p className="type-utility-xs">
              © {new Date().getFullYear()} Italian Watches. All rights reserved.
            </p>
          </div>
          <div className="type-utility-xs flex gap-4">
            <Link href="/about">Terms</Link>
            <Link href="/about">Privacy</Link>
            <span>Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
