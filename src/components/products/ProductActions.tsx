"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

export function ProductActions({
  handle,
  variantId,
  isEnquiry,
  contactHref,
}: {
  handle: string;
  variantId?: string;
  isEnquiry: boolean;
  contactHref?: string;
}) {
  return (
    <div className="mt-8 flex items-start gap-3">
      <div className="flex-1">
        {isEnquiry ? (
          <Button variant="primary" href={contactHref} className="w-full">
            Request Availability
          </Button>
        ) : (
          <AddToCartButton variantId={variantId} className="w-full" />
        )}
      </div>
      <WishlistButton handle={handle} />
    </div>
  );
}
