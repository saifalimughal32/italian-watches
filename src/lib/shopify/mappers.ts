import { inferBrandName } from "../brand-inference";
import { mergeMetafieldsWithDescription } from "../parse-specs";
import type {
  Brand,
  Campaign,
  Cart,
  CartLine,
  HomepageSlot,
  JournalArticle,
  ProductVariant,
  PurchaseMode,
  Specialist,
  WatchMetafields,
  WatchProduct,
  WatchTier,
} from "../types";

type ShopifyMetafield = {
  key: string;
  value: string;
  type: string;
};

type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  tags: string[];
  description?: string;
  descriptionHtml?: string;
  featuredImage?: { url: string; altText?: string | null } | null;
  images?: { nodes: Array<{ url: string; altText?: string | null }> };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants?: { nodes: ShopifyVariant[] };
  metafields?: Array<ShopifyMetafield | null> | null;
};

type ShopifyMetaobject = {
  handle: string;
  fields: Array<{ key: string; value: string }>;
};

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      merchandise: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        product: {
          title: string;
          handle: string;
          featuredImage?: { url: string | null } | null;
        };
      };
    }>;
  };
};

function parseMetafieldMap(metafields?: Array<ShopifyMetafield | null> | null) {
  const map = new Map<string, string>();
  for (const field of metafields ?? []) {
    if (field?.key && field.value != null) {
      map.set(field.key, field.value);
    }
  }
  return map;
}

function parseStringList(value?: string) {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [value];
  } catch {
    return value ? [value] : [];
  }
}

function parseGidList(value?: string) {
  return parseStringList(value);
}

function toDisplayLines(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return [name];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function inferMovement(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("automatic")) return "automatic";
  if (lower.includes("chronograph")) return "chronograph";
  if (lower.includes("quartz")) return "quartz";
  return "automatic";
}

function parseTier(value: string | undefined, price: string): WatchTier {
  if (value === "haute" || value === "luxury" || value === "premium") return value;
  return parseFloat(price) >= 50000 ? "luxury" : "premium";
}

function defaultMetafields(): WatchMetafields {
  return {
    line: "",
    reference_number: "",
    gender: "unisex",
    movement: "automatic",
    is_chronograph: false,
    case_size_mm: 0,
    case_material: [],
    dial_color: "",
    crystal: "",
    water_resistance: "",
    strap_type: "",
    power_reserve: "",
    tier: "premium",
    purchase_mode: "checkout",
    is_limited: false,
    box_papers: "",
    year_of_production: null,
    condition: "",
    service_history: "",
  };
}

function mapVariants(variants?: { nodes: ShopifyVariant[] }): ProductVariant[] {
  return (variants?.nodes ?? []).map((variant) => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    price: variant.price.amount,
    currencyCode: variant.price.currencyCode,
  }));
}

export function mapShopifyProduct(product: ShopifyProduct): WatchProduct {
  const fields = parseMetafieldMap(product.metafields);
  const variants = mapVariants(product.variants);
  const primaryVariant = variants.find((variant) => variant.availableForSale) ?? variants[0];
  const price = primaryVariant?.price ?? product.priceRange.minVariantPrice.amount;
  const purchaseMode =
    (fields.get("purchase_mode") as PurchaseMode | undefined) ??
    (parseFloat(price) === 0 || product.tags.includes("enquiry-only")
      ? "enquiry"
      : "checkout");

  const yearRaw =
    fields.get("year_of_production") || fields.get("year_or_generation") || "";
  const yearMatch = yearRaw.match(/\d{4}/);
  const yearParsed = yearMatch ? Number(yearMatch[0]) : NaN;

  const metafields: WatchMetafields = mergeMetafieldsWithDescription(
    {
      ...defaultMetafields(),
      line: fields.get("line") ?? "",
      reference_number: fields.get("reference_number") ?? "",
      gender: fields.get("gender") ?? "unisex",
      movement: fields.get("movement") || inferMovement(product.title),
      is_chronograph:
        fields.get("is_chronograph") === "true" ||
        product.title.toLowerCase().includes("chronograph"),
      case_size_mm: Number(fields.get("case_size_mm") ?? 0),
      case_material: parseStringList(fields.get("case_material")),
      dial_color: fields.get("dial_color") ?? "",
      crystal: fields.get("crystal") ?? "",
      water_resistance: fields.get("water_resistance") ?? "",
      strap_type: fields.get("strap_type") ?? "",
      power_reserve: fields.get("power_reserve") ?? "",
      tier: parseTier(fields.get("tier"), price),
      purchase_mode: purchaseMode,
      is_limited:
        fields.get("is_limited") === "true" || product.tags.includes("limited"),
      box_papers: fields.get("box_papers") ?? "",
      year_of_production: Number.isFinite(yearParsed) ? yearParsed : null,
      condition: fields.get("condition") ?? "",
      service_history: fields.get("service_history") ?? "",
    },
    product.description || product.descriptionHtml
  );

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    vendor: inferBrandName({
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      tags: product.tags,
    }),
    tags: product.tags,
    price,
    currencyCode: primaryVariant?.currencyCode ?? product.priceRange.minVariantPrice.currencyCode,
    imageUrl: product.featuredImage?.url,
    images: product.images?.nodes.map((image) => image.url) ?? [],
    description: product.description || product.descriptionHtml,
    variantId: primaryVariant?.id,
    variants,
    metafields,
  };
}

