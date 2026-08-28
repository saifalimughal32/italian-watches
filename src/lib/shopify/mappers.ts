import type { Brand, PurchaseMode, WatchMetafields, WatchProduct } from "../types";

type ShopifyMetafield = {
  key: string;
  value: string;
  type: string;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  tags: string[];
  featuredImage?: { url: string; altText?: string | null } | null;
  images?: { nodes: Array<{ url: string; altText?: string | null }> };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  metafields?: Array<ShopifyMetafield | null> | null;
};

type ShopifyMetaobject = {
  handle: string;
  fields: Array<{ key: string; value: string }>;
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

function toDisplayLines(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return [name.toUpperCase()];
  const midpoint = Math.ceil(words.length / 2);
  return [
    words.slice(0, midpoint).join(" ").toUpperCase(),
    words.slice(midpoint).join(" ").toUpperCase(),
  ];
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
  };
}

export function mapShopifyProduct(product: ShopifyProduct): WatchProduct {
  const fields = parseMetafieldMap(product.metafields);
  const price = product.priceRange.minVariantPrice.amount;
  const purchaseMode =
    (fields.get("purchase_mode") as PurchaseMode | undefined) ??
    (parseFloat(price) === 0 || product.tags.includes("enquiry-only")
      ? "enquiry"
      : "checkout");

  const metafields: WatchMetafields = {
    ...defaultMetafields(),
    line: fields.get("line") ?? "",
    reference_number: fields.get("reference_number") ?? "",
    gender: fields.get("gender") ?? "unisex",
    movement: fields.get("movement") ?? "automatic",
    is_chronograph: fields.get("is_chronograph") === "true",
    case_size_mm: Number(fields.get("case_size_mm") ?? 0),
    case_material: parseStringList(fields.get("case_material")),
    dial_color: fields.get("dial_color") ?? "",
    crystal: fields.get("crystal") ?? "",
    water_resistance: fields.get("water_resistance") ?? "",
    strap_type: fields.get("strap_type") ?? "",
    power_reserve: fields.get("power_reserve") ?? "",
    tier: (fields.get("tier") as WatchMetafields["tier"]) ?? "premium",
    purchase_mode: purchaseMode,
  };

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    tags: product.tags,
    price,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    imageUrl: product.featuredImage?.url,
    images: product.images?.nodes.map((image) => image.url) ?? [],
    metafields,
  };
}

export function mapShopifyBrand(metaobject: ShopifyMetaobject): Brand {
  const fields = new Map(metaobject.fields.map((field) => [field.key, field.value]));
  const name = fields.get("name") ?? metaobject.handle;
  const tier = (fields.get("tier") as Brand["tier"]) ?? "premium";

  return {
    handle: fields.get("handle") ?? metaobject.handle,
    name,
    displayLines: toDisplayLines(name),
    tier,
    enquiry_only: fields.get("enquiry_only") === "true",
    tagline: fields.get("tagline") ?? "",
    heritage: fields.get("heritage") ?? "",
    collection_handle: fields.get("handle") ?? metaobject.handle,
  };
}
