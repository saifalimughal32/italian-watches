export type PurchaseMode = "checkout" | "enquiry";

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: string;
  currencyCode: string;
}

export interface WatchMetafields {
  line: string;
  reference_number: string;
  gender: string;
  movement: string;
  is_chronograph: boolean;
  case_size_mm: number;
  case_material: string[];
  dial_color: string;
  crystal: string;
  water_resistance: string;
  strap_type: string;
  power_reserve: string;
  tier: "luxury" | "premium";
  purchase_mode: PurchaseMode;
}

export interface WatchProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  tags: string[];
  price: string;
  currencyCode?: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  variantId?: string;
  variants?: ProductVariant[];
  metafields: WatchMetafields;
}

export interface Brand {
  handle: string;
  name: string;
  displayLines: string[];
  tier: "haute" | "premium";
  enquiry_only: boolean;
  tagline: string;
  heritage: string;
  collection_handle: string;
  logo?: string;
}

export interface CartLine {
  id: string;
  quantity: number;
  variantId: string;
  title: string;
  handle: string;
  imageUrl?: string;
  price: string;
  currencyCode: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
}
