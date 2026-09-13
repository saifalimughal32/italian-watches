"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CodCheckoutForm } from "@/components/cart/CodCheckoutForm";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/data";

export function CartPageContent() {
  const { cart, loading, updateLine, removeLine } = useCart();
  const [showCodForm, setShowCodForm] = useState(false);

  if (loading && !cart) {
    return (
      <Container>
        <div className="section-rhythm text-center">
          <p className="type-caption-md">Loading your cart...</p>
        </div>
      </Container>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <Container>
        <div className="section-rhythm text-center max-w-lg mx-auto">
          <h1 className="type-heading-xl normal-case">Your Cart</h1>
          <p className="type-caption-md mt-4">Your cart is empty.</p>
          <Button href="/collections/all" variant="primary" className="mt-8">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  const subtotal = cart.lines.reduce(
    (sum, line) => sum + parseFloat(line.price) * line.quantity,
    0
  );
  const currencyCode = cart.lines[0]?.currencyCode ?? "PKR";

  return (
    <Container>
      <div className="section-rhythm max-w-3xl mx-auto">
        <h1 className="type-heading-xl normal-case">Your Cart</h1>
        <p className="type-caption-md mt-2">
          {cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"}
        </p>

        <ul className="mt-10 divide-y" style={{ borderColor: "var(--color-hairline)" }}>
          {cart.lines.map((line) => (
            <li key={line.id} className="flex gap-4 py-6">
              <Link
                href={`/products/${line.handle}`}
                className="w-24 h-24 product-card-image relative overflow-hidden shrink-0"
              >
                {line.imageUrl ? (
                  <Image
                    src={line.imageUrl}
                    alt={line.title}
                    fill
                    sizes="96px"
                    className="object-cover product-image-fit"
                  />
                ) : null}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${line.handle}`} className="type-body-strong line-clamp-2">
                  {line.title}
                </Link>
                <p className="type-caption-md mt-1">
                  {formatPrice(line.price, "checkout", line.currencyCode)}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <label className="type-caption-sm uppercase text-[var(--color-mute)]">
                    Qty
                    <select
                      className="ml-2 h-9 px-2 border border-[var(--color-hairline)] bg-[var(--color-canvas)]"
                      value={line.quantity}
                      onChange={(event) => updateLine(line.id, Number(event.target.value))}
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

        <div
          className="mt-8 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ borderTop: "1px solid var(--color-hairline)" }}
        >
          <div>
            <p className="type-caption-sm uppercase text-[var(--color-mute)]">Subtotal</p>
            <p className="type-heading-lg">
              {new Intl.NumberFormat("en-PK", {
                style: "currency",
                currency: currencyCode,
                maximumFractionDigits: 0,
              }).format(subtotal)}
            </p>
            <p className="type-caption-sm mt-2 text-[var(--color-mute)]">
              Cash on Delivery available across Pakistan
            </p>
          </div>
          {!showCodForm && (
            <Button variant="primary" onClick={() => setShowCodForm(true)}>
              Buy with COD
            </Button>
          )}
        </div>

        {showCodForm ? (
          <CodCheckoutForm checkoutUrl={cart.checkoutUrl} />
        ) : cart.checkoutUrl ? (
          <p className="type-caption-sm mt-6 text-center text-[var(--color-mute)]">
            Prefer card / bank transfer?{" "}
            <a
              href={cart.checkoutUrl}
              className="underline underline-offset-2 text-[var(--color-ink)]"
            >
              Continue to prepaid checkout
            </a>
          </p>
        ) : null}
      </div>
    </Container>
  );
}
