import { StaticPage } from "@/components/pages/StaticPage";

export default function WarrantyPage() {
  return (
    <StaticPage title="Warranty & Repair">
      <p>
        All watches sold by Italian Watches come with a <strong>1-year limited
        warranty</strong>, covering manufacturing defects and internal
        malfunctions under normal use.
      </p>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        What is covered
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>Manufacturing defects</li>
        <li>Internal malfunctions under normal use (machine warranty)</li>
      </ul>

      <h2 className="type-heading-lg !mt-10 !mb-3 text-[var(--color-ink)]">
        What is not covered
      </h2>
      <ul className="list-disc pl-5 space-y-3">
        <li>Accidental damage</li>
        <li>Physical damage or colour damage</li>
        <li>Misuse or abuse</li>
        <li>Unauthorized repairs or tampering</li>
      </ul>

      <p>
        You may still send a watch to us for repair assessment even when the issue
        is outside warranty — we will examine it and advise on next steps.
      </p>
      <p>
        For warranty or repair support,{" "}
        <a href="/contact" className="underline underline-offset-2 text-[var(--color-ink)]">
          contact Customer Service
        </a>{" "}
        with your order details and proof of purchase.
      </p>
    </StaticPage>
  );
}
