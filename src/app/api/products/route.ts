import { NextResponse } from "next/server";
import { getProduct } from "@/lib/data";

export async function GET(request: Request) {
  const handles = new URL(request.url).searchParams.get("handles");
  if (!handles) {
    return NextResponse.json({ products: [] });
  }

  const list = handles.split(",").map((handle) => handle.trim()).filter(Boolean);
  const products = (
    await Promise.all(list.map((handle) => getProduct(handle)))
  ).filter((product): product is NonNullable<typeof product> => Boolean(product));

  return NextResponse.json({ products });
}
