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
          src="/brand/mark-clean.png"
          alt="Italian Watches"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
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
          src="/brand/logo-clean.png"
          alt="Italian Watches"
          width={220}
          height={72}
          className="h-12 w-auto max-w-[180px] md:h-16 md:max-w-none object-contain"
          decoding="async"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 shrink-0 min-w-0 ${className}`.trim()}
      aria-label="Italian Watches home"
    >
      <img
        src="/brand/mark-clean.png"
        alt=""
        width={36}
        height={36}
        className="h-8 w-8 md:h-9 md:w-9 object-contain shrink-0"
        decoding="async"
      />
      <span className="site-logo__wordmark hidden md:inline">Italian Watches</span>
    </Link>
  );
}
