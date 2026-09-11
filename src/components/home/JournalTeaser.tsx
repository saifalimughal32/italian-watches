import Image from "next/image";
import Link from "next/link";
import type { JournalArticle } from "@/lib/types";

export function JournalTeaser({ articles }: { articles: JournalArticle[] }) {
  if (!articles.length) return null;

  return (
    <div className="journal-grid">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/journal/${article.slug}`}
          className="journal-card group"
        >
          <div className="journal-card__media">
            <Image
              src={article.hero}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <p className="type-micro">{article.author}</p>
          <h3 className="journal-card__title mt-2">{article.title}</h3>
          <p className="type-caption-md mt-2 line-clamp-2">{article.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}
