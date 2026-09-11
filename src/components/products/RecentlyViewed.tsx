"use client";

import { useEffect, useState } from "react";
import { WatchCard } from "@/components/WatchCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  pushRecentlyViewed,
  readRecentlyViewed,
  toRecentlyViewedItem,
} from "@/lib/recently-viewed";
import type { WatchProduct } from "@/lib/types";

export function RecentlyViewed({
  product,
}: {
  product: WatchProduct;
}) {
  const [items, setItems] = useState<WatchProduct[]>([]);

  useEffect(() => {
    pushRecentlyViewed(toRecentlyViewedItem(product));

    const handles = readRecentlyViewed()
      .map((entry) => entry.handle)
      .filter((handle) => handle !== product.handle)
      .slice(0, 8);

    if (!handles.length) {
      setItems([]);
      return;
    }

    let cancelled = false;
    fetch(`/api/products?handles=${handles.join(",")}`)
      .then((response) => response.json())
      .then((data: { products?: WatchProduct[] }) => {
        if (cancelled) return;
        setItems(data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  if (!items.length) return null;

  return (
    <section
      className="mt-16 pt-16"
      style={{ borderTop: "1px solid var(--color-hairline)" }}
      aria-labelledby="recently-viewed-heading"
    >
      <SectionHeading title="Recently viewed" />
      <div className="grid-products" id="recently-viewed-heading">
        {items.map((item) => (
          <WatchCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
