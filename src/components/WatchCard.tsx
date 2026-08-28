import Image from "next/image";
import Link from "next/link";
import type { WatchProduct } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { getProductDisplay } from "@/lib/product-display";

const swatchColors: Record<string, string> = {
  Blue: "#1a3a5c",
  Green: "#2d4a3e",
  Black: "#111111",
  steel: "#9e9ea0",
  titanium: "#707072",
};

export function WatchCard({ product }: { product: WatchProduct }) {
  const { metafields } = product;
  const isNew = product.tags.includes("new");
  const isEnquiry = metafields.purchase_mode === "enquiry";
  const swatchColor = swatchColors[metafields.dial_color] || swatchColors.steel;
  const { modelName, subtitle } = getProductDisplay(product);

  return (
    <Link href={`/products/${product.handle}`} className="product-card block group">
      <div className="product-card-image relative overflow-hidden">
        {isNew && (
          <span className="badge-promo absolute top-3 left-3 z-10">Just In</span>
        )}
        {isEnquiry && !isNew && (
          <span className="badge-promo absolute top-3 left-3 z-10">By Request</span>
        )}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <span className="type-caption-sm text-[var(--color-stone)] uppercase tracking-wide">
            {product.vendor}
          </span>
        )}
      </div>

      <div className="pt-2 space-y-2">
        <div className="flex gap-1.5">
          <span
            className="swatch-dot swatch-dot-active"
            style={{ background: swatchColor }}
          />
          <span className="swatch-dot" style={{ background: "var(--color-soft-cloud)" }} />
          <span className="swatch-dot" style={{ background: "var(--color-ink)" }} />
        </div>

        <h3 className="type-body-strong line-clamp-2">{modelName}</h3>
        <p className="type-caption-md">{subtitle}</p>
        <p className="type-body-strong">
          {isEnquiry ? (
            <span className="text-[var(--color-mute)]">Price on request</span>
          ) : (
            formatPrice(product.price, metafields.purchase_mode, product.currencyCode)
          )}
        </p>
      </div>
    </Link>
  );
}
