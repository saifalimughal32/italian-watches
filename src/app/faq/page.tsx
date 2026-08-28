import { StaticPage } from "@/components/pages/StaticPage";

export default function FaqPage() {
  return (
    <StaticPage title="Frequently Asked Questions">
      <p>
        <strong>Are all watches authentic?</strong>
        <br />
        Yes. Every timepiece is sourced through authorized channels and inspected by our specialists before listing.
      </p>
      <p>
        <strong>Do you ship internationally?</strong>
        <br />
        We ship to most countries with fully insured, tracked delivery. Shipping options are confirmed at checkout.
      </p>
      <p>
        <strong>Can I request a watch not listed online?</strong>
        <br />
        Our private client team can source specific references on request. Use the contact form and include the reference number.
      </p>
      <p>
        <strong>How do I care for my watch?</strong>
        <br />
        We recommend annual servicing for mechanical watches and avoiding exposure to magnets, chemicals, and extreme temperatures.
      </p>
    </StaticPage>
  );
}
