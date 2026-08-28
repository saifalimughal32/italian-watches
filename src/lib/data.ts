import { mockBrands, mockProducts } from "./mock-data";
import { isShopifyConfigured } from "./shopify/config";
import {
  fetchAllProducts,
  fetchBrands,
  fetchCollectionByHandle,
  fetchProductByHandle,
  searchProducts,
} from "./shopify/queries";
import type { Brand, WatchProduct } from "./types";

export async function getBrands(): Promise<Brand[]> {
  if (!isShopifyConfigured()) return mockBrands;

  try {
    const brands = await fetchBrands();
    return brands.length ? brands : mockBrands;
  } catch {
    return mockBrands;
  }
}

export async function getProducts(): Promise<WatchProduct[]> {
  if (!isShopifyConfigured()) return mockProducts;

  try {
    const products = await fetchAllProducts();
    return products.length ? products : mockProducts;
  } catch {
    return mockProducts;
  }
}

export async function getProduct(handle: string): Promise<WatchProduct | undefined> {
  if (!isShopifyConfigured()) {
    return mockProducts.find((product) => product.handle === handle);
  }

  try {
    const product = await fetchProductByHandle(handle);
    if (product) return product;
  } catch {
    // fall through to mock data
  }

  return mockProducts.find((product) => product.handle === handle);
}

export async function getBrand(handle: string): Promise<Brand | undefined> {
  const brands = await getBrands();
  return brands.find((brand) => brand.handle === handle);
}

export async function getProductsByBrand(brandName: string): Promise<WatchProduct[]> {
  const products = await getProducts();
  return products.filter((product) => product.vendor === brandName);
}

export async function getCollectionProducts(handle: string): Promise<{
  title: string;
  description: string;
  products: WatchProduct[];
} | null> {
  if (isShopifyConfigured()) {
    try {
      const collection = await fetchCollectionByHandle(handle);
      if (collection) return collection;
    } catch {
      // fall through to local filters
    }
  }

  const brand = await getBrand(handle);
  const products = await getProducts();

  if (brand) {
    return {
      title: brand.name,
      description: brand.heritage,
      products: products.filter((product) => product.vendor === brand.name),
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

export async function searchCatalog(query: string): Promise<WatchProduct[]> {
  if (!query.trim()) return getProducts();

  if (isShopifyConfigured()) {
    try {
      const results = await searchProducts(query);
      if (results.length) return results;
    } catch {
      // fall through to local search
    }
  }

  const normalized = query.toLowerCase();
  const products = await getProducts();

  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(normalized) ||
      product.vendor.toLowerCase().includes(normalized) ||
      product.metafields.reference_number.toLowerCase().includes(normalized) ||
      product.metafields.line.toLowerCase().includes(normalized)
  );
}

export function formatPrice(
  price: string,
  purchaseMode: string,
  currencyCode = "USD"
) {
  if (purchaseMode === "enquiry" || parseFloat(price) === 0) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(price));
}

export type { Brand, WatchProduct };
