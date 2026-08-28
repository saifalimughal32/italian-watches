export type PurchaseMode = "checkout" | "enquiry";

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
  metafields: WatchMetafields;
}

export interface Brand {
  handle: string;
  name: string;
  /** Uppercase lines for editorial campaign tiles */
  displayLines: string[];
  tier: "haute" | "premium";
  enquiry_only: boolean;
  tagline: string;
  heritage: string;
  collection_handle: string;
  /** Path under /public, e.g. /brands/rolex.png */
  logo?: string;
}
