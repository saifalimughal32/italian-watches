import { StaticPage } from "@/components/pages/StaticPage";

export default function ShippingPage() {
  return (
    <StaticPage title="Shipping Policy">
      <p className="type-caption-sm uppercase tracking-wide text-[var(--color-mute)]">
        Effective date: 29 May 2025
      </p>
      <p>
        At Italian Watches, we aim to deliver your watch purchases promptly,
        securely, and with the highest level of care. Please read our shipping
        policy below for complete details on how your order will be processed and
        delivered.
      </p>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Order Processing
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>
          Orders are processed within 1–2 business days after payment
          confirmation (or after COD confirmation call, where applicable).
        </li>
        <li>
          You will receive confirmation once your order has been dispatched,
          along with a tracking number to monitor delivery status.
        </li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Shipping Timeline
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>We deliver orders within 7 working days from the date of dispatch.</li>
        <li>
          Working days are Monday to Friday, excluding public holidays and
          weekends.
        </li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Shipping Methods
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>
          All orders are shipped via trusted courier services, ensuring
          reliability and traceability.
        </li>
        <li>A tracking number will be provided for every shipment.</li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Shipping Charges
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>
          Shipping charges (if any) will be calculated at checkout and displayed
          before payment.
        </li>
        <li>
          From time to time, we may offer free shipping promotions — stay tuned
          via our website or social channels.
        </li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Delivery Information
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>
          Please ensure that your shipping address and contact details are
          accurate when placing an order.
        </li>
        <li>
          We are not responsible for delays or failed deliveries due to
          incorrect or incomplete address information provided by the customer.
        </li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Delayed or Lost Shipments
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>
          If your order hasn’t arrived within the stated 7 working days, please
          contact our Customer Service team with your order number so we can
          assist you.
        </li>
        <li>
          In rare cases of lost shipments, we will work with the courier service
          to resolve the issue or offer a replacement/refund where applicable.
        </li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        International Shipping
      </h2>
      <p>
        We currently ship internationally to selected countries on request.
        Delivery times and charges for international orders may vary depending on
        the destination.{" "}
        <a href="/contact" className="underline underline-offset-2 text-[var(--color-ink)]">
          Contact us
        </a>{" "}
        for availability.
      </p>
    </StaticPage>
  );
}
