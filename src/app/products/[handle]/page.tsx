import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductBuyBox } from "@/components/products/ProductBuyBox";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecTable } from "@/components/products/ProductSpecTable";
import { ProductTrustAccordions } from "@/components/products/ProductTrustAccordions";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { WatchCard } from "@/components/WatchCard";
import { getProduct, getProductsByBrand } from "@/lib/data";
import { inferBrandHandle } from "@/lib/brand-inference";
import { formatDescriptionForDisplay } from "@/lib/parse-specs";
import { getProductGallery } from "@/lib/product-display";
import "../pdp.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product | Italian Watches" };

  return {
    title: `${product.title} | Italian Watches`,
    description:
      formatDescriptionForDisplay(product.description) ||
      `${product.vendor} — ${product.title}`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const { metafields } = product;
  const isEnquiry = metafields.purchase_mode === "enquiry";
  const brandHandle = inferBrandHandle(product.vendor);
  const description = formatDescriptionForDisplay(product.description);
  const related = (await getProductsByBrand(product.vendor))
    .filter((p) => p.id !== product.id)
    .slice(0, 8);
  const galleryImages = getProductGallery(product);
  const contactHref = `/contact?reference=${encodeURIComponent(
    metafields.reference_number || product.handle
  )}&product=${encodeURIComponent(product.title)}`;

  return (
    <div className="pdp-page bg-[var(--color-canvas)]">
      <Container>
        <div className="section-rhythm pb-24 md:pb-0">
          <p className="type-caption-md mb-6">
            <Link href="/">Home</Link> /{" "}
            <Link href={`/collections/${brandHandle}`}>{product.vendor}</Link> /{" "}
            {metafields.line || product.title}
          </p>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <ProductGallery images={galleryImages} alt={product.title} />

            <div>
              <Link
                href={`/collections/${brandHandle}`}
                className="type-micro hover:opacity-70"
              >
                {product.vendor}
              </Link>
              <h1 className="type-heading-xl mt-3 normal-case">{product.title}</h1>
              {metafields.reference_number && (
                <p className="type-caption-md mt-2 font-mono tracking-wide">
                  Ref. {metafields.reference_number}
                </p>
              )}

              <ProductBuyBox
                handle={product.handle}
                title={product.title}
                variants={product.variants}
                initialVariantId={product.variantId ?? product.variants?.[0]?.id}
                isEnquiry={isEnquiry}
                contactHref={contactHref}
                purchaseMode={metafields.purchase_mode}
                fallbackPrice={product.price}
                fallbackCurrency={product.currencyCode}
                metafields={metafields}
              />

              {description && (
                <div className="mt-12">
                  <h2 className="type-heading-lg mb-4">The story</h2>
                  <div className="type-caption-md text-[var(--color-charcoal)] whitespace-pre-line leading-relaxed">
                    {description}
                  </div>
                </div>
              )}

              <div className="mt-12">
                <ProductTrustAccordions />
              </div>
            </div>
          </div>

          <div
            className="mt-16 pt-16"
            style={{ borderTop: "1px solid var(--color-hairline)" }}
          >
            <ProductSpecTable metafields={metafields} />
          </div>

          {related.length > 0 && (
            <section
              className="mt-16 pt-16"
              style={{ borderTop: "1px solid var(--color-hairline)" }}
            >
              <SectionHeading title={`More from ${product.vendor}`} />
              <div className="grid-products">
                {related.map((p) => (
                  <WatchCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          <RecentlyViewed product={product} />
        </div>
      </Container>
    </div>
  );
}
