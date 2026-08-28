import { brandsFromProducts, mergeBrands, vendorToBrand } from "./brands";
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
import { slugify } from "./utils";

export async function getBrands(): Promise<Brand[]> {
  if (!isShopifyConfigured()) return mockBrands;

  try {
    const [metaBrands, products] = await Promise.all([fetchBrands(), fetchAllProducts()]);
    const derived = brandsFromProducts(products);
    const merged = mergeBrands(metaBrands, derived);
    return merged.length ? merged : mockBrands;
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
  return (
    brands.find((brand) => brand.handle === handle) ??
    brands.find((brand) => slugify(brand.name) === handle)
  );
}

export async function getProductsByBrand(brandName: string): Promise<WatchProduct[]> {
  const products = await getProducts();
  return products.filter((product) => product.vendor === brandName);
}

function productMatchesCollection(handle: string, product: WatchProduct) {
  const price = parseFloat(product.price);
  const filters: Record<string, (item: WatchProduct) => boolean> = {
    all: () => true,
    "tissot-prx": (item) =>
      item.metafields.line === "prx" || item.title.toLowerCase().includes("prx"),
    "mens-watches": (item) =>
      ["men", "unisex"].includes(item.metafields.gender) ||
      item.title.toLowerCase().includes("men"),
    "womens-watches": (item) =>
      ["women", "unisex"].includes(item.metafields.gender) ||
      item.title.toLowerCase().includes("women"),
    "automatic-watches": (item) =>
      item.metafields.movement === "automatic" ||
      item.title.toLowerCase().includes("automatic"),
    "chronograph-watches": (item) =>
      item.metafields.is_chronograph ||
      item.metafields.movement === "chronograph" ||
      item.title.toLowerCase().includes("chronograph"),
    "luxury-watches": (item) => item.metafields.tier === "luxury" || price >= 50000,
    "premium-watches": (item) => item.metafields.tier === "premium" || price < 50000,
    "new-arrivals": (item) => item.tags.includes("new"),
    "best-sellers": (item) => item.tags.includes("bestseller"),
    "limited-editions": (item) => item.tags.includes("limited"),
  };

  const vendorMatch = slugify(product.vendor) === handle;
  if (vendorMatch) return true;

  const filter = filters[handle];
  return filter ? filter(product) : false;
}

export async function getCollectionProducts(handle: string): Promise<{
  title: string;
  description: string;
  products: WatchProduct[];
} | null> {
  if (handle === "all") {
    const products = await getProducts();
    return {
      title: "All Watches",
      description: "Browse our complete catalog.",
      products,
    };
  }

  if (isShopifyConfigured()) {
    try {
      const collection = await fetchCollectionByHandle(handle);
      if (collection && collection.products.length > 0) return collection;
    } catch {
      // fall through
    }
  }

  const products = await getProducts();
  const brand = await getBrand(handle);

  if (brand) {
    const brandProducts = products.filter((product) => product.vendor === brand.name);
    if (brandProducts.length > 0) {
      return {
        title: brand.name,
        description: brand.heritage,
        products: brandProducts,
      };
    }
  }

  const vendorProducts = products.filter((product) => slugify(product.vendor) === handle);
  if (vendorProducts.length > 0) {
    const vendorBrand = vendorToBrand(vendorProducts[0].vendor);
    return {
      title: vendorBrand.name,
      description: vendorBrand.heritage,
      products: vendorProducts,
    };
  }

  const filtered = products.filter((product) => productMatchesCollection(handle, product));
  if (!filtered.length) return null;

  const titles: Record<string, string> = {
    all: "All Watches",
    "tissot-prx": "Tissot PRX",
    "mens-watches": "Men's Watches",
    "womens-watches": "Women's Watches",
    "automatic-watches": "Automatic Watches",
    "chronograph-watches": "Chronograph Watches",
    "luxury-watches": "Luxury Watches",
    "premium-watches": "Premium Watches",
    "new-arrivals": "New Arrivals",
    "best-sellers": "Best Sellers",
    "limited-editions": "Limited Editions",
  };

  const descriptions: Record<string, string> = {
    "tissot-prx": "The icon of accessible Swiss luxury.",
    "luxury-watches": "Haute horology and exceptional complications.",
    "premium-watches": "Swiss precision and everyday elegance.",
  };

  return {
    title: titles[handle] ?? handle.replace(/-/g, " "),
    description: descriptions[handle] ?? "",
    products: filtered,
  };
}

export async function searchCatalog(query: string): Promise<WatchProduct[]> {
  if (!query.trim()) return getProducts();

  if (isShopifyConfigured()) {
    try {
      const results = await searchProducts(query);
      if (results.length) return results;
    } catch {
      // fall through
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
