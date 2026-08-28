"use client";

import { useMemo, useState } from "react";
import { WatchCard } from "@/components/WatchCard";
import type { WatchProduct } from "@/lib/types";

const PAGE_SIZE = 24;

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function CollectionGrid({ products }: { products: WatchProduct[] }) {
  const [sort, setSort] = useState<SortOption>("featured");
  const [tier, setTier] = useState<"all" | "luxury" | "premium">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let items = [...products];

    if (tier !== "all") {
      items = items.filter((product) => product.metafields.tier === tier);
    }

    switch (sort) {
      case "price-asc":
        items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name":
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return items;
  }, [products, sort, tier]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <p className="type-caption-md">{filtered.length} watches</p>
        <div className="flex flex-wrap gap-3">
          <label className="type-caption-sm uppercase text-[var(--color-mute)]">
            Tier
            <select
              className="ml-2 h-9 px-2 border border-[var(--color-hairline)] bg-[var(--color-canvas)]"
              value={tier}
              onChange={(event) => {
                setTier(event.target.value as typeof tier);
                setPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="luxury">Luxury</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <label className="type-caption-sm uppercase text-[var(--color-mute)]">
            Sort
            <select
              className="ml-2 h-9 px-2 border border-[var(--color-hairline)] bg-[var(--color-canvas)]"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortOption);
                setPage(1);
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid-products">
        {pageItems.map((product) => (
          <WatchCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            type="button"
            className="btn-secondary"
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Previous
          </button>
          <span className="type-caption-md">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="btn-secondary"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
