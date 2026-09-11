import type { WatchProduct } from "./types";
import { getProductImage } from "./product-display";

export const RECENTLY_VIEWED_KEY = "iw-recently-viewed";
export const MAX_RECENTLY_VIEWED = 8;

export type RecentlyViewedItem = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  imageUrl?: string;
  price: string;
  currencyCode?: string;
  purchaseMode: string;
  viewedAt: number;
};

export function toRecentlyViewedItem(product: WatchProduct): RecentlyViewedItem {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    imageUrl: getProductImage(product),
    price: product.price,
    currencyCode: product.currencyCode,
    purchaseMode: product.metafields.purchase_mode,
    viewedAt: Date.now(),
  };
}

export function readRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentlyViewedItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;
  const next = [
    item,
    ...readRecentlyViewed().filter((entry) => entry.handle !== item.handle),
  ].slice(0, MAX_RECENTLY_VIEWED);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
}
