"use client";

import { useEffect } from "react";
import { CodCheckoutForm } from "@/components/cart/CodCheckoutForm";
import { useCart } from "@/components/cart/CartProvider";

export function CodOrderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart } = useCart();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="cod-modal" role="dialog" aria-modal="true" aria-labelledby="cod-modal-title">
      <button type="button" className="cod-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="cod-modal__panel">
        <div className="cod-modal__header">
          <div>
            <p className="type-micro text-[var(--color-mute)]">Cash on Delivery</p>
            <h2 id="cod-modal-title" className="type-heading-lg mt-1">
              Place your order
            </h2>
          </div>
          <button type="button" className="cod-modal__close" onClick={onClose} aria-label="Close form">
            ×
          </button>
        </div>
        <p className="type-caption-md mt-2 text-[var(--color-charcoal)]">
          Fill your details and place the order. You’ll get a confirmation message right away.
        </p>
        <div className="cod-modal__body">
          <CodCheckoutForm
            checkoutUrl={cart?.checkoutUrl}
            compact
            onSuccess={() => onClose()}
          />
        </div>
      </div>
    </div>
  );
}
