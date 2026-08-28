import { BrandTile } from "@/components/BrandTile";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { enrichBrandsWithImages } from "@/lib/brand-images";
import { getBrands, getProducts } from "@/lib/data";

export default async function BrandsPage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const enriched = enrichBrandsWithImages(brands, products);
  const haute = enriched.filter((b) => b.tier === "haute");
  const premium = enriched.filter((b) => b.tier === "premium");

  return (
    <Container>
      <div className="section-rhythm">
        <SectionHeading
          title="Brands We Carry"
          subtitle="Haute horology and premium Swiss manufactures"
        />

        <h3 className="type-caption-md mb-4 uppercase tracking-wide">Haute Horology</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-12">
          {haute.map((brand) => (
            <BrandTile key={brand.handle} brand={brand} editorial />
          ))}
        </div>

        <h3 className="type-caption-md mb-4 uppercase tracking-wide">Premium Swiss</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {premium.map((brand) => (
            <BrandTile key={brand.handle} brand={brand} />
          ))}
        </div>
      </div>
    </Container>
  );
}
