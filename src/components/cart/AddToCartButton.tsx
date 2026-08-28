"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";

export function AddToCartButton({
  variantId,
  className,
}: {
  variantId?: string;
  className?: string;
}) {
  const { addItem, loading } = useCart();
  const [message, setMessage] = useState("");

  if (!variantId) return null;

  return (
    <div>
      <Button
        variant="primary"
        className={className}
        disabled={loading}
        onClick={async () => {
          try {
            await addItem(variantId, 1);
            setMessage("Added to bag");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Could not add to bag");
          }
        }}
      >
        {loading ? "Adding..." : "Add to Bag"}
      </Button>
      {message && <p className="type-caption-md mt-3 text-[var(--color-mute)]">{message}</p>}
    </div>
  );
}
