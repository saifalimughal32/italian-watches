import { mockBrands, mockProducts } from "./mock-data";
import type { Brand, WatchProduct } from "./types";

export const brands = mockBrands;
export const products = mockProducts;

export function getBrand(handle: string) {
  return brands.find((brand) => brand.handle === handle);
}

export function getProduct(handle: string) {
  return products.find((product) => product.handle === handle);
}

export function getProductsByBrand(brandName: string) {
  return products.filter((product) => product.vendor === brandName);
}

export function getProductsByLine(line: string) {
  return products.filter((product) => product.metafields.line === line);
}

export function getCollectionProducts(handle: string): {
  title: string;
  description: string;
  products: WatchProduct[];
} | null {
  const brand = getBrand(handle);

  if (brand) {
    return {
      title: brand.name,
      description: brand.heritage,
      products: getProductsByBrand(brand.name),
    };
  }

  const filters: Record<string, (product: WatchProduct) => boolean> = {
    "tissot-prx": (product) => product.metafields.line === "prx",
    "mens-watches": (product) =>
      ["men", "unisex"].includes(product.metafields.gender),
    "womens-watches": (product) =>
      ["women", "unisex"].includes(product.metafields.gender),
    "automatic-watches": (product) => product.metafields.movement === "automatic",
    "chronograph-watches": (product) =>
      product.metafields.is_chronograph ||
      product.metafields.movement === "chronograph",
    "luxury-watches": (product) => product.metafields.tier === "luxury",
    "premium-watches": (product) => product.metafields.tier === "premium",
    "new-arrivals": (product) => product.tags.includes("new"),
    "best-sellers": (product) => product.tags.includes("bestseller"),
  };

  const filter = filters[handle];
  if (!filter) return null;

  const titles: Record<string, string> = {
    "tissot-prx": "Tissot PRX",
    "mens-watches": "Men's Watches",
    "womens-watches": "Women's Watches",
    "automatic-watches": "Automatic Watches",
    "chronograph-watches": "Chronograph Watches",
    "luxury-watches": "Luxury Watches",
    "premium-watches": "Premium Watches",
    "new-arrivals": "New Arrivals",
    "best-sellers": "Best Sellers",
  };

  const descriptions: Record<string, string> = {
    "tissot-prx": "The icon of accessible Swiss luxury.",
  };

  return {
    title: titles[handle] ?? handle.replace(/-/g, " "),
    description: descriptions[handle] ?? "",
    products: products.filter(filter),
  };
}

export function searchCatalog(query: string) {
  if (!query.trim()) return products;

  const normalized = query.toLowerCase();

  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(normalized) ||
      product.vendor.toLowerCase().includes(normalized) ||
      product.metafields.reference_number.toLowerCase().includes(normalized) ||
      product.metafields.line.toLowerCase().includes(normalized)
  );
}

export function formatPrice(price: string, purchaseMode: string, currencyCode = "USD") {
  if (purchaseMode === "enquiry" || parseFloat(price) === 0) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(price));
}

export type { Brand, WatchProduct };
