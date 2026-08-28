import { inferBrandName } from "../brand-inference";
import type {
  Brand,
  Cart,
  CartLine,
  ProductVariant,
  PurchaseMode,
  WatchMetafields,
  WatchProduct,
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

function toDisplayLines(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return [name.toUpperCase()];
  const midpoint = Math.ceil(words.length / 2);
  return [
    words.slice(0, midpoint).join(" ").toUpperCase(),
    words.slice(midpoint).join(" ").toUpperCase(),
  ];
}

function inferMovement(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("automatic")) return "automatic";
  if (lower.includes("chronograph")) return "chronograph";
  if (lower.includes("quartz")) return "quartz";
  return "automatic";
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

  const metafields: WatchMetafields = {
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
    tier:
      (fields.get("tier") as WatchMetafields["tier"]) ??
      (parseFloat(price) >= 50000 ? "luxury" : "premium"),
    purchase_mode: purchaseMode,
  };

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
