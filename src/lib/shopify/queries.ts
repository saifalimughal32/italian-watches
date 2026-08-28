import { shopifyFetch } from "./client";
import { mapShopifyBrand, mapShopifyProduct, type ShopifyProduct } from "./mappers";
import { PRODUCT_FRAGMENT } from "./fragments";
import type { Brand, WatchProduct } from "../types";

const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

const GET_COLLECTION_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      description
      handle
      products(first: $first) {
        nodes {
          ...ProductFields
        }
      }
    }
  }
`;

const GET_BRANDS = `
  query GetBrands($first: Int!) {
    metaobjects(type: "brand", first: $first) {
      nodes {
        handle
        fields {
          key
          value
        }
      }
    }
  }
`;

export async function fetchAllProducts(): Promise<WatchProduct[]> {
  const data = await shopifyFetch<{
    products: { nodes: ShopifyProduct[] };
  }>(GET_PRODUCTS, { first: 250 });

  return data.products.nodes.map(mapShopifyProduct);
}

export async function fetchProductByHandle(handle: string): Promise<WatchProduct | null> {
  const data = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>(GET_PRODUCT_BY_HANDLE, { handle });

  return data.product ? mapShopifyProduct(data.product) : null;
}

export async function fetchCollectionByHandle(handle: string): Promise<{
  title: string;
  description: string;
  products: WatchProduct[];
} | null> {
  const data = await shopifyFetch<{
    collection: {
      title: string;
      description: string;
      handle: string;
      products: { nodes: ShopifyProduct[] };
    } | null;
  }>(GET_COLLECTION_BY_HANDLE, { handle, first: 250 });

  if (!data.collection) return null;

  return {
    title: data.collection.title,
    description: data.collection.description,
    products: data.collection.products.nodes.map(mapShopifyProduct),
  };
}

export async function fetchBrands(): Promise<Brand[]> {
  const data = await shopifyFetch<{
    metaobjects: {
      nodes: Array<{
        handle: string;
        fields: Array<{ key: string; value: string }>;
      }>;
    };
  }>(GET_BRANDS, { first: 50 });

  return data.metaobjects.nodes.map(mapShopifyBrand);
}

export async function searchProducts(query: string): Promise<WatchProduct[]> {
  const data = await shopifyFetch<{
    products: { nodes: ShopifyProduct[] };
  }>(GET_PRODUCTS, { first: 50, query });

  return data.products.nodes.map(mapShopifyProduct);
}
