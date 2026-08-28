import { shopifyFetch } from "./client";
import { mapShopifyBrand, mapShopifyProduct, type ShopifyProduct } from "./mappers";
import { PRODUCT_FRAGMENT } from "./fragments";
import type { Brand, WatchProduct } from "../types";

const PAGE_SIZE = 250;
const MAX_PAGES = 40;

const GET_PRODUCTS_PAGE = `
  ${PRODUCT_FRAGMENT}
  query GetProductsPage($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
  query GetCollectionByHandle($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      title
      description
      handle
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
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

type ProductPage = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: ShopifyProduct[];
  };
};

type CollectionPage = {
  collection: {
    title: string;
    description: string;
    handle: string;
    products: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: ShopifyProduct[];
    };
  } | null;
};

async function fetchAllProductPages(query?: string): Promise<ShopifyProduct[]> {
  const allProducts: ShopifyProduct[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let pages = 0;

  while (hasNextPage && pages < MAX_PAGES) {
    const data: ProductPage = await shopifyFetch<ProductPage>(GET_PRODUCTS_PAGE, {
      first: PAGE_SIZE,
      after,
      query: query || null,
    });

    allProducts.push(...data.products.nodes);
    hasNextPage = data.products.pageInfo.hasNextPage;
    after = data.products.pageInfo.endCursor;
    pages += 1;
  }

  return allProducts;
}

export async function fetchAllProducts(): Promise<WatchProduct[]> {
  const nodes = await fetchAllProductPages();
  return nodes.map(mapShopifyProduct);
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
  const allNodes: ShopifyProduct[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let pages = 0;
  let collectionMeta: { title: string; description: string } | null = null;

  while (hasNextPage && pages < MAX_PAGES) {
    const data: CollectionPage = await shopifyFetch<CollectionPage>(
      GET_COLLECTION_BY_HANDLE,
      { handle, first: PAGE_SIZE, after }
    );

    if (!data.collection) return null;

    collectionMeta = {
      title: data.collection.title,
      description: data.collection.description,
    };

    allNodes.push(...data.collection.products.nodes);
    hasNextPage = data.collection.products.pageInfo.hasNextPage;
    after = data.collection.products.pageInfo.endCursor;
    pages += 1;
  }

  if (!collectionMeta) return null;

  return {
    title: collectionMeta.title,
    description: collectionMeta.description,
    products: allNodes.map(mapShopifyProduct),
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
  const nodes = await fetchAllProductPages(query);
  return nodes.map(mapShopifyProduct);
}
