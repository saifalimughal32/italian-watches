import Link from "next/link";
import { ProductDisclosure } from "@/components/products/ProductDisclosure";

export function ProductTrustAccordions() {
  return (
    <section className="pdp-trust" aria-label="Trust & policies">
      <ProductDisclosure title="Authenticity">
        Every watch is verified before it leaves Italian Watches. Serial checks,
        condition notes, and quality review are standard.{" "}
        <Link href="/authenticity" className="underline underline-offset-2">
          Learn about our authenticity standards
        </Link>
        .
      </ProductDisclosure>
      <ProductDisclosure title="Warranty">
        1-year limited machine warranty covering manufacturing defects and
        internal malfunctions under normal use. Physical damage, colour damage,
        misuse, and unauthorized repairs are not covered.{" "}
        <Link href="/warranty" className="underline underline-offset-2">
          View warranty policy
        </Link>
        .
      </ProductDisclosure>
      <ProductDisclosure title="Shipping">
        Orders process in 1–2 business days after confirmation. Delivery within 7
        working days of dispatch via trusted courier, with tracking on every
        shipment. Watches dispatch after customer confirmation on call.{" "}
        <Link href="/shipping" className="underline underline-offset-2">
          View shipping policy
        </Link>
        .
      </ProductDisclosure>
      <ProductDisclosure title="Refund, Exchange & Repair">
        Report concerns within 48–72 hours of receiving (up to 3 days). Returns /
        exchanges apply only to unworn watches with all tags, stickers, and
        protective films intact. Customer ships the watch to our office for
        inspection first. Premium boxes are not returnable or exchangeable.{" "}
        <Link href="/returns" className="underline underline-offset-2">
          View full refund &amp; exchange policy
        </Link>
        .
      </ProductDisclosure>
    </section>
  );
}
