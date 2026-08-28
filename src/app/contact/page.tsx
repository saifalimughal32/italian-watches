import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; product?: string }>;
}) {
  const params = await searchParams;

  return (
    <Container>
      <div className="section-rhythm max-w-lg">
        <h1 className="type-heading-xl normal-case">Private Client Enquiry</h1>
        <p className="type-caption-md mt-2">We respond within 24 hours.</p>

        <form className="mt-10 space-y-6">
          {[
            { id: "name", label: "Name", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "phone", label: "Phone", type: "tel" },
            { id: "reference", label: "Reference", type: "text", defaultValue: params.reference },
            { id: "product", label: "Watch", type: "text", defaultValue: params.product },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="type-caption-sm block mb-2 uppercase">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                defaultValue={field.defaultValue}
                className="w-full h-12 px-4 border border-[var(--color-hairline)] bg-[var(--color-canvas)] type-body-strong focus:outline-none focus:border-[var(--color-ink)]"
                style={{ borderRadius: "var(--radius-md)" }}
                required={field.id === "name" || field.id === "email"}
              />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="type-caption-sm block mb-2 uppercase">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)]"
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Submit Enquiry
          </Button>
        </form>
      </div>
    </Container>
  );
}
