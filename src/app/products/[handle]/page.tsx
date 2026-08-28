import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductActions } from "@/components/products/ProductActions";
import { WatchCard } from "@/components/WatchCard";
import { formatPrice, getProduct, getProductsByBrand } from "@/lib/data";

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
    description: `${product.vendor} — ${product.title}`,
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
  const related = (await getProductsByBrand(product.vendor)).filter(
    (p) => p.id !== product.id
  );
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const specs = [
    ["Reference", metafields.reference_number],
    ["Movement", metafields.movement],
    ["Case size", metafields.case_size_mm ? `${metafields.case_size_mm}mm` : "—"],
    ["Dial", metafields.dial_color],
    ["Crystal", metafields.crystal],
    ["Water resistance", metafields.water_resistance],
    ["Strap", metafields.strap_type],
    ["Power reserve", metafields.power_reserve],
  ];

  return (
    <Container>
      <div className="section-rhythm">
        <p className="type-caption-md mb-6">
          Home / {product.vendor} / {metafields.line || product.title}
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="product-card-image aspect-square relative overflow-hidden">
              {galleryImages[0] ? (
                <Image
                  src={galleryImages[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <span className="type-caption-sm text-[var(--color-stone)] uppercase">
                  Product Image
                </span>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-2 mt-2">
                {galleryImages.slice(0, 4).map((image) => (
                  <div
                    key={image}
                    className="w-16 h-16 product-card-image relative overflow-hidden"
                    style={{ aspectRatio: "1" }}
                  >
                    <Image src={image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="type-caption-md">{product.vendor}</p>
            <h1 className="type-heading-xl mt-2 normal-case">{product.title}</h1>
            {metafields.reference_number && (
              <p className="type-caption-md mt-2">Ref. {metafields.reference_number}</p>
            )}
            <p className="type-heading-lg mt-6">
              {formatPrice(product.price, metafields.purchase_mode, product.currencyCode)}
            </p>

            <div
              className="flex flex-wrap gap-6 py-6 mt-4"
              style={{
                borderTop: "1px solid var(--color-hairline)",
                borderBottom: "1px solid var(--color-hairline)",
              }}
            >
              {[
                ["Movement", metafields.movement],
                ["Case", metafields.case_size_mm ? `${metafields.case_size_mm}mm` : "—"],
                ["Material", metafields.case_material.join(", ") || "—"],
                ["Water", metafields.water_resistance || "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="type-caption-sm block uppercase text-[var(--color-mute)]">
                    {label}
                  </span>
                  <span className="type-body-strong capitalize">{value}</span>
                </div>
              ))}
            </div>

            <ProductActions
              handle={product.handle}
              variantId={product.variantId ?? product.variants?.[0]?.id}
              isEnquiry={isEnquiry}
              contactHref={`/contact?reference=${metafields.reference_number}&product=${encodeURIComponent(product.title)}`}
            />

            <div className="mt-10">
              {["View Product Details", "Shipping & Returns", "Authenticity Guarantee"].map(
                (label) => (
                  <div key={label} className="disclosure-row type-body-strong">
                    <span>{label}</span>
                    <span>›</span>
                  </div>
                )
              )}
            </div>

            <table className="w-full mt-6 type-caption-md">
              <tbody>
                {specs.map(([key, value]) => (
                  <tr
                    key={key}
                    style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
                  >
                    <th className="py-3 text-left font-normal text-[var(--color-mute)] w-2/5">
                      {key}
                    </th>
                    <td className="py-3 capitalize text-[var(--color-ink)]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      </div>
    </Container>
  );
}
