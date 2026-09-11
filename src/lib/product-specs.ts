import type { WatchMetafields } from "./types";

export type SpecRow = {
  key: keyof WatchMetafields | "chronograph";
  label: string;
  value: string;
};

function formatList(values: string[]) {
  return values.length ? values.join(", ") : "";
}

function formatBool(value: boolean) {
  return value ? "Yes" : "No";
}

/** Full 19-field spec table rows from design-plan metafields. */
export function buildSpecRows(metafields: WatchMetafields): SpecRow[] {
  const rows: Array<[SpecRow["key"], string, string]> = [
    ["reference_number", "Reference", metafields.reference_number],
    ["line", "Line", metafields.line.replace(/-/g, " ")],
    ["gender", "Gender", metafields.gender],
    ["movement", "Movement", metafields.movement],
    ["chronograph", "Chronograph", formatBool(metafields.is_chronograph)],
    [
      "case_size_mm",
      "Case size",
      metafields.case_size_mm ? `${metafields.case_size_mm}mm` : "",
    ],
    ["case_material", "Case material", formatList(metafields.case_material)],
    ["dial_color", "Dial", metafields.dial_color],
    ["crystal", "Crystal", metafields.crystal],
    ["water_resistance", "Water resistance", metafields.water_resistance],
    ["strap_type", "Strap / bracelet", metafields.strap_type],
    ["power_reserve", "Power reserve", metafields.power_reserve],
    ["tier", "Tier", metafields.tier],
    ["purchase_mode", "Purchase mode", metafields.purchase_mode],
    ["is_limited", "Limited edition", formatBool(metafields.is_limited)],
    ["box_papers", "Box & papers", metafields.box_papers],
    [
      "year_of_production",
      "Year of production",
      metafields.year_of_production != null
        ? String(metafields.year_of_production)
        : "",
    ],
    ["condition", "Condition", metafields.condition],
    ["service_history", "Service history", metafields.service_history],
  ];

  return rows.map(([key, label, value]) => ({
    key,
    label,
    value: value?.trim() ? value : "—",
  }));
}

export function buildQuickSpecs(metafields: WatchMetafields) {
  return [
    ["Movement", metafields.movement || "—"],
    ["Case", metafields.case_size_mm ? `${metafields.case_size_mm}mm` : "—"],
    ["Material", formatList(metafields.case_material) || "—"],
    ["Water", metafields.water_resistance || "—"],
  ] as const;
}
