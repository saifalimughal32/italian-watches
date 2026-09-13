import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Order confirmed | Italian Watches",
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; payment?: string }>;
}) {
  const params = await searchParams;
  const isCod = params.payment === "cod";

  return (
    <Container>
      <div className="section-rhythm max-w-xl mx-auto text-center">
        <p className="type-micro text-[var(--color-mute)]">Thank you</p>
        <h1 className="type-heading-xl mt-3 normal-case">Your order has been placed</h1>
        <p className="type-caption-md mt-4 text-[var(--color-charcoal)]">
          {isCod
            ? "Your Cash on Delivery order is confirmed. Pay the courier when your watch arrives."
            : "Your order is confirmed. We’ll be in touch with delivery updates."}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/collections/all" variant="primary">
            Continue shopping
          </Button>
          <Button href="/contact" variant="secondary">
            Contact concierge
          </Button>
        </div>
        <p className="type-caption-sm mt-8 text-[var(--color-mute)]">
          Need help?{" "}
          <Link href="/faq" className="underline underline-offset-2">
            Read FAQ
          </Link>
        </p>
      </div>
    </Container>
  );
}
