"use client";

import { useState, type ReactNode } from "react";

export function ProductDisclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="disclosure-row type-body-strong w-full text-left bg-transparent border-0"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span aria-hidden="true">{open ? "–" : "›"}</span>
      </button>
      {open && (
        <div className="pb-5 type-caption-md text-[var(--color-charcoal)] whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  );
}
