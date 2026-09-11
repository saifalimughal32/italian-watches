"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";

export function AddToCartButton({
  variantId,
  className,
  showMessage = true,
  label = "Add to Bag",
}: {
  variantId?: string;
  className?: string;
  showMessage?: boolean;
  label?: string;
}) {
  const { addItem } = useCart();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  if (!variantId) {
    return (
      <div>
        <Button variant="primary" className={className} disabled>
          Unavailable
        </Button>
        {showMessage && (
          <p className="type-caption-md mt-3 text-[var(--color-mute)]">
            No purchasable variant found for this product.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="primary"
        className={className}
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setMessage("");
          try {
            await addItem(variantId, 1);
            setMessage("Added to bag");
          } catch (error) {
            setMessage(
              error instanceof Error ? error.message : "Could not add to bag"
            );
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "Adding..." : label}
      </Button>
      {showMessage && message && (
        <p
          className={`type-caption-md mt-3 ${
            message === "Added to bag"
              ? "text-[var(--color-success)]"
              : "text-[var(--color-sale)]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
