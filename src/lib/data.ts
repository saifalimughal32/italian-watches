import { brandsFromProducts, mergeBrands, vendorToBrand } from "./brands";
import { inferBrandHandle, withResolvedBrand } from "./brand-inference";
import { mockBrands, mockHomepageSlots, mockJournalArticles, mockProducts } from "./mock-data";
import { isShopifyConfigured } from "./shopify/config";
import {
  fetchAllProducts,
  fetchBrands,
  fetchCampaignByHandle,
  fetchCampaigns,
  fetchCollectionByHandle,
  fetchHomepageSlots,
  fetchJournalArticles,
  fetchProductByHandle,
  fetchSpecialists,
  searchProducts,
} from "./shopify/queries";
import type {
  Brand,
  Campaign,
  HomepageSlot,
  JournalArticle,
  Specialist,
  WatchProduct,
} from "./types";
import { slugify } from "./utils";

export async function getBrands(): Promise<Brand[]> {
  if (!isShopifyConfigured()) return mockBrands;

  try {
    const products = await getProducts();
    const productBrandHandles = new Set(
      products.map((product) => inferBrandHandle(product.vendor))
    );

    const catalogBrands = mockBrands.filter((brand) => productBrandHandles.has(brand.handle));
    const [metaBrands] = await Promise.all([fetchBrands()]);
    const derived = brandsFromProducts(products);
    const merged = mergeBrands(metaBrands, [...catalogBrands, ...derived]);

    return merged.length ? merged : mockBrands.filter((brand) => productBrandHandles.has(brand.handle));
  } catch {
    return mockBrands;
  }
}

export async function getProducts(): Promise<WatchProduct[]> {
  if (!isShopifyConfigured()) return mockProducts.map(withResolvedBrand);

  try {
    const products = await fetchAllProducts();
    const resolved = products.map(withResolvedBrand);
    return resolved.length ? resolved : mockProducts.map(withResolvedBrand);
  } catch {
    return mockProducts.map(withResolvedBrand);
  }
}

export async function getProduct(handle: string): Promise<WatchProduct | undefined> {
  if (!isShopifyConfigured()) {
    return mockProducts.find((product) => product.handle === handle);
  }

  try {
    const product = await fetchProductByHandle(handle);
    if (product) return withResolvedBrand(product);
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
  const brand = await getBrand(inferBrandHandle(brandName));
  const targetHandle = brand?.handle ?? inferBrandHandle(brandName);
  const targetName = brand?.name ?? brandName;

  return products.filter(
    (product) =>
      product.vendor === targetName || inferBrandHandle(product.vendor) === targetHandle
  );
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
    "luxury-watches": (item) =>
      item.metafields.tier === "luxury" ||
      item.metafields.tier === "haute" ||
      price >= 50000,
    "premium-watches": (item) => item.metafields.tier === "premium" || price < 50000,
    "new-arrivals": (item) => item.tags.includes("new"),
    "best-sellers": (item) => item.tags.includes("bestseller"),
    "limited-editions": (item) =>
      item.metafields.is_limited || item.tags.includes("limited"),
  };

  const vendorMatch = slugify(product.vendor) === handle || inferBrandHandle(product.vendor) === handle;
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
    const brandProducts = products.filter(
      (product) =>
        product.vendor === brand.name || inferBrandHandle(product.vendor) === brand.handle
    );
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

export async function getHomepageSlots(): Promise<HomepageSlot[]> {
  if (!isShopifyConfigured()) return mockHomepageSlots;

  try {
    const slots = await fetchHomepageSlots();
    return slots.length ? slots : mockHomepageSlots;
  } catch {
    return mockHomepageSlots;
  }
}

export async function getJournalArticles(): Promise<JournalArticle[]> {
  if (!isShopifyConfigured()) return mockJournalArticles;

  try {
    const articles = await fetchJournalArticles();
    return articles.length ? articles : mockJournalArticles;
  } catch {
    return mockJournalArticles;
  }
}

export async function getBrandChapterSlot(
  brands: Brand[]
): Promise<HomepageSlot> {
  const slots = await getHomepageSlots();
  const chapter = slots.find((slot) => slot.kind === "brand_chapter");
  if (chapter) return chapter;

  const brand = brands.find((item) => item.tier === "haute") ?? brands[0] ?? mockBrands[0];
  return {
    kind: "brand_chapter",
    heading: brand.name,
    subheading: brand.tagline,
    image: brand.collectionImage ?? "/images/hero.jpg",
    cta_label: `Explore ${brand.name}`,
    cta_href: `/collections/${brand.collection_handle}`,
    order: 1,
    founded_year: brand.founded_year,
    heritage: brand.heritage,
  };
}

export function formatPrice(
  price: string,
  purchaseMode: string,
  currencyCode = "PKR"
) {
  if (purchaseMode === "enquiry" || parseFloat(price) === 0) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(parseFloat(price));
}

export async function getCampaigns(): Promise<Campaign[]> {
  if (!isShopifyConfigured()) return [];

  try {
    return await fetchCampaigns();
  } catch {
    return [];
  }
}

export async function getCampaign(handle: string): Promise<Campaign | null> {
  if (!isShopifyConfigured()) return null;

  try {
    return await fetchCampaignByHandle(handle);
  } catch {
    return null;
  }
}

export async function getSpecialists(): Promise<Specialist[]> {
  if (!isShopifyConfigured()) return [];

  try {
    return await fetchSpecialists();
  } catch {
    return [];
  }
}

export type { Brand, Campaign, HomepageSlot, JournalArticle, Specialist, WatchProduct };
