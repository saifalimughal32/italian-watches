import { StaticPage } from "@/components/pages/StaticPage";

export default function ReturnsPage() {
  return (
    <StaticPage title="Refund, Exchange & Repair Policy">
      <p>
        At Italian Watches, we are committed to delivering premium products and
        exceptional customer service. Your satisfaction is our priority, and we
        aim to ensure a smooth and transparent post-purchase experience. Please
        read our policies below for refunds, exchanges, and repairs.
      </p>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Terms and Conditions
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>Watch will be dispatched after getting confirmation from the customer on call.</li>
        <li>
          If a customer fails to answer the confirmation call, the order will not
          be dispatched.
        </li>
        <li>
          Courier services will not allow you to check first and pay on our
          parcels. If you have trust issues, please do not order until you are
          comfortable trusting us.
        </li>
        <li>
          Reporting window for return/exchange is 3 days — if you have any
          concerns, report back within 48 to 72 hours after receiving.
        </li>
        <li>
          Return/exchange policy will not apply if the watch has been used or
          any wrapping / protective film has been removed.
        </li>
        <li>
          The customer must send the watch first to our office. We will examine
          it and then proceed further.
        </li>
        <li>
          If your order is returned due to cancellation or unavailability, we
          will not send future orders until the customer prepays first.
        </li>
        <li>
          Your watch includes a 1-year machine warranty. Physical damage or
          colour damage is not included; you may still send it to us and we can
          repair it where possible.
        </li>
        <li>Premium boxes are not returnable or exchangeable.</li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Exchange Eligibility
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>The watch must be in original, unworn condition.</li>
        <li>All tags, stickers, and protective films/covers are intact.</li>
        <li>Removal of any protective elements voids exchange eligibility.</li>
        <li>A valid proof of purchase is provided.</li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Warranty &amp; Repair Policy
      </h2>
      <p>
        <strong>Warranty coverage:</strong> All watches sold by Italian Watches
        come with a 1-year limited warranty, covering manufacturing defects and
        internal malfunctions under normal use.
      </p>
      <p>
        <strong>This warranty does not cover:</strong> accidental damage, misuse
        or abuse, or unauthorized repairs / tampering.
      </p>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        Important Notes
      </h2>
      <p>
        These policies are subject to change at any time without prior notice.
        Always refer to our official website or contact our Customer Service team
        for the most updated terms.
      </p>
      <p>
        We are here to support you — please don’t hesitate to{" "}
        <a href="/contact" className="underline underline-offset-2 text-[var(--color-ink)]">
          reach out
        </a>{" "}
        with any concerns or questions.
      </p>
    </StaticPage>
  );
}
