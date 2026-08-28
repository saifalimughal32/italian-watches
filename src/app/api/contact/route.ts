import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    reference?: string;
    product?: string;
    message?: string;
  };

  if (!body.name || !body.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // Ready for email provider integration (Resend, SendGrid, etc.)
  console.info("Italian Watches enquiry received", {
    name: body.name,
    email: body.email,
    phone: body.phone,
    reference: body.reference,
    product: body.product,
    message: body.message,
  });

  return NextResponse.json({ ok: true });
}
