/**
 * Serve Shopify images from Shopify's CDN with width params.
 * Avoids the slow Vercel/Next image optimizer round-trip for large phone photos.
 * Local /public assets keep using the default Next optimizer.
 */
export default function shopifyImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const q = quality ?? 75;

  if (src.startsWith("/")) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  try {
    const url = new URL(src);
    const host = url.hostname;
    if (
      host === "cdn.shopify.com" ||
      host.endsWith(".shopify.com") ||
      host.includes("shopifycdn")
    ) {
      url.searchParams.set("width", String(Math.min(width, 1600)));
      url.searchParams.set("quality", String(q));
      return url.toString();
    }
  } catch {
    // fall through
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
