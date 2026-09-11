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

/** Prefer featured image, otherwise first gallery image. */
export function getProductImage(product: WatchProduct) {
  return product.imageUrl || product.images?.[0];
}

/** Full gallery with featured image first when available. */
export function getProductGallery(product: WatchProduct) {
  if (product.images && product.images.length > 0) return product.images;
  if (product.imageUrl) return [product.imageUrl];
  return [];
}
