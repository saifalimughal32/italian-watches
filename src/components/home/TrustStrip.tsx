import Link from "next/link";

const items = [
  {
    title: "Authenticity",
    desc: "Every piece verified before it leaves the maison.",
    href: "/authenticity",
  },
  {
    title: "Insured Shipping",
    desc: "Domestic and international delivery, fully covered.",
    href: "/shipping",
  },
  {
    title: "Concierge",
    desc: "Speak with a specialist for haute references.",
    href: "/contact",
  },
  {
    title: "Warranty",
    desc: "Manufacturer coverage with clear service paths.",
    href: "/warranty",
  },
];

export function TrustStrip() {
  return (
    <div className="trust-strip" role="list">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="trust-strip__item" role="listitem">
          <h3 className="trust-strip__title">{item.title}</h3>
          <p className="trust-strip__desc">{item.desc}</p>
        </Link>
      ))}
    </div>
  );
}
