import type { WatchProduct } from "./types";

export function getProductDisplay(product: WatchProduct) {
  const parts = product.title.split("·").map((part) => part.trim());
  const line = product.metafields.line.replace(/-/g, " ");
  const lineTitle = line ? line.replace(/\b\w/g, (char) => char.toUpperCase()) : "";

  const modelName =
    parts.length >= 3 ? parts.slice(1, -1).join(" ") : (parts[parts.length - 1] ?? product.title);

  const subtitleParts = [
    lineTitle,
    product.metafields.case_size_mm ? `${product.metafields.case_size_mm}mm` : "",
    product.metafields.movement,
  ].filter(Boolean);

  return {
    modelName,
    subtitle: subtitleParts.join(" · "),
    reference: product.metafields.reference_number,
  };
}
