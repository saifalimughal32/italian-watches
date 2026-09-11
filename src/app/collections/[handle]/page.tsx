import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterChip } from "@/components/ui/FilterChip";
import { Container } from "@/components/ui/Container";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { getBrand, getBrands, getCollectionProducts } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionProducts(handle);
  if (!collection) return { title: "Collection | Italian Watches" };

  return {
    title: `${collection.title} | Italian Watches`,
    description: collection.description || `Shop ${collection.title} at Italian Watches.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const [brands, collection] = await Promise.all([
    getBrands(),
    getCollectionProducts(handle),
  ]);

  if (!collection) notFound();

  const brand = await getBrand(handle);
  const { title, description, products: items } = collection;

  return (
    <>
      <div className="sticky-subnav" style={{ background: "var(--color-canvas)" }}>
        <Container>
          <div className="flex items-center justify-between h-12 type-caption-md">
            <span>Home / {title}</span>
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

          <div className="mobile-scroll-x md:flex md:flex-wrap md:gap-2 md:mx-0 md:px-0 mt-8 mb-10">
            {brands.map((b) => (
              <FilterChip
                key={b.handle}
                href={`/collections/${b.collection_handle}`}
                label={b.name}
                active={brand?.handle === b.handle}
              />
            ))}
          </div>

          <CollectionGrid products={items} />
        </div>
      </Container>
    </>
  );
}
