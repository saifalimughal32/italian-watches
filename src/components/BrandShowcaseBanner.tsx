"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type BrandShowcaseSlide = {
  name: string;
  href: string;
  image: string;
};

const panelRoles = ["left", "center", "right"] as const;

export function BrandShowcaseBanner({ slides }: { slides: BrandShowcaseSlide[] }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const count = slides.length;
  if (count === 0) return null;

  const visible = [0, 1, 2].map((offset) => slides[(index + offset) % count]);

  function go(direction: -1 | 1) {
    if (animating || count < 2) return;
    setAnimating(true);
    setIndex((current) => (current + direction + count) % count);
  }

  useEffect(() => {
    if (!animating) return;
    const timer = window.setTimeout(() => setAnimating(false), 420);
    return () => window.clearTimeout(timer);
  }, [animating, index]);

  return (
    <section className="brand-showcase" aria-label="Premium watches by brand">
      <button
        type="button"
        className="brand-showcase__nav brand-showcase__nav--prev"
        aria-label="Previous brands"
        onClick={() => go(-1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5L8 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`brand-showcase__stage${animating ? " is-animating" : ""}`}>
        {visible.map((slide, position) => {
          const role = panelRoles[position];
          return (
            <Link
              key={`${slide.href}-${role}-${index}`}
              href={slide.href}
              className={`brand-showcase__panel brand-showcase__panel--${role}`}
              aria-label={`Shop ${slide.name} collection`}
            >
              <span className="brand-showcase__curve" aria-hidden="true" />
              <span className="brand-showcase__watch">
                <Image
                  src={slide.image}
                  alt={`${slide.name} premium watch`}
                  fill
                  sizes="(max-width: 768px) 70vw, 33vw"
                  className="object-cover"
                  priority={position === 1}
                />
              </span>
              <span className="brand-showcase__label">{slide.name}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="brand-showcase__nav brand-showcase__nav--next"
        aria-label="Next brands"
        onClick={() => go(1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
