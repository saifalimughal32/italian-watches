import { NextResponse } from "next/server";
import { isShopifyAdminConfigured, isShopifyConfigured } from "@/lib/shopify/config";
import { createCodOrder } from "@/lib/shopify/cod-order";
import { getCart } from "@/lib/shopify/cart";

export async function POST(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: "Shopify is not configured." }, { status: 400 });
  }

  if (!isShopifyAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "COD is not fully connected yet. Add SHOPIFY_ADMIN_API_TOKEN in Vercel env (Admin API custom app with draft_orders write access), then redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      cartId?: string;
      fullName?: string;
      phone?: string;
      email?: string;
      city?: string;
      address?: string;
      notes?: string;
    };

    const fullName = body.fullName?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const city = body.city?.trim() ?? "";
    const address = body.address?.trim() ?? "";
    const cartId = body.cartId?.trim() ?? "";

    if (!cartId) {
      return NextResponse.json({ error: "cartId is required" }, { status: 400 });
    }

    if (!fullName || !phone || !city || !address) {
      return NextResponse.json(
        { error: "Name, phone, city, and address are required." },
        { status: 400 }
      );
    }

    const cart = await getCart(cartId);
    if (!cart || cart.lines.length === 0) {
      return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    }

    const order = await createCodOrder({
      fullName,
      phone,
      email: body.email,
      city,
      address,
      notes: body.notes,
      lines: cart.lines.map((line) => ({
        variantId: line.variantId,
        quantity: line.quantity,
        title: line.title,
        price: line.price,
      })),
    });

    return NextResponse.json({
      ok: true,
      orderName: order.orderName,
      orderId: order.orderId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not place COD order",
      },
      { status: 500 }
    );
  }
}
