import { NextResponse } from "next/server";
import { isShopifyConfigured } from "@/lib/shopify/config";
import { fetchAllProducts } from "@/lib/shopify/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const required = [
    "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
    "NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN",
  ] as const;

  const present = {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: Boolean(
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    ),
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN: Boolean(
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN
    ),
  };

  const missing = required.filter((key) => !present[key]);

  if (!isShopifyConfigured()) {
    return NextResponse.json({
      ok: false,
      source: "mock",
      message: "Shopify is not configured. Missing or invalid environment variables.",
      missing,
      present,
      hint:
        "Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN in Vercel → Settings → Environment Variables, then redeploy.",
    });
  }

  try {
    const products = await fetchAllProducts();

    return NextResponse.json({
      ok: true,
      source: "shopify",
      store: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
      productCount: products.length,
      sample: products.slice(0, 5).map((product) => ({
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        price: product.price,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "shopify-error",
        message: error instanceof Error ? error.message : "Unknown Shopify error",
        missing,
        present,
      },
      { status: 500 }
    );
  }
}
