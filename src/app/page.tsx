import { BrandTile, CampaignTile } from "@/components/BrandTile";
import { EditorialBrandSection } from "@/components/EditorialBrandSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WatchCard } from "@/components/WatchCard";
import { brands, products } from "@/lib/data";

const categories = [
  { title: "Men's", href: "/collections/mens-watches" },
  { title: "Women's", href: "/collections/womens-watches" },
  { title: "Automatic", href: "/collections/automatic-watches" },
  { title: "Chronograph", href: "/collections/chronograph-watches" },
  { title: "Luxury", href: "/collections/luxury-watches" },
  { title: "Premium", href: "/collections/premium-watches" },
];

export default function HomePage() {
  const featured = products.filter((p) => p.tags.includes("featured"));
  const newArrivals = products.filter((p) => p.tags.includes("new"));
  const bestSellers = products.filter((p) => p.tags.includes("bestseller"));
  const prx = products.filter((p) => p.metafields.line === "prx");

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
        <SectionHeading title="Shop by Brand" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
          {brands.slice(0, 4).map((brand) => (
            <BrandTile key={brand.handle} brand={brand} editorial />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-2">
          {brands.map((brand) => (
            <BrandTile key={brand.handle} brand={brand} />
          ))}
        </div>
      </section>

      <section className="container-nike section-rhythm">
        <EditorialBrandSection
          lines={["ROYAL", "OAK"]}
          tagline="Since 1972, the icon that redefined luxury sports watches."
          href="/collections/audemars-piguet"
          cta="Explore AP"
          products={products.filter((p) => p.vendor === "Audemars Piguet")}
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
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {categories.map((cat) => (
            <a
              key={cat.href}
              href={cat.href}
              className="product-card text-center py-8 px-2"
              style={{ background: "var(--color-soft-cloud)" }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--color-canvas)] flex items-center justify-center type-body-strong">
                {cat.title.charAt(0)}
              </div>
              <span className="type-caption-md text-[var(--color-ink)]">{cat.title}</span>
            </a>
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
