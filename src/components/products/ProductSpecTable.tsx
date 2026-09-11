import Link from "next/link";
import { buildSpecRows } from "@/lib/product-specs";
import type { WatchMetafields } from "@/lib/types";

export function ProductSpecTable({ metafields }: { metafields: WatchMetafields }) {
  const rows = buildSpecRows(metafields);

  return (
    <section className="pdp-specs" aria-labelledby="pdp-specs-heading">
      <h2 id="pdp-specs-heading" className="type-heading-lg mb-6">
        Specifications
      </h2>
      <table className="w-full type-caption-md">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key}
              style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
            >
              <th className="py-3 text-left font-normal text-[var(--color-mute)] w-2/5 align-top">
                {row.label}
              </th>
              <td className="py-3 capitalize text-[var(--color-ink)] whitespace-pre-line">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="type-caption-sm mt-4 text-[var(--color-mute)]">
        Looking for a specific reference?{" "}
        <Link href="/contact" className="underline underline-offset-2">
          Speak to a specialist
        </Link>
        .
      </p>
    </section>
  );
}
