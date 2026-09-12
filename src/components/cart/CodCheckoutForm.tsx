"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";

const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Other",
];

const fieldClass =
  "w-full h-12 px-4 border border-[var(--color-hairline)] bg-[var(--color-canvas)] type-body-strong focus:outline-none focus:border-[var(--color-ink)]";

export function CodCheckoutForm({ checkoutUrl }: { checkoutUrl: string }) {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  return (
    <div
      className="mt-10 p-6 sm:p-8"
      style={{
        border: "1px solid var(--color-hairline)",
        background: "var(--color-soft-cloud)",
      }}
    >
      <p className="type-micro text-[var(--color-mute)]">Payment</p>
      <h2 className="type-heading-lg mt-2">Cash on Delivery</h2>
      <p className="type-caption-md mt-2 text-[var(--color-charcoal)]">
        Pay in cash when your watch arrives. No Shopify checkout step — your order is placed
        here.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!cart?.id) {
            setStatus("error");
            setError("Cart not ready. Refresh and try again.");
            return;
          }

          setStatus("loading");
          setError("");

          const form = event.currentTarget;
          const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

          try {
            const response = await fetch("/api/cod-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cartId: cart.id,
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                city: data.city,
                address: data.address,
                notes: data.notes,
              }),
            });

            const json = (await response.json()) as {
              error?: string;
              orderName?: string;
            };

            if (!response.ok || !json.orderName) {
              throw new Error(json.error ?? "Could not place COD order");
            }

            clearCart();
            router.push(
              `/order/confirmation?order=${encodeURIComponent(json.orderName)}&payment=cod`
            );
          } catch (submitError) {
            setStatus("error");
            setError(
              submitError instanceof Error ? submitError.message : "Could not place COD order"
            );
          }
        }}
      >
        <div>
          <label htmlFor="cod-fullName" className="type-caption-sm block mb-2 uppercase">
            Full name
          </label>
          <input
            id="cod-fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
            style={{ borderRadius: "var(--radius-md)" }}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cod-phone" className="type-caption-sm block mb-2 uppercase">
              Phone
            </label>
            <input
              id="cod-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="03XX XXXXXXX"
              className={fieldClass}
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </div>
          <div>
            <label htmlFor="cod-email" className="type-caption-sm block mb-2 uppercase">
              Email <span className="normal-case text-[var(--color-mute)]">(optional)</span>
            </label>
            <input
              id="cod-email"
              name="email"
              type="email"
              autoComplete="email"
              className={fieldClass}
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cod-city" className="type-caption-sm block mb-2 uppercase">
            City
          </label>
          <select
            id="cod-city"
            name="city"
            required
            defaultValue=""
            className={fieldClass}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <option value="" disabled>
              Select city
            </option>
            {PAKISTAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cod-address" className="type-caption-sm block mb-2 uppercase">
            Delivery address
          </label>
          <textarea
            id="cod-address"
            name="address"
            required
            rows={3}
            autoComplete="street-address"
            className="w-full p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)]"
            style={{ borderRadius: "var(--radius-md)" }}
          />
        </div>

        <div>
          <label htmlFor="cod-notes" className="type-caption-sm block mb-2 uppercase">
            Order notes <span className="normal-case text-[var(--color-mute)]">(optional)</span>
          </label>
          <textarea
            id="cod-notes"
            name="notes"
            rows={2}
            className="w-full p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)]"
            style={{ borderRadius: "var(--radius-md)" }}
          />
        </div>

        {status === "error" && error ? (
          <p className="type-caption-md text-[var(--color-sale)]">{error}</p>
        ) : null}

        <Button type="submit" variant="primary" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Placing COD order…" : "Place order with COD"}
        </Button>

        <p className="type-caption-sm text-center text-[var(--color-mute)]">
          Prefer card / bank transfer?{" "}
          <a href={checkoutUrl} className="underline underline-offset-2 text-[var(--color-ink)]">
            Continue to prepaid checkout
          </a>
        </p>
      </form>
    </div>
  );
}
