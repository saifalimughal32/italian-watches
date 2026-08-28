import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/lib/types";

function BrandLogo({ brand }: { brand: Brand }) {
  if (brand.logo) {
    return (
      <div className="mb-3 flex h-16 w-full items-center justify-center">
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          width={140}
          height={64}
          className="h-14 w-auto max-w-[140px] object-contain"
        />
      </div>
    );
  }

  return <div className="type-heading-lg mb-2">{brand.name.charAt(0)}</div>;
}

export function BrandTile({ brand, editorial = false }: { brand: Brand; editorial?: boolean }) {
  if (editorial) {
    return (
      <Link
        href={`/collections/${brand.collection_handle}`}
        className="campaign-tile campaign-tile--portrait block min-h-[280px] md:min-h-[320px]"
        style={{
          background: `linear-gradient(to top, rgba(17,17,17,0.75) 0%, rgba(17,17,17,0.2) 55%, transparent 100%), var(--color-charcoal)`,
        }}
      >
        <div className="w-full">
          {brand.logo ? (
            <div className="mb-4 flex justify-start">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={120}
                height={56}
                className="h-12 w-auto max-w-[120px] object-contain"
              />
            </div>
          ) : (
            <h3 className="type-brand-lockup text-[var(--color-canvas)]">
              {brand.displayLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
          )}
          <div className="mt-6">
            <span className="btn-outline-on-image">Shop</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/collections/${brand.collection_handle}`}
      className="product-card block text-center py-10 px-4 min-h-[200px] flex flex-col items-center justify-center"
      style={{ background: "var(--color-soft-cloud)" }}
    >
      <BrandLogo brand={brand} />
      <h3 className="type-body-strong">{brand.name}</h3>
      <p className="type-caption-md mt-2 max-w-[200px]">{brand.tagline}</p>
    </Link>
  );
}

export function CampaignTile({
  headline,
  href,
  cta = "Shop",
  dark = true,
  lines,
  image,
}: {
  headline: string;
  href: string;
  cta?: string;
  dark?: boolean;
  lines?: string[];
  image?: string;
}) {
  const displayLines = lines ?? headline.split(" ");

  return (
    <Link
      href={href}
      className="campaign-tile block"
      style={
        image
          ? undefined
          : {
              background: dark
                ? "linear-gradient(135deg, #111 0%, #39393b 100%)"
                : "linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)",
            }
      }
    >
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(17,17,17,0.75) 0%, rgba(17,17,17,0.25) 45%, rgba(17,17,17,0.1) 100%)",
            }}
          />
        </>
      )}
      <div className="relative z-10">
        <h2
          className="type-display-campaign max-w-2xl"
          style={{ color: image || dark ? "var(--color-canvas)" : "var(--color-ink)" }}
        >
          {displayLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className="mt-6">
          <span className="btn-outline-on-image">{cta}</span>
        </div>
      </div>
    </Link>
  );
}
