"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { formatPrice } from "@/lib/data";
import type { ProductVariant, PurchaseMode } from "@/lib/types";

function usableVariants(variants?: ProductVariant[]) {
  if (!variants?.length) return [];
  // Hide single default Shopify variant from the picker UI
  if (variants.length === 1 && variants[0].title === "Default Title") {
    return variants;
  }
  return variants;
}

export function ProductActions({
  handle,
  variants = [],
  initialVariantId,
  isEnquiry,
  contactHref,
  purchaseMode,
  fallbackPrice,
  fallbackCurrency,
}: {
  handle: string;
  variants?: ProductVariant[];
  initialVariantId?: string;
  isEnquiry: boolean;
  contactHref?: string;
  purchaseMode: PurchaseMode;
  fallbackPrice: string;
  fallbackCurrency?: string;
}) {
  const options = useMemo(() => usableVariants(variants), [variants]);
  const showPicker = options.length > 1;

  const [selectedId, setSelectedId] = useState(
    () =>
      initialVariantId ||
      options.find((variant) => variant.availableForSale)?.id ||
      options[0]?.id
  );

  const selected =
    options.find((variant) => variant.id === selectedId) ?? options[0];

  const price = selected?.price ?? fallbackPrice;
  const currency = selected?.currencyCode ?? fallbackCurrency;
  const canPurchase = Boolean(selected?.id) && (selected?.availableForSale ?? true);

  return (
    <div className="mt-8 space-y-5">
      {showPicker && (
        <div>
          <p className="type-caption-sm uppercase text-[var(--color-mute)] mb-3">
            Select variant
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((variant) => {
              const active = variant.id === selected?.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!variant.availableForSale}
                  onClick={() => setSelectedId(variant.id)}
                  className={`type-caption-sm px-4 h-10 border transition-opacity ${
                    active
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-on-primary)]"
                      : "border-[var(--color-hairline)] bg-[var(--color-canvas)] text-[var(--color-ink)]"
                  } ${variant.availableForSale ? "" : "opacity-40 cursor-not-allowed"}`}
                >
                  {variant.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!isEnquiry && (
        <p className="type-heading-lg">
          {formatPrice(price, purchaseMode, currency)}
        </p>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-1">
          {isEnquiry ? (
            <Button variant="primary" href={contactHref} className="w-full">
              Request Availability
            </Button>
          ) : !canPurchase ? (
            <Button variant="primary" className="w-full" disabled>
              Out of Stock
            </Button>
          ) : (
            <AddToCartButton variantId={selected?.id} className="w-full" />
          )}
        </div>
        <WishlistButton handle={handle} />
      </div>
    </div>
  );
}
