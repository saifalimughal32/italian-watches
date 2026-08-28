import type { WatchProduct } from "./types";

export function getProductDisplay(product: WatchProduct) {
  const parts = product.title.split("·").map((p) => p.trim());
  const line = product.metafields.line.replace(/-/g, " ");
  const lineTitle = line.replace(/\b\w/g, (c) => c.toUpperCase());

  const modelName =
    parts.length >= 3
      ? parts.slice(1, -1).join(" ")
      : parts[parts.length - 1] ?? product.title;

  const subtitle = [
    lineTitle,
    `${product.metafields.case_size_mm}mm`,
    product.metafields.movement,
  ].join(" · ");

  return { modelName, subtitle, reference: product.metafields.reference_number };
}
