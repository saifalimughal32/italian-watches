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
  "mens-watches": "/categories/mens.jpg",
  "womens-watches": "/categories/womens.jpg",
  "automatic-watches": "/categories/automatic.jpg",
  "chronograph-watches": "/categories/chronograph.jpg",
  "luxury-watches": "/categories/luxury.jpg",
  "premium-watches": "/categories/premium.jpg",
};

export function getBrandCollectionImage(brand: Brand, products: WatchProduct[] = []) {
  if (brand.collectionImage) return brand.collectionImage;

  const staticImage = BRAND_COLLECTION_IMAGES[brand.handle];
  const brandProducts = products.filter(
    (product) => inferBrandHandle(product.vendor) === brand.handle
  );

  const productImage =
    brandProducts.find((product) => product.imageUrl)?.imageUrl ??
    brandProducts[0]?.images?.[0];

  return productImage ?? staticImage ?? BRAND_COLLECTION_IMAGES.rolex;
}

export function enrichBrandsWithImages(brands: Brand[], products: WatchProduct[]): Brand[] {
  return brands.map((brand) => ({
    ...brand,
    collectionImage: getBrandCollectionImage(brand, products),
  }));
}
