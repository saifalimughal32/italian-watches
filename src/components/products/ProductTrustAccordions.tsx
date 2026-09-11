import Link from "next/link";
import { ProductDisclosure } from "@/components/products/ProductDisclosure";

export function ProductTrustAccordions() {
  return (
    <section className="pdp-trust" aria-label="Trust & policies">
      <ProductDisclosure title="Authenticity">
        Every watch is verified by our specialists before it leaves the maison.
        Serial checks, condition notes, and provenance review are standard.{" "}
        <Link href="/authenticity" className="underline underline-offset-2">
          Learn about our authenticity standards
        </Link>
        .
      </ProductDisclosure>
      <ProductDisclosure title="Warranty">
        Manufacturer warranty applies where stated on the piece. Boutique-backed
        aftercare is available for eligible references.{" "}
        <Link href="/warranty" className="underline underline-offset-2">
          View warranty policy
        </Link>
        .
      </ProductDisclosure>
      <ProductDisclosure title="Shipping">
        Insured domestic delivery across Pakistan in 2–5 business days, with
        signature required on haute pieces. International options available on
        request.{" "}
        <Link href="/shipping" className="underline underline-offset-2">
          View shipping information
        </Link>
        .
      </ProductDisclosure>
      <ProductDisclosure title="Returns">
        14-day return window for unworn pieces in original packaging with all
        accompanying materials.{" "}
        <Link href="/returns" className="underline underline-offset-2">
          View returns policy
        </Link>
        .
      </ProductDisclosure>
    </section>
  );
}
