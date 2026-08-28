import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/lib/types";

export function BrandTile({
  brand,
  editorial = false,
  image,
}: {
  brand: Brand;
  editorial?: boolean;
  image?: string;
}) {
  const collectionImage = image ?? brand.collectionImage;

  if (editorial) {
    return (
      <Link
        href={`/collections/${brand.collection_handle}`}
        className="brand-editorial-tile group"
      >
        {collectionImage ? (
          <Image
            src={collectionImage}
            alt={`${brand.name} collection`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-charcoal)]" />
        )}

        <div className="brand-editorial-tile__overlay" />

        <div className="brand-editorial-tile__content">
          <div>
            <h3 className="brand-editorial-tile__title">
              {brand.displayLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            {brand.tagline && (
              <p className="brand-editorial-tile__tagline">{brand.tagline}</p>
            )}
          </div>
          <span className="btn-outline-on-image">Shop {brand.name}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/collections/${brand.collection_handle}`}
      className="brand-compact-tile group"
    >
      {collectionImage ? (
        <Image
          src={collectionImage}
          alt={`${brand.name} collection`}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--color-soft-cloud)]" />
      )}
      <div className="brand-compact-tile__overlay" />
      <div className="brand-compact-tile__content">
        <h3 className="type-body-strong text-[var(--color-canvas)]">{brand.name}</h3>
        <p className="type-caption-sm text-[var(--color-stone)] mt-1 line-clamp-2">
          {brand.tagline}
        </p>
      </div>
    </Link>
  );
}

export function CategoryTile({
  title,
  href,
  image,
}: {
  title: string;
  href: string;
  image: string;
}) {
  return (
    <Link href={href} className="category-tile group">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 33vw, 16vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="category-tile__overlay" />
      <span className="category-tile__label">{title}</span>
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
    <Link href={href} className="campaign-tile block group">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="campaign-tile__overlay" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(135deg, #111 0%, #39393b 100%)"
              : "linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)",
          }}
        />
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
