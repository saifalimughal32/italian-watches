"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm({
  defaultReference = "",
  defaultProduct = "",
}: {
  defaultReference?: string;
  defaultProduct?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  return (
    <form
      className="mt-10 space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("loading");
        setError("");

        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const json = (await response.json()) as { error?: string };
          if (!response.ok) {
            throw new Error(json.error ?? "Could not submit enquiry");
          }

          setStatus("success");
          form.reset();
        } catch (submitError) {
          setStatus("error");
          setError(submitError instanceof Error ? submitError.message : "Could not submit enquiry");
        }
      }}
    >
      {[
        { id: "name", label: "Name", type: "text" },
        { id: "email", label: "Email", type: "email" },
        { id: "phone", label: "Phone", type: "tel" },
        { id: "reference", label: "Reference", type: "text", defaultValue: defaultReference },
        { id: "product", label: "Watch", type: "text", defaultValue: defaultProduct },
      ].map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="type-caption-sm block mb-2 uppercase">
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            defaultValue={field.defaultValue}
            className="w-full h-12 px-4 border border-[var(--color-hairline)] bg-[var(--color-canvas)] type-body-strong focus:outline-none focus:border-[var(--color-ink)]"
            style={{ borderRadius: "var(--radius-md)" }}
            required={field.id === "name" || field.id === "email"}
          />
        </div>
      ))}
      <div>
        <label htmlFor="message" className="type-caption-sm block mb-2 uppercase">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)]"
          style={{ borderRadius: "var(--radius-md)" }}
        />
      </div>
      <Button type="submit" variant="primary" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Enquiry"}
      </Button>
      {status === "success" && (
        <p className="type-caption-md text-[var(--color-success)]">
          Thank you. Our private client team will respond within 24 hours.
        </p>
      )}
      {error && <p className="type-caption-md text-[var(--color-sale)]">{error}</p>}
    </form>
  );
}
