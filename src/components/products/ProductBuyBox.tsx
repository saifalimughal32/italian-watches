"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { ProductShareActions } from "@/components/products/ProductShareActions";
import { formatPrice } from "@/lib/data";
import { buildQuickSpecs } from "@/lib/product-specs";
import type { ProductVariant, PurchaseMode, WatchMetafields } from "@/lib/types";

export function ProductBuyBox({
  handle,
  title,
  variants = [],
  initialVariantId,
  isEnquiry,
  contactHref,
  purchaseMode,
  fallbackPrice,
  fallbackCurrency,
  metafields,
}: {
  handle: string;
  title: string;
  variants?: ProductVariant[];
  initialVariantId?: string;
  isEnquiry: boolean;
  contactHref?: string;
  purchaseMode: PurchaseMode;
  fallbackPrice: string;
  fallbackCurrency?: string;
  metafields: WatchMetafields;
}) {
  const options = useMemo(() => variants ?? [], [variants]);
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
  const priceLabel = isEnquiry
    ? "Price on request"
    : formatPrice(price, purchaseMode, currency);

  const quickSpecs = buildQuickSpecs(metafields);

  const primaryCta = isEnquiry ? (
    <Button variant="primary" href={contactHref} className="w-full">
      Enquire
    </Button>
  ) : !canPurchase ? (
    <Button variant="primary" className="w-full" disabled>
      Out of Stock
    </Button>
  ) : (
    <AddToCartButton variantId={selected?.id} className="w-full" />
  );

  const stickyCta = isEnquiry ? (
    <Button variant="primary" href={contactHref} className="w-full">
      Enquire
    </Button>
  ) : !canPurchase ? (
    <Button variant="primary" className="w-full" disabled>
      Out of Stock
    </Button>
  ) : (
    <AddToCartButton
      variantId={selected?.id}
      className="w-full"
      showMessage={false}
    />
  );

  return (
    <div>
      <p className="type-heading-lg mt-6">{priceLabel}</p>

      {metafields.is_limited && (
        <p className="type-micro mt-3 text-[var(--color-accent-gold)]">
          Limited edition
        </p>
      )}

      <div
        className="flex flex-wrap gap-6 py-6 mt-4"
        style={{
          borderTop: "1px solid var(--color-hairline)",
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        {quickSpecs.map(([label, value]) => (
          <div key={label}>
            <span className="type-caption-sm block uppercase text-[var(--color-mute)]">
              {label}
            </span>
            <span className="type-body-strong capitalize">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {showPicker && (
          <div>
            <p className="type-caption-sm uppercase text-[var(--color-mute)] mb-3">
              Select option
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
                    {variant.title === "Default Title" ? "Standard" : variant.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="flex-1">{primaryCta}</div>
          <WishlistButton handle={handle} />
        </div>

        <ProductShareActions
          reference={metafields.reference_number}
          title={title}
        />
      </div>

      <div className="pdp-sticky-atc md:hidden" role="region" aria-label="Quick purchase">
        <div className="pdp-sticky-atc__inner">
          <div className="min-w-0">
            <p className="type-caption-sm text-[var(--color-mute)] truncate">{title}</p>
            <p className="type-body-strong truncate">{priceLabel}</p>
          </div>
          <div className="shrink-0 min-w-[140px]">{stickyCta}</div>
        </div>
      </div>
    </div>
  );
}
