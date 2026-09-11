import { mockBrands } from "./mock-data";
import type { Brand, WatchProduct } from "./types";
import { slugify } from "./utils";

const LOGO_MAP: Record<string, string> = {
  rolex: "/brands/rolex.png",
};

export function vendorToBrand(vendor: string): Brand {
  const handle = slugify(vendor);
  const known = mockBrands.find(
    (brand) => brand.handle === handle || brand.name.toLowerCase() === vendor.toLowerCase()
  );

  if (known) return known;

  const words = vendor.trim().split(/\s+/);
  const displayLines =
    words.length <= 1
      ? [vendor]
      : [
          words.slice(0, Math.ceil(words.length / 2)).join(" "),
          words.slice(Math.ceil(words.length / 2)).join(" "),
        ];

  return {
    handle,
    name: vendor,
    displayLines,
    tier: "premium",
    enquiry_only: false,
    tagline: `Explore ${vendor}`,
    heritage: `Curated timepieces from ${vendor}.`,
    collection_handle: handle,
    logo: LOGO_MAP[handle],
  };
}

export function brandsFromProducts(products: WatchProduct[]): Brand[] {
  const vendors = [...new Set(products.map((product) => product.vendor).filter(Boolean))];
  return vendors.map(vendorToBrand);
}

export function mergeBrands(primary: Brand[], fallback: Brand[]) {
  const map = new Map<string, Brand>();
  for (const brand of fallback) map.set(brand.handle, brand);
  for (const brand of primary) map.set(brand.handle, brand);
  return [...map.values()];
}
