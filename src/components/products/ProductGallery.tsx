"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const gallery = images.length ? images : [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  const current = gallery[active] ?? gallery[0];

  const go = useCallback(
    (delta: number) => {
      if (!gallery.length) return;
      setActive((index) => (index + delta + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  if (!current) {
    return (
      <div className="product-card-image aspect-square relative overflow-hidden">
        <span className="type-caption-sm text-[var(--color-stone)] uppercase">
          Product Image
        </span>
      </div>
    );
  }

  return (
    <div className="pdp-gallery">
      <button
        type="button"
        className="pdp-gallery__main product-card-image aspect-square relative overflow-hidden w-full border-0 p-0 cursor-zoom-in bg-[var(--color-soft-cloud)]"
        onClick={() => setLightbox(true)}
        onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setZoom({ x, y, on: true });
        }}
        aria-label="Open image lightbox"
      >
        <Image
          src={current}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500 ease-out"
          style={{
            transform: zoom.on ? "scale(1.75)" : "scale(1)",
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
            transition: zoom.on
              ? "transform 80ms linear"
              : "transform 500ms ease-out, opacity 500ms ease-out",
          }}
          priority
        />
      </button>

      {gallery.length > 1 && (
        <div className="pdp-gallery__thumbs flex gap-2 mt-3 overflow-x-auto pb-1">
          {gallery.slice(0, 8).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative shrink-0 w-16 h-16 overflow-hidden border bg-[var(--color-soft-cloud)] ${
                index === active
                  ? "border-[var(--color-ink)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active}
            >
              <Image src={image} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="pdp-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Product image gallery"
        >
          <button
            type="button"
            className="pdp-lightbox__backdrop"
            aria-label="Close lightbox"
            onClick={() => setLightbox(false)}
          />
          <div className="pdp-lightbox__stage">
            <Image
              src={gallery[active]}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <button
            type="button"
            className="pdp-lightbox__close type-caption-sm"
            onClick={() => setLightbox(false)}
          >
            Close
          </button>
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                className="pdp-lightbox__nav pdp-lightbox__nav--prev"
                onClick={() => go(-1)}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className="pdp-lightbox__nav pdp-lightbox__nav--next"
                onClick={() => go(1)}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
