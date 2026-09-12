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

/** Exclude Shopify service/add-on SKUs (Route, shipping insurance, etc.). */
export function isWatchCatalogProduct(
  product: Pick<WatchProduct, "title" | "handle" | "vendor" | "tags">
) {
  const text = [
    product.title,
    product.handle,
    product.vendor,
    ...(product.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const blocked = [
    "shipping protection",
    "package protection",
    "order protection",
    "route protection",
    "shipping-protection",
    "package-protection",
    "order-protection",
  ];

  return !blocked.some((term) => text.includes(term));
}

function onlyWatches(products: WatchProduct[]) {
  return products.filter(isWatchCatalogProduct);
}

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
  if (!isShopifyConfigured()) return onlyWatches(mockProducts.map(withResolvedBrand));

  try {
    const products = await fetchAllProducts();
    const resolved = onlyWatches(products.map(withResolvedBrand));
    return resolved.length ? resolved : onlyWatches(mockProducts.map(withResolvedBrand));
  } catch {
    return onlyWatches(mockProducts.map(withResolvedBrand));
  }
}

export async function getProduct(handle: string): Promise<WatchProduct | undefined> {
  if (!isShopifyConfigured()) {
    return onlyWatches(
      mockProducts.filter((product) => product.handle === handle).map(withResolvedBrand)
    )[0];
  }

  try {
    const product = await fetchProductByHandle(handle);
    if (product) {
      const resolved = withResolvedBrand(product);
      return isWatchCatalogProduct(resolved) ? resolved : undefined;
    }
  } catch {
    // fall through to mock data
  }

  return onlyWatches(
    mockProducts.filter((product) => product.handle === handle).map(withResolvedBrand)
  )[0];
}

export async function getBrand(handle: string): Promise<Brand | undefined> {
  const brands = await getBrands();
  return (
    brands.find((brand) => brand.handle === handle) ??
    brands.find((brand) => slugify(brand.name) === handle)
  );
}

function productBelongsToBrand(
  product: WatchProduct,
  brand: Pick<Brand, "handle" | "name">
) {
  const resolved = withResolvedBrand(product);
  return (
    resolved.vendor === brand.name ||
    inferBrandHandle(resolved.vendor) === brand.handle ||
    slugify(resolved.vendor) === brand.handle
  );
}

export async function getProductsByBrand(brandName: string): Promise<WatchProduct[]> {
  const products = await getProducts();
  const brand = await getBrand(inferBrandHandle(brandName));
  const target = brand ?? {
    handle: inferBrandHandle(brandName),
    name: brandName,
  };

  return products.filter((product) => productBelongsToBrand(product, target));
}

const COLLECTION_FILTERS: Record<string, (item: WatchProduct) => boolean> = {
  all: () => true,
  "tissot-prx": (item) => {
    const resolved = withResolvedBrand(item);
    const isTissot = inferBrandHandle(resolved.vendor) === "tissot";
    return (
      isTissot &&
      (item.metafields.line === "prx" || item.title.toLowerCase().includes("prx"))
    );
  },
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
  "luxury-watches": (item) => {
    const price = parseFloat(item.price);
    return (
      item.metafields.tier === "luxury" ||
      item.metafields.tier === "haute" ||
      price >= 50000
    );
  },
  "premium-watches": (item) => {
    const price = parseFloat(item.price);
    return item.metafields.tier === "premium" || price < 50000;
  },
  "new-arrivals": (item) =>
    item.tags.some((tag) =>
      ["new", "new-arrival", "new arrivals", "featured"].includes(tag.toLowerCase())
    ),
  "best-sellers": (item) =>
    item.tags.some((tag) =>
      ["bestseller", "best-seller", "best seller", "featured"].includes(tag.toLowerCase())
    ),
  "limited-editions": (item) =>
    item.metafields.is_limited ||
    item.tags.some((tag) => tag.toLowerCase().includes("limited")),
};

const CURATED_COLLECTIONS: Record<string, { title: string; description: string }> = {
  all: { title: "All Watches", description: "Browse our complete catalog." },
  "tissot-prx": {
    title: "Tissot PRX",
    description: "The icon of accessible Swiss luxury.",
  },
  "mens-watches": {
    title: "Men's Watches",
    description: "References sized and styled for everyday wear.",
  },
  "womens-watches": {
    title: "Women's Watches",
    description: "Elegant proportions and refined dials.",
  },
  "automatic-watches": {
    title: "Automatic Watches",
    description: "Self-winding movements for collectors and daily wear.",
  },
  "chronograph-watches": {
    title: "Chronograph Watches",
    description: "Sport complications with precision timing.",
  },
  "luxury-watches": {
    title: "Luxury Watches",
    description: "Haute horology and exceptional complications.",
  },
  "premium-watches": {
    title: "Premium Watches",
    description: "Swiss precision and everyday elegance.",
  },
  "new-arrivals": {
    title: "New Arrivals",
    description: "Fresh references just added to the maison.",
  },
  "best-sellers": {
    title: "Best Sellers",
    description: "The pieces collectors ask for most.",
  },
  "limited-editions": {
    title: "Limited Editions",
    description: "Scarce references with clear provenance.",
  },
};

function productMatchesCollection(handle: string, product: WatchProduct) {
  const resolved = withResolvedBrand(product);
  const vendorMatch =
    slugify(resolved.vendor) === handle ||
    inferBrandHandle(resolved.vendor) === handle;
  if (vendorMatch) return true;

  const filter = COLLECTION_FILTERS[handle];
  return filter ? filter(product) : false;
}

function curatedCollectionFallback(handle: string, products: WatchProduct[]) {
  const matched = products.filter((product) => productMatchesCollection(handle, product));
  if (matched.length) return matched;

  // Nav collections should never 404 when tags are missing in Shopify.
  if (handle === "new-arrivals" || handle === "best-sellers") {
    return products.slice(0, 24);
  }

  return matched;
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

  const curated = CURATED_COLLECTIONS[handle];

  if (isShopifyConfigured()) {
    try {
      const collection = await fetchCollectionByHandle(handle);
      if (collection && collection.products.length > 0) {
        let products = onlyWatches(collection.products.map(withResolvedBrand));
        const brand = await getBrand(handle);

        // Brand collections: filter by resolved brand so Shopify mis-tags
        // (e.g. Rolex inside Tissot) never leak through.
        if (brand) {
          products = products.filter((product) => productBelongsToBrand(product, brand));
          if (products.length > 0) {
            return {
              title: brand.name,
              description: collection.description || brand.heritage,
              products,
            };
          }
        } else if (curated) {
          // Trust Shopify membership for curated nav collections so missing
          // local tags don't empty New Arrivals / Best Sellers.
          return {
            title: collection.title || curated.title,
            description: collection.description || curated.description,
            products,
          };
        } else {
          return {
            ...collection,
            products,
          };
        }
      }
    } catch {
      // fall through
    }
  }

  const products = await getProducts();
  const brand = await getBrand(handle);

  if (brand) {
    const brandProducts = products.filter((product) =>
      productBelongsToBrand(product, brand)
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

  if (curated) {
    return {
      title: curated.title,
      description: curated.description,
      products: curatedCollectionFallback(handle, products),
    };
  }

  return null;
}

export async function searchCatalog(query: string): Promise<WatchProduct[]> {
  if (!query.trim()) return getProducts();

  if (isShopifyConfigured()) {
    try {
      const results = onlyWatches(await searchProducts(query));
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
  const curatedHeroes = Object.fromEntries(
    mockJournalArticles.map((article) => [article.slug, article.hero])
  );

  const withPremiumHero = (article: JournalArticle): JournalArticle => ({
    ...article,
    hero: curatedHeroes[article.slug] ?? article.hero,
  });

  if (!isShopifyConfigured()) return mockJournalArticles;

  try {
    const articles = await fetchJournalArticles();
    if (!articles.length) return mockJournalArticles;
    return articles.map(withPremiumHero);
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
