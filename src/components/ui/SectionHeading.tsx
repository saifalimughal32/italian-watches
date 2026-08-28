export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="type-heading-xl text-[var(--color-ink)]">{title}</h2>
      {subtitle && <p className="type-caption-md mt-2">{subtitle}</p>}
    </div>
  );
}
