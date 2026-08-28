import { BrandTile, CampaignTile, CategoryTile } from "@/components/BrandTile";
import { EditorialBrandSection } from "@/components/EditorialBrandSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WatchCard } from "@/components/WatchCard";
import { enrichBrandsWithImages, CATEGORY_COLLECTION_IMAGES } from "@/lib/brand-images";
import { getBrands, getProducts } from "@/lib/data";
import { mockBrands } from "@/lib/mock-data";

export const revalidate = 60;

const categories = [
  { title: "Men's", href: "/collections/mens-watches", image: CATEGORY_COLLECTION_IMAGES["mens-watches"] },
  { title: "Women's", href: "/collections/womens-watches", image: CATEGORY_COLLECTION_IMAGES["womens-watches"] },
  { title: "Automatic", href: "/collections/automatic-watches", image: CATEGORY_COLLECTION_IMAGES["automatic-watches"] },
  { title: "Chronograph", href: "/collections/chronograph-watches", image: CATEGORY_COLLECTION_IMAGES["chronograph-watches"] },
  { title: "Luxury", href: "/collections/luxury-watches", image: CATEGORY_COLLECTION_IMAGES["luxury-watches"] },
  { title: "Premium", href: "/collections/premium-watches", image: CATEGORY_COLLECTION_IMAGES["premium-watches"] },
];

export default async function HomePage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const hauteBrands = enrichBrandsWithImages(
    mockBrands.filter((brand) => brand.tier === "haute"),
    products
  );
  const premiumBrands = enrichBrandsWithImages(
    brands.filter((brand) => brand.tier === "premium"),
    products
  );
  const featured =
    products.filter((p) => p.tags.includes("featured")).length > 0
      ? products.filter((p) => p.tags.includes("featured"))
      : products.slice(0, 8);
  const newArrivals =
    products.filter((p) => p.tags.includes("new")).length > 0
      ? products.filter((p) => p.tags.includes("new"))
      : products.slice(0, 4);
  const bestSellers =
    products.filter((p) => p.tags.includes("bestseller")).length > 0
      ? products.filter((p) => p.tags.includes("bestseller"))
      : products.slice(4, 12);
  const prx =
    products.filter((p) => p.metafields.line === "prx").length > 0
      ? products.filter((p) => p.metafields.line === "prx")
      : products.slice(0, 3);
  const rolexProducts = products.filter((product) => product.vendor === "Rolex");

  return (
    <>
      <section className="container-nike section-rhythm pb-0">
        <CampaignTile
          headline="The World's Finest Timepieces"
          href="/collections/luxury-watches"
          cta="Shop Luxury"
          image="/images/hero.jpg"
        />
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading title="Featured Watches" subtitle="Curated across every brand" />
        <div className="grid-products">
          {featured.map((product) => (
            <WatchCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading
          title="Shop by Brand"
          subtitle="Haute horology houses and premium Swiss manufactures"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {hauteBrands.map((brand) => (
            <BrandTile key={brand.handle} brand={brand} editorial />
          ))}
        </div>
        {premiumBrands.length > 0 && (
          <>
            <h3 className="type-caption-md mt-10 mb-4 uppercase tracking-wide">Premium Swiss</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {premiumBrands.map((brand) => (
                <BrandTile key={brand.handle} brand={brand} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="container-nike section-rhythm">
        <EditorialBrandSection
          lines={["ROLEX", "COLLECTION"]}
          tagline="The crown of Swiss watchmaking — sports models, dress watches, and icons."
          href="/collections/rolex"
          cta="Explore Rolex"
          image="/collections/rolex.jpg"
          products={rolexProducts.length > 0 ? rolexProducts.slice(0, 3) : products.slice(0, 3)}
        />
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading title="Tissot PRX" subtitle="The icon of accessible Swiss luxury" />
        <div className="grid-products--3 grid gap-2">
          {prx.map((product) => (
            <WatchCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading title="Shop by Category" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {categories.map((cat) => (
            <CategoryTile key={cat.href} title={cat.title} href={cat.href} image={cat.image} />
          ))}
        </div>
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading title="New Arrivals" />
        <div className="grid-products">
          {newArrivals.map((product) => (
            <WatchCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading title="Best Sellers" />
        <div className="grid-products">
          {bestSellers.map((product) => (
            <WatchCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
