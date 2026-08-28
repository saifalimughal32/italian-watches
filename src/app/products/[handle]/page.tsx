import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WatchCard } from "@/components/WatchCard";
import { formatPrice, getProduct, getProductsByBrand } from "@/lib/data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const { metafields } = product;
  const isEnquiry = metafields.purchase_mode === "enquiry";
  const related = getProductsByBrand(product.vendor).filter((p) => p.id !== product.id);

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
            <div className="product-card-image aspect-square">
              <span className="type-caption-sm text-[var(--color-stone)] uppercase">
                Product Image
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 product-card-image"
                  style={{ aspectRatio: "1" }}
                />
              ))}
            </div>
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

            <div className="mt-8">
              {isEnquiry ? (
                <Button
                  variant="primary"
                  href={`/contact?reference=${metafields.reference_number}&product=${encodeURIComponent(product.title)}`}
                  className="w-full"
                >
                  Request Availability
                </Button>
              ) : (
                <Button variant="primary" className="w-full">
                  Add to Bag
                </Button>
              )}
            </div>

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
