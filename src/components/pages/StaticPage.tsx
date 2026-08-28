import { Container } from "@/components/ui/Container";

export function StaticPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className="section-rhythm max-w-2xl">
        <h1 className="type-heading-xl normal-case">{title}</h1>
        <div className="mt-8 type-caption-md space-y-4 text-[var(--color-charcoal)]">{children}</div>
      </div>
    </Container>
  );
}
