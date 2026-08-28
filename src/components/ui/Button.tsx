import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline-on-image";

const classes: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  "outline-on-image": "btn-outline-on-image",
};

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  type = "button",
}: {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  const cls = `${classes[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls}>
      {children}
    </button>
  );
}
