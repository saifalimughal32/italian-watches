import Link from "next/link";

type SiteLogoProps = {
  variant?: "header" | "footer" | "mark";
  className?: string;
};

export function SiteLogo({ variant = "header", className = "" }: SiteLogoProps) {
  if (variant === "mark") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center shrink-0 ${className}`.trim()}
        aria-label="Italian Watches home"
      >
        <img
          src="/brand/mark.svg"
          alt="Italian Watches"
          width={40}
          height={40}
          className="h-10 w-10"
          decoding="async"
        />
      </Link>
    );
  }

  if (variant === "footer") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center shrink-0 ${className}`.trim()}
        aria-label="Italian Watches home"
      >
        <img
          src="/brand/logo.svg"
          alt="Italian Watches"
          width={200}
          height={68}
          className="h-12 w-auto max-w-[160px] md:h-14 md:max-w-none"
          decoding="async"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`site-logo site-logo--header inline-flex items-center gap-2 shrink-0 min-w-0 ${className}`.trim()}
      aria-label="Italian Watches home"
    >
      <img
        src="/brand/mark.svg"
        alt=""
        width={36}
        height={36}
        className="site-logo__mark"
        decoding="async"
      />
      <span className="site-logo__wordmark">Italian Watches</span>
    </Link>
  );
}
