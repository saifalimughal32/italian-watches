const API_VERSION = "2025-01";

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function isShopifyConfigured() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

  return Boolean(domain && token);
}

/** Legacy permanent Admin token OR Dev Dashboard client credentials. */
export function isShopifyAdminConfigured() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) return false;

  if (process.env.SHOPIFY_ADMIN_API_TOKEN?.trim()) return true;

  return Boolean(
    process.env.SHOPIFY_CLIENT_ID?.trim() && process.env.SHOPIFY_CLIENT_SECRET?.trim()
  );
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

export function getShopifyAdminShopDomain() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) {
    throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not configured");
  }
  return normalizeDomain(domain);
}

export function getShopifyAdminEndpoint() {
  return `https://${getShopifyAdminShopDomain()}/admin/api/${API_VERSION}/graphql.json`;
}

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

/**
 * Resolve an Admin API access token.
 * Prefer legacy SHOPIFY_ADMIN_API_TOKEN; otherwise exchange Dev Dashboard
 * client credentials (expires ~24h, auto-refreshed).
 */
export async function getShopifyAdminAccessToken(): Promise<string> {
  const legacy = process.env.SHOPIFY_ADMIN_API_TOKEN?.trim();
  if (legacy) return legacy;

  const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "Shopify Admin is not configured. Add SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET from Dev Dashboard (or legacy SHOPIFY_ADMIN_API_TOKEN)."
    );
  }

  if (cachedToken && Date.now() < cachedTokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const shop = getShopifyAdminShopDomain().replace(/\.myshopify\.com$/i, "");
  const response = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Shopify Admin token request failed (${response.status}). Install the Dev Dashboard app on this store and ensure draft_orders scopes are approved. ${text}`
    );
  }

  const json = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!json.access_token) {
    throw new Error("Shopify Admin token response missing access_token");
  }

  cachedToken = json.access_token;
  cachedTokenExpiresAt = Date.now() + (json.expires_in ?? 86_399) * 1000;
  return cachedToken;
}
