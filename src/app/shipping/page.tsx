import { StaticPage } from "@/components/pages/StaticPage";

export default function ShippingPage() {
  return (
    <StaticPage title="Shipping">
      <p>
        Orders are dispatched within 1–2 business days after payment confirmation. All shipments are fully insured and require signature on delivery.
      </p>
      <p>
        <strong>Domestic (Pakistan):</strong> 2–5 business days via express courier.
      </p>
      <p>
        <strong>International:</strong> 5–10 business days depending on destination. Import duties and taxes may apply and are the responsibility of the recipient.
      </p>
      <p>
        You will receive tracking details by email once your order ships. For high-value pieces, additional verification may be required before dispatch.
      </p>
    </StaticPage>
  );
}
