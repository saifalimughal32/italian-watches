"use client";

import { useState } from "react";

export function ProductShareActions({
  reference,
  title,
}: {
  reference?: string;
  title: string;
}) {
  const [copied, setCopied] = useState<"ref" | "link" | null>(null);

  async function copy(text: string, kind: "ref" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {reference && (
        <button
          type="button"
          className="type-caption-sm uppercase tracking-wide text-[var(--color-mute)] hover:text-[var(--color-ink)] bg-transparent border-0 p-0 cursor-pointer"
          onClick={() => copy(reference, "ref")}
        >
          {copied === "ref" ? "Reference copied" : "Copy reference"}
        </button>
      )}
      <button
        type="button"
        className="type-caption-sm uppercase tracking-wide text-[var(--color-mute)] hover:text-[var(--color-ink)] bg-transparent border-0 p-0 cursor-pointer"
        onClick={() => {
          const url = typeof window !== "undefined" ? window.location.href : "";
          if (navigator.share) {
            void navigator.share({ title, url }).catch(() => copy(url, "link"));
          } else {
            void copy(url, "link");
          }
        }}
      >
        {copied === "link" ? "Link copied" : "Share"}
      </button>
    </div>
  );
}
