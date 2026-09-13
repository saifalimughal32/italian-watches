import { getShopifyConfig } from "./config";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type ShopifyFetchOptions = {
  /** Catalog defaults to ISR; cart/mutations should use no-store. */
  cache?: RequestCache;
  revalidate?: number | false;
};

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {}
): Promise<T> {
  const { endpoint, token } = getShopifyConfig();
  const cache = options.cache ?? "force-cache";
  const revalidate = options.revalidate ?? 300;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache === "no-store"
      ? { cache: "no-store" as const }
      : { next: { revalidate: revalidate === false ? 0 : revalidate } }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(", "));
  }

  if (!json.data) {
    throw new Error("Shopify API returned no data");
  }

  return json.data;
}
