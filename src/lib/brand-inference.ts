import { mockBrands } from "./mock-data";
import type { WatchProduct } from "./types";
import { slugify } from "./utils";

const GENERIC_VENDORS = new Set([
  "",
  "default",
  "shopify",
  "time official",
  "italian watches",
  "maison watches",
]);

type BrandRule = {
  name: string;
  handle: string;
  patterns: RegExp[];
};

const BRAND_RULES: BrandRule[] = [
  {
    name: "Rolex",
    handle: "rolex",
    patterns: [
      /\brolex\b/i,
      /submariner/i,
      /datejust/i,
      /day[- ]?date/i,
      /\bgmt\b/i,
      /yacht/i,
      /explorer/i,
      /oyster/i,
      /daytona/i,
      /milgauss/i,
      /sky[- ]?dweller/i,
      /air[- ]?king/i,
      /sea[- ]?dweller/i,
      /wimbledon/i,
      /president/i,
      /pearlmaster/i,
      /cosmograph/i,
    ],
  },
  {
    name: "Audemars Piguet",
    handle: "audemars-piguet",
    patterns: [/audemars/i, /piguet/i, /royal oak/i, /offshore/i, /\bap\b/i],
  },
  {
    name: "Patek Philippe",
    handle: "patek-philippe",
    patterns: [/patek/i, /philippe/i, /nautilus/i, /calatrava/i, /aquanaut/i],
  },
  {
    name: "Hublot",
    handle: "hublot",
    patterns: [/hublot/i, /big bang/i, /classic fusion/i],
  },
  {
    name: "Tissot",
    handle: "tissot",
    patterns: [/tissot/i, /\bprx\b/i],
  },
  {
    name: "Omega",
    handle: "omega",
    patterns: [/omega/i, /seamaster/i, /speedmaster/i, /constellation/i],
  },
  {
    name: "Cartier",
    handle: "cartier",
    patterns: [/cartier/i, /santos/i, /tank\b/i, /ballon/i],
  },
  {
    name: "TAG Heuer",
    handle: "tag-heuer",
    patterns: [/tag heuer/i, /\bcarrera\b/i, /\bmonaco\b/i],
  },
  {
    name: "Breitling",
    handle: "breitling",
    patterns: [/breitling/i, /navitimer/i, /superocean/i],
  },
  {
    name: "IWC",
    handle: "iwc",
    patterns: [/\biwc\b/i, /portugieser/i, /pilots? watch/i],
  },
];

function isGenericVendor(vendor: string) {
  return GENERIC_VENDORS.has(vendor.trim().toLowerCase());
}

function matchBrandFromText(text: string) {
  for (const rule of BRAND_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return rule.name;
    }
  }
  return null;
}

function matchKnownBrandName(vendor: string) {
  const normalized = vendor.trim().toLowerCase();
  const known = mockBrands.find(
    (brand) =>
      brand.name.toLowerCase() === normalized || brand.handle === slugify(vendor)
  );
  return known?.name ?? null;
}

export function inferBrandName(product: Pick<WatchProduct, "title" | "handle" | "vendor" | "tags">) {
  const searchText = [product.title, product.handle, ...(product.tags ?? [])].join(" ");
  const fromText = matchBrandFromText(searchText);
  const knownVendor = matchKnownBrandName(product.vendor);

  // Title/handle signals win when they conflict with a mismatched vendor
  // (e.g. a Rolex listed under a Tissot Shopify collection).
  if (fromText && knownVendor && fromText !== knownVendor) {
    return fromText;
  }

  if (knownVendor) return knownVendor;

  if (!isGenericVendor(product.vendor)) {
    return product.vendor.trim();
  }

  if (fromText) return fromText;

  return product.vendor.trim() || "Italian Watches";
}

export function inferBrandHandle(brandName: string) {
  const known = mockBrands.find(
    (brand) => brand.name.toLowerCase() === brandName.toLowerCase()
  );
  return known?.handle ?? slugify(brandName);
}

export function withResolvedBrand<T extends WatchProduct>(product: T): T {
  const vendor = inferBrandName(product);
  return { ...product, vendor };
}
