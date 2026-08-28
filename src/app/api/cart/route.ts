import { NextResponse } from "next/server";
import { isShopifyConfigured } from "@/lib/shopify/config";
import {
  addToCart,
  createCart,
  getCart,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify/cart";

export async function GET(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: "Shopify not configured" }, { status: 400 });
  }

  const cartId = new URL(request.url).searchParams.get("cartId");
  if (!cartId) {
    return NextResponse.json({ cart: null });
  }

  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: "Shopify not configured" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      action: "create" | "add" | "update" | "remove";
      cartId?: string;
      variantId?: string;
      lineId?: string;
      quantity?: number;
    };

    if (body.action === "create" && body.variantId) {
      const cart = await createCart(body.variantId, body.quantity ?? 1);
      return NextResponse.json({ cart });
    }

    if (!body.cartId) {
      return NextResponse.json({ error: "cartId is required" }, { status: 400 });
    }

    if (body.action === "add" && body.variantId) {
      const cart = await addToCart(body.cartId, body.variantId, body.quantity ?? 1);
      return NextResponse.json({ cart });
    }

    if (body.action === "update" && body.lineId) {
      const cart = await updateCartLine(body.cartId, body.lineId, body.quantity ?? 1);
      return NextResponse.json({ cart });
    }

    if (body.action === "remove" && body.lineId) {
      const cart = await removeCartLine(body.cartId, body.lineId);
      return NextResponse.json({ cart });
    }

    return NextResponse.json({ error: "Invalid cart action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Cart request failed" },
      { status: 500 }
    );
  }
}
