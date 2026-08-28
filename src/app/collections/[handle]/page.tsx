import { notFound } from "next/navigation";
import { FilterChip } from "@/components/ui/FilterChip";
import { Container } from "@/components/ui/Container";
import { WatchCard } from "@/components/WatchCard";
import { brands, getBrand, getCollectionProducts } from "@/lib/data";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = getCollectionProducts(handle);
  if (!collection) notFound();

  const brand = getBrand(handle);
  const { title, description, products: items } = collection;

  return (
    <>
      <div className="sticky-subnav" style={{ background: "var(--color-canvas)" }}>
        <Container>
          <div className="flex items-center justify-between h-12 type-caption-md">
            <span>Home / {title}</span>
            <span className="hidden sm:inline type-body-strong">Sort By: Featured</span>
          </div>
        </Container>
      </div>

      <Container>
        <div className="section-rhythm">
          <h1 className="type-heading-xl">{title}</h1>
          {description && (
            <p
              className="type-caption-md mt-4 max-w-2xl"
              style={{ color: "var(--color-charcoal)" }}
            >
              {description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-8 mb-10">
            {brands.map((b) => (
              <FilterChip
                key={b.handle}
                href={`/collections/${b.collection_handle}`}
                label={b.name}
                active={brand?.handle === b.handle}
              />
            ))}
          </div>

          <div className="grid-products">
            {items.map((product) => (
              <WatchCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