export function mapShopifyBrand(metaobject: ShopifyMetaobject): Brand {
  const fields = new Map(metaobject.fields.map((field) => [field.key, field.value]));
  const name = fields.get("name") ?? metaobject.handle;
  const tier = (fields.get("tier") as Brand["tier"]) ?? "premium";
  const founded = fields.get("founded_year");

  return {
    handle: fields.get("handle") ?? metaobject.handle,
    name,
    displayLines: toDisplayLines(name),
    tier,
    enquiry_only: fields.get("enquiry_only") === "true",
    tagline: fields.get("tagline") ?? "",
    heritage: fields.get("heritage") ?? "",
    collection_handle: fields.get("handle") ?? metaobject.handle,
    logo: fields.get("logo") || undefined,
    collectionImage: fields.get("hero_image") || undefined,
    founded_year: founded ? Number(founded) : undefined,
  };
}

export function mapHomepageSlot(metaobject: ShopifyMetaobject): HomepageSlot {
  const fields = new Map(metaobject.fields.map((field) => [field.key, field.value]));
  const founded = fields.get("founded_year");

  return {
    kind: fields.get("kind") ?? "brand_chapter",
    heading: fields.get("heading") ?? "",
    subheading: fields.get("subheading") ?? "",
    image: fields.get("image") ?? "/images/hero.jpg",
    cta_label: fields.get("cta_label") ?? "Explore",
    cta_href: fields.get("cta_href") ?? "/brands",
    order: Number(fields.get("order") ?? 0),
    founded_year: founded ? Number(founded) : undefined,
    heritage: fields.get("heritage") ?? undefined,
  };
}

export function mapJournalArticle(metaobject: ShopifyMetaobject): JournalArticle {
  const fields = new Map(metaobject.fields.map((field) => [field.key, field.value]));
  const body = fields.get("body_richtext") ?? "";

  return {
    title: fields.get("title") ?? metaobject.handle,
    slug: fields.get("slug") ?? metaobject.handle,
    hero: fields.get("hero") ?? "/images/hero.jpg",
    excerpt: fields.get("excerpt") ?? body.slice(0, 140),
    author: fields.get("author") ?? "Editorial",
    published_at: fields.get("published_at") ?? "",
    body_richtext: body || undefined,
    related_product_ids: parseGidList(fields.get("related_products")),
  };
}

export function mapCampaign(metaobject: ShopifyMetaobject): Campaign {
  const fields = new Map(metaobject.fields.map((field) => [field.key, field.value]));

  return {
    handle: metaobject.handle,
    title: fields.get("title") ?? metaobject.handle,
    hero_video: fields.get("hero_video") || undefined,
    hero_still: fields.get("hero_still") ?? "/images/hero.jpg",
    story_richtext: fields.get("story_richtext") || undefined,
    featured_product_ids: parseGidList(fields.get("featured_products")),
    start: fields.get("start") || undefined,
    end: fields.get("end") || undefined,
  };
}

export function mapSpecialist(metaobject: ShopifyMetaobject): Specialist {
  const fields = new Map(metaobject.fields.map((field) => [field.key, field.value]));

  return {
    handle: metaobject.handle,
    name: fields.get("name") ?? metaobject.handle,
    title: fields.get("title") ?? "",
    photo: fields.get("photo") || undefined,
    whatsapp: fields.get("whatsapp") || undefined,
    email: fields.get("email") || undefined,
    brands_covered: parseStringList(fields.get("brands_covered")),
  };
}

export function mapShopifyCart(cart: ShopifyCart): Cart {
  const lines: CartLine[] = cart.lines.nodes.map((line) => ({
    id: line.id,
    quantity: line.quantity,
    variantId: line.merchandise.id,
    title: line.merchandise.product.title,
    handle: line.merchandise.product.handle,
    imageUrl: line.merchandise.product.featuredImage?.url ?? undefined,
    price: line.merchandise.price.amount,
    currencyCode: line.merchandise.price.currencyCode,
  }));

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    lines,
  };
}
