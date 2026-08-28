const API_VERSION = "2025-01";

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function isShopifyConfigured() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

  return Boolean(domain && token);
}

export function getShopifyConfig() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  // Storefront API uses the public storefront token (not Admin API shpat_ tokens).
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN?.trim();

  if (!domain || !token) {
    throw new Error("Shopify Storefront API is not configured");
  }

  const storeDomain = normalizeDomain(domain);

  return {
    domain: storeDomain,
    token,
    endpoint: `https://${storeDomain}/api/${API_VERSION}/graphql.json`,
  };
}
