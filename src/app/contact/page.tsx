import { ContactForm } from "@/components/contact/ContactForm";
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
        <ContactForm defaultReference={params.reference} defaultProduct={params.product} />
      </div>
    </Container>
  );
}
