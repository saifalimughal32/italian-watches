import Image from "next/image";
import Link from "next/link";
import type { HomepageSlot } from "@/lib/types";

export function BrandChapter({ slot }: { slot: HomepageSlot }) {
  return (
    <section className="brand-chapter" aria-labelledby="brand-chapter-heading">
      <div className="brand-chapter__media">
        <Image
          src={slot.image}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="brand-chapter__copy">
        <p className="type-micro">Brand chapter</p>
        <h2 id="brand-chapter-heading" className="type-heading-xl mt-3">
          {slot.heading}
        </h2>
        {slot.subheading && (
          <p className="type-caption-md mt-3 text-[var(--color-mute)]">{slot.subheading}</p>
        )}
        {slot.founded_year != null && (
          <p className="brand-chapter__founded type-micro">Est. {slot.founded_year}</p>
        )}
        {slot.heritage && <p className="brand-chapter__heritage">{slot.heritage}</p>}
        <div className="brand-chapter__cta">
          <Link href={slot.cta_href} className="btn-primary">
            {slot.cta_label}
          </Link>
        </div>
      </div>
    </section>
  );
}
