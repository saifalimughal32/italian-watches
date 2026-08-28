import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WatchCard } from "@/components/WatchCard";
import { products, searchCatalog } from "@/lib/data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchCatalog(q);

  return (
    <Container>
      <div className="section-rhythm">
        <SectionHeading title="Search" />
        <form action="/search" className="search-pill max-w-xl mb-12">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 mr-2 opacity-50"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search watches, brands, references..."
            aria-label="Search"
          />
        </form>
        {q && (
          <p className="type-caption-md mb-8">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
        )}
        <div className="grid-products">
          {(q ? results : products).map((product) => (
            <WatchCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Container>
  );
}
