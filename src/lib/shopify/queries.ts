import { shopifyFetch } from "./client";
import {
  mapCampaign,
  mapHomepageSlot,
  mapJournalArticle,
  mapShopifyBrand,
  mapShopifyProduct,
  mapSpecialist,
  type ShopifyProduct,
} from "./mappers";
import { PRODUCT_FRAGMENT } from "./fragments";
import type {
  Brand,
  Campaign,
  HomepageSlot,
  JournalArticle,
  Specialist,
  WatchProduct,
} from "../types";

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

const GET_HOMEPAGE_SLOTS = `
  query GetHomepageSlots($first: Int!) {
    metaobjects(type: "homepage_slot", first: $first) {
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

const GET_JOURNAL_ARTICLES = `
  query GetJournalArticles($first: Int!) {
    metaobjects(type: "journal_article", first: $first) {
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

const GET_CAMPAIGNS = `
  query GetCampaigns($first: Int!) {
    metaobjects(type: "campaign", first: $first) {
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

const GET_CAMPAIGN_BY_HANDLE = `
  query GetCampaignByHandle($handle: String!) {
    metaobject(handle: { type: "campaign", handle: $handle }) {
      handle
      fields {
        key
        value
      }
    }
  }
`;

const GET_SPECIALISTS = `
  query GetSpecialists($first: Int!) {
    metaobjects(type: "specialist", first: $first) {
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

type MetaobjectNode = {
  handle: string;
  fields: Array<{ key: string; value: string }>;
};

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
      nodes: MetaobjectNode[];
    };
  }>(GET_BRANDS, { first: 50 });

  return data.metaobjects.nodes.map(mapShopifyBrand);
}

export async function fetchHomepageSlots(): Promise<HomepageSlot[]> {
  const data = await shopifyFetch<{
    metaobjects: {
      nodes: MetaobjectNode[];
    };
  }>(GET_HOMEPAGE_SLOTS, { first: 20 });

  return data.metaobjects.nodes
    .map(mapHomepageSlot)
    .sort((a, b) => a.order - b.order);
}

export async function fetchJournalArticles(): Promise<JournalArticle[]> {
  const data = await shopifyFetch<{
    metaobjects: {
      nodes: MetaobjectNode[];
    };
  }>(GET_JOURNAL_ARTICLES, { first: 12 });

  return data.metaobjects.nodes
    .map(mapJournalArticle)
    .sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const data = await shopifyFetch<{
    metaobjects: {
      nodes: MetaobjectNode[];
    };
  }>(GET_CAMPAIGNS, { first: 20 });

  return data.metaobjects.nodes.map(mapCampaign);
}

export async function fetchCampaignByHandle(handle: string): Promise<Campaign | null> {
  const data = await shopifyFetch<{
    metaobject: MetaobjectNode | null;
  }>(GET_CAMPAIGN_BY_HANDLE, { handle });

  return data.metaobject ? mapCampaign(data.metaobject) : null;
}

export async function fetchSpecialists(): Promise<Specialist[]> {
  const data = await shopifyFetch<{
    metaobjects: {
      nodes: MetaobjectNode[];
    };
  }>(GET_SPECIALISTS, { first: 20 });

  return data.metaobjects.nodes.map(mapSpecialist);
}

export async function searchProducts(query: string): Promise<WatchProduct[]> {
  const nodes = await fetchAllProductPages(query);
  return nodes.map(mapShopifyProduct);
}
