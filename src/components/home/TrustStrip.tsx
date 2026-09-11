import Link from "next/link";
import type { ReactNode } from "react";

const items: Array<{
  title: string;
  desc: string;
  href: string;
  icon: ReactNode;
}> = [
  {
    title: "Authenticity",
    desc: "Every piece verified before it leaves the maison.",
    href: "/authenticity",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="14.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M20 9.5v4M20 26.5v4M9.5 20h4M26.5 20h4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M15.5 20.2l2.8 2.8 6.2-6.4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Insured Shipping",
    desc: "Domestic and international delivery, fully covered.",
    href: "/shipping",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M8 14.5h16.5l5.5 5.2V28a1.5 1.5 0 01-1.5 1.5H8A1.5 1.5 0 016.5 28V16A1.5 1.5 0 018 14.5z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M24.5 14.5V20H32"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <circle cx="12.5" cy="29.5" r="2.2" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="27.5" cy="29.5" r="2.2" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M11 11.5h10.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Concierge",
    desc: "Speak with a specialist for haute references.",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M12.5 17.5a7.5 7.5 0 0115 0v5.5a3 3 0 01-3 3h-1.2"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M12.5 17.5v5a2.5 2.5 0 01-5 0v-1.5a2.5 2.5 0 015 0M27.5 17.5v5a2.5 2.5 0 005 0v-1.5a2.5 2.5 0 00-5 0"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M18 28.5h4c1.2 0 2 .8 2 2v.8H16v-.8c0-1.2.8-2 2-2z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Warranty",
    desc: "Manufacturer coverage with clear service paths.",
    href: "/warranty",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 7.5l9.5 3.2v8.4c0 5.4-3.7 9.8-9.5 11.9-5.8-2.1-9.5-6.5-9.5-11.9v-8.4L20 7.5z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M20 13.5v8M20 24.5h.01"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function TrustStrip() {
  return (
    <div className="trust-strip" role="list">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="trust-strip__item" role="listitem">
          <span className="trust-strip__icon">{item.icon}</span>
          <h3 className="trust-strip__title">{item.title}</h3>
          <p className="trust-strip__desc">{item.desc}</p>
        </Link>
      ))}
    </div>
  );
}
