"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CodOrderModal } from "@/components/cart/CodOrderModal";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/data";

export function CartDrawer() {
  const { cart, loading, isOpen, closeCart, updateLine, removeLine } = useCart();
  const [codOpen, setCodOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCodOpen(false);
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lines = cart?.lines ?? [];
  const empty = lines.length === 0;
  const subtotal = lines.reduce(
    (sum, line) => sum + parseFloat(line.price) * line.quantity,
    0
  );
  const currencyCode = lines[0]?.currencyCode ?? "PKR";

  return (
    <>
      <div className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
        <button
          type="button"
          className="cart-drawer__backdrop"
          aria-label="Close cart"
          onClick={closeCart}
        />
        <div className="cart-drawer__panel">
          <div className="cart-drawer__header">
            <div>
              <p className="type-micro text-[var(--color-mute)]">Shopping</p>
              <h2 id="cart-drawer-title" className="type-heading-lg mt-1">
                Your Cart
              </h2>
              {!empty && (
                <p className="type-caption-md mt-1 text-[var(--color-mute)]">
                  {cart?.totalQuantity} item{cart?.totalQuantity === 1 ? "" : "s"}
                </p>
              )}
            </div>
            <button
              type="button"
              className="cod-modal__close"
              onClick={closeCart}
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          <div className="cart-drawer__body">
            {loading && empty ? (
              <p className="type-caption-md text-[var(--color-mute)]">Loading…</p>
            ) : empty ? (
              <div className="py-10 text-center">
                <p className="type-body-strong">Your cart is empty</p>
                <p className="type-caption-md mt-2 text-[var(--color-mute)]">
                  Add a watch to continue.
                </p>
                <Button variant="secondary" className="mt-6" onClick={closeCart}>
                  Continue shopping
                </Button>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: "var(--color-hairline)" }}>
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-3 py-4">
                    <Link
                      href={`/products/${line.handle}`}
                      className="w-20 h-20 product-card-image relative overflow-hidden shrink-0"
                      onClick={closeCart}
                    >
                      {line.imageUrl ? (
                        <Image
                          src={line.imageUrl}
                          alt={line.title}
                          fill
                          sizes="80px"
                          className="object-contain product-image-fit"
                        />
                      ) : null}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${line.handle}`}
                        className="type-body-strong line-clamp-2"
                        onClick={closeCart}
                      >
                        {line.title}
                      </Link>
                      <p className="type-caption-md mt-1">
                        {formatPrice(line.price, "checkout", line.currencyCode)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <label className="type-caption-sm uppercase text-[var(--color-mute)]">
                          Qty
                          <select
                            className="ml-2 h-8 px-2 border border-[var(--color-hairline)] bg-[var(--color-canvas)]"
                            value={line.quantity}
                            onChange={(event) =>
                              updateLine(line.id, Number(event.target.value))
                            }
                          >
                            {[1, 2, 3, 4, 5].map((qty) => (
                              <option key={qty} value={qty}>
                                {qty}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          className="type-caption-sm underline text-[var(--color-mute)]"
                          onClick={() => removeLine(line.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!empty && (
            <div className="cart-drawer__footer">
              <div className="flex items-baseline justify-between gap-4">
                <p className="type-caption-sm uppercase text-[var(--color-mute)]">Subtotal</p>
                <p className="type-heading-lg">
                  {new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: currencyCode,
                    maximumFractionDigits: 0,
                  }).format(subtotal)}
                </p>
              </div>
              <p className="type-caption-sm mt-2 text-[var(--color-mute)]">
                Cash on Delivery available across Pakistan
              </p>
              <Button
                variant="primary"
                className="w-full mt-5"
                onClick={() => setCodOpen(true)}
              >
                Buy with COD
              </Button>
              {cart?.checkoutUrl ? (
                <a
                  href={cart.checkoutUrl}
                  className="type-caption-sm mt-3 block text-center underline underline-offset-2 text-[var(--color-mute)]"
                >
                  Or continue to prepaid checkout
                </a>
              ) : null}
              <Link
                href="/cart"
                className="type-caption-sm mt-3 block text-center text-[var(--color-mute)]"
                onClick={closeCart}
              >
                View full cart
              </Link>
            </div>
          )}
        </div>
      </div>

      <CodOrderModal
        open={codOpen}
        onClose={() => setCodOpen(false)}
      />
    </>
  );
}
