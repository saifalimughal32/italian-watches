import { BrandTile, CategoryTile } from "@/components/BrandTile";
import { BrandChapter } from "@/components/home/BrandChapter";
import { CinematicHero } from "@/components/home/CinematicHero";
import { FeaturedRail } from "@/components/home/FeaturedRail";
import { JournalTeaser } from "@/components/home/JournalTeaser";
import { NewsletterCapture } from "@/components/home/NewsletterCapture";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WatchCard } from "@/components/WatchCard";
import { enrichBrandsWithImages, CATEGORY_COLLECTION_IMAGES } from "@/lib/brand-images";
import {
  getBrandChapterSlot,
  getBrands,
  getJournalArticles,
  getProducts,
} from "@/lib/data";
import { mockBrands } from "@/lib/mock-data";
import Link from "next/link";

export const revalidate = 300;

const categories = [
  { title: "Men", href: "/collections/mens-watches", image: CATEGORY_COLLECTION_IMAGES["mens-watches"] },
  { title: "Women", href: "/collections/womens-watches", image: CATEGORY_COLLECTION_IMAGES["womens-watches"] },
  { title: "Automatic", href: "/collections/automatic-watches", image: CATEGORY_COLLECTION_IMAGES["automatic-watches"] },
  { title: "Chronograph", href: "/collections/chronograph-watches", image: CATEGORY_COLLECTION_IMAGES["chronograph-watches"] },
  { title: "Luxury", href: "/collections/luxury-watches", image: CATEGORY_COLLECTION_IMAGES["luxury-watches"] },
  { title: "Premium", href: "/collections/premium-watches", image: CATEGORY_COLLECTION_IMAGES["premium-watches"] },
];

export default async function HomePage() {
  const brandsPromise = getBrands();
  const [brands, products, journal, brandChapter] = await Promise.all([
    brandsPromise,
    getProducts(),
    getJournalArticles(),
    brandsPromise.then((items) => getBrandChapterSlot(items.length ? items : mockBrands)),
  ]);

  const hauteBrands = enrichBrandsWithImages(
    (brands.filter((brand) => brand.tier === "haute").length
      ? brands.filter((brand) => brand.tier === "haute")
      : mockBrands.filter((brand) => brand.tier === "haute")
    ).slice(0, 4),
    products
  );

  const featured =
    products.filter((p) => p.tags.includes("featured")).length > 0
      ? products.filter((p) => p.tags.includes("featured")).slice(0, 8)
      : products.slice(0, 8);

  const prx =
    products.filter((p) => p.metafields.line === "prx").length > 0
      ? products.filter((p) => p.metafields.line === "prx").slice(0, 3)
      : products.slice(0, 3);

  return (
    <>
      <CinematicHero
        brandName="Italian Watches"
        campaignLine="Time, curated with intention."
        support="Haute horology and accessible Swiss luxury — one maison, every chapter."
        ctaLabel="Discover"
        ctaHref="/collections/all"
        stillSrc="/images/hero.jpg"
      />

      <section className="container-nike section-rhythm">
        <SectionHeading
          title="Haute Horology"
          subtitle="The houses that define the craft"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {hauteBrands.map((brand) => (
            <BrandTile key={brand.handle} brand={brand} editorial />
          ))}
        </div>
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading
          title="Featured"
          subtitle="Eight watches, chosen for the moment"
        />
        <FeaturedRail products={featured} />
      </section>

      <section className="container-nike section-rhythm">
        <BrandChapter slot={brandChapter} />
      </section>

      <section className="container-nike section-rhythm">
        <SectionHeading
          title="Tissot PRX"
          subtitle="Accessible Swiss luxury — the everyday icon"
        />
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="type-heading-xl text-[var(--color-ink)]">From the Journal</h2>
            <p className="type-caption-md mt-2">Guides, deep-dives, and atelier notes</p>
          </div>
          <Link href="/journal" className="type-caption-md hover:opacity-70 shrink-0">
            View all
          </Link>
        </div>
        <JournalTeaser articles={journal.slice(0, 3)} />
      </section>

      <section className="container-nike section-rhythm">
        <TrustStrip />
      </section>

      <section className="container-nike section-rhythm">
        <NewsletterCapture />
      </section>
    </>
  );
}
