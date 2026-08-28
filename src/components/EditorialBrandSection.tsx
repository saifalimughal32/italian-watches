import Image from "next/image";
import Link from "next/link";
import type { WatchProduct } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { getProductDisplay } from "@/lib/product-display";

export function EditorialBrandSection({
  lines,
  tagline,
  href,
  cta,
  products,
  image,
}: {
  lines: string[];
  tagline: string;
  href: string;
  cta: string;
  products: WatchProduct[];
  image?: string;
}) {
  return (
    <section>
      <Link href={href} className="campaign-tile block min-h-[320px] md:min-h-[420px] group">
        {image && (
          <>
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="campaign-tile__overlay" />
          </>
        )}
        {!image && <div className="absolute inset-0 bg-black" />}
        <div className="relative z-10 max-w-xl">
          <h2 className="type-display-campaign text-[var(--color-canvas)]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="type-caption-md mt-4 text-[var(--color-stone)] max-w-md normal-case">
            {tagline}
          </p>
          <div className="mt-8">
            <span className="btn-outline-on-image">{cta}</span>
          </div>
        </div>
      </Link>

      {products.length > 0 && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {products.map((product) => (
            <ProductSpotlight key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductSpotlight({ product }: { product: WatchProduct }) {
  const { modelName, subtitle, reference } = getProductDisplay(product);
  const isEnquiry = product.metafields.purchase_mode === "enquiry";

  return (
    <Link
      href={`/products/${product.handle}`}
      className="flex flex-col sm:flex-row gap-0 bg-[var(--color-soft-cloud)] overflow-hidden"
    >
      <div className="product-card-image sm:w-1/2 aspect-square sm:aspect-auto sm:min-h-[220px] relative shrink-0">
        {isEnquiry && (
          <span className="badge-promo absolute top-3 left-3 z-10">By Request</span>
        )}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <span className="type-caption-sm text-[var(--color-stone)] uppercase tracking-wide">
            {product.vendor}
          </span>
        )}
      </div>
      <div className="p-6 sm:w-1/2 flex flex-col justify-center bg-[var(--color-canvas)]">
        <p className="type-caption-sm uppercase text-[var(--color-mute)]">{product.vendor}</p>
        <h3 className="type-heading-md mt-1 text-[var(--color-ink)]">{modelName}</h3>
        <p className="type-caption-md mt-2">{subtitle}</p>
        {reference && (
          <p className="type-caption-sm mt-1 text-[var(--color-stone)]">Ref. {reference}</p>
        )}
        <p className="type-body-strong mt-4 text-[var(--color-mute)]">
          {formatPrice(product.price, product.metafields.purchase_mode, product.currencyCode)}
        </p>
      </div>
    </Link>
  );
}
