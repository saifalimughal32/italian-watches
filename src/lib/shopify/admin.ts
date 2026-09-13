import { getShopifyAdminAccessToken, getShopifyAdminEndpoint } from "./config";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function shopifyAdminFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const endpoint = getShopifyAdminEndpoint();
  const token = await getShopifyAdminAccessToken();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Shopify Admin API error: ${response.status} ${response.statusText}${text ? ` — ${text}` : ""}`
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(", "));
  }

  if (!json.data) {
    throw new Error("Shopify Admin API returned no data");
  }

  return json.data;
}
