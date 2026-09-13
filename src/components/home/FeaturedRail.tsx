import Image from "next/image";
import Link from "next/link";
import type { WatchProduct } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { getProductDisplay, getProductImage } from "@/lib/product-display";

export function FeaturedRail({ products }: { products: WatchProduct[] }) {
  if (!products.length) return null;

  return (
    <div className="featured-rail" role="list">
      {products.map((product) => {
        const { modelName, subtitle } = getProductDisplay(product);
        const imageUrl = getProductImage(product);
        const isEnquiry = product.metafields.purchase_mode === "enquiry";

        return (
          <article key={product.id} className="featured-rail__item" role="listitem">
            <Link href={`/products/${product.handle}`} className="rail-card group block">
              <div className="product-card-image relative overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 72vw, 280px"
                    quality={70}
                    className="object-contain product-image-fit transition-opacity duration-500 group-hover:opacity-90"
                  />
                ) : (
                  <span className="type-caption-sm text-[var(--color-stone)] uppercase tracking-wide">
                    {product.vendor}
                  </span>
                )}
              </div>
              <div className="pt-3 space-y-1">
                <p className="type-micro">{product.vendor}</p>
                <h3 className="type-body-strong line-clamp-2">{modelName}</h3>
                <p className="type-caption-md">{subtitle}</p>
                <p className="type-caption-md rail-card__price text-[var(--color-mute)]">
                  {isEnquiry
                    ? "Price on request"
                    : formatPrice(
                        product.price,
                        product.metafields.purchase_mode,
                        product.currencyCode
                      )}
                </p>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
