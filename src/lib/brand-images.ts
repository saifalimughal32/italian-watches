import type { Brand, WatchProduct } from "./types";
import { inferBrandHandle } from "./brand-inference";

export const BRAND_COLLECTION_IMAGES: Record<string, string> = {
  rolex: "/collections/rolex.jpg",
  "audemars-piguet": "/collections/audemars-piguet.jpg",
  "patek-philippe": "/collections/patek-philippe.jpg",
  hublot: "/collections/hublot.jpg",
  tissot: "/collections/tissot.jpg",
};

export const CATEGORY_COLLECTION_IMAGES: Record<string, string> = {
  "mens-watches": "/categories/mens-premium.jpg",
  "womens-watches": "/categories/womens-premium.jpg",
  "automatic-watches": "/categories/automatic-premium.jpg",
  "chronograph-watches": "/categories/chronograph-premium.jpg",
  "luxury-watches": "/categories/luxury-haute.jpg",
  "premium-watches": "/categories/premium-premium.jpg",
};

export function getBrandCollectionImage(brand: Brand, products: WatchProduct[] = []) {
  // Curated brand tiles always win — product catalog images are often mislabeled.
  const staticImage = BRAND_COLLECTION_IMAGES[brand.handle];
  if (staticImage) return staticImage;

  if (brand.collectionImage) return brand.collectionImage;

  const brandProducts = products.filter(
    (product) => inferBrandHandle(product.vendor) === brand.handle
  );

  const productImage =
    brandProducts.find((product) => product.imageUrl)?.imageUrl ??
    brandProducts[0]?.images?.[0];

  return productImage ?? BRAND_COLLECTION_IMAGES.rolex;
}

export function enrichBrandsWithImages(brands: Brand[], products: WatchProduct[]): Brand[] {
  return brands.map((brand) => ({
    ...brand,
    collectionImage: getBrandCollectionImage(brand, products),
  }));
}
