function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl">{title}</h1>
      <div className="mt-8 text-neutral-600 leading-relaxed space-y-4">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <StaticPage title="About Italian Watches">
      <p>We are a specialist multi-brand watch boutique curating the finest timepieces from haute horology and premium Swiss manufactures.</p>
      <p>Every piece is selected for its significance within its brand&apos;s lineage.</p>
    </StaticPage>
  );
}
