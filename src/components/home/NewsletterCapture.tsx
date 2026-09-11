"use client";

import { FormEvent, useState } from "react";

export function NewsletterCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("done");
    setEmail("");
  }

  return (
    <div className="newsletter">
      <p className="type-micro">Join the maison</p>
      <h2 className="type-heading-xl mt-3">Quiet notes from the atelier</h2>
      <p className="type-caption-md mt-3 max-w-md">
        New arrivals, brand chapters, and journal pieces — one thoughtful email at a time.
      </p>
      {status === "done" ? (
        <p className="type-caption-md mt-6 text-[var(--color-success)]" role="status">
          Thank you — you&apos;re on the list.
        </p>
      ) : (
        <form className="newsletter__form" onSubmit={onSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            className="newsletter__input"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
