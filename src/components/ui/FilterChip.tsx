import Link from "next/link";

export function FilterChip({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={active ? "filter-chip filter-chip-active" : "filter-chip"}
    >
      {label}
    </Link>
  );
}
