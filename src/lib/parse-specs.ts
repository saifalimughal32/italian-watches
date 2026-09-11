import type { WatchMetafields } from "./types";
import { stripHtml } from "./format-description";

type SpecDraft = Partial<
  Pick<
    WatchMetafields,
    | "movement"
    | "case_size_mm"
    | "case_material"
    | "dial_color"
    | "crystal"
    | "water_resistance"
    | "strap_type"
    | "power_reserve"
    | "reference_number"
  >
>;

function normalizeLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPairs(text: string): Array<[string, string]> {
  const cleaned = stripHtml(text)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const pairs: Array<[string, string]> = [];

  // "Label : Value Label2 : Value2"
  const colonPattern =
    /(Specification Quality|Quality|Movement|Glass|Crystal|Water Resistance|Dial Color|Strap Color|Strap|Material|Case Size|Case|Reference|Ref|Power Reserve|Warranty)\s*[:：]\s*/gi;

  const parts = cleaned.split(colonPattern).filter(Boolean);
  // split with capturing groups alternates: value, label, value, label...
  // Actually with capturing group, results are [before, label1, after1, label2, after2...]
  const matches = [...cleaned.matchAll(
    /(Specification Quality|Quality|Movement|Glass|Crystal|Water Resistance|Dial Color|Strap Color|Strap|Material|Case Size|Case|Reference|Ref\.?|Power Reserve|Warranty)\s*[:：]\s*([^:]+?)(?=(?:Specification Quality|Quality|Movement|Glass|Crystal|Water Resistance|Dial Color|Strap Color|Strap|Material|Case Size|Case|Reference|Ref\.?|Power Reserve|Warranty)\s*[:：]|$)/gi
  )];

  for (const match of matches) {
    pairs.push([match[1], match[2].trim()]);
  }

  if (pairs.length) return pairs;

  // Fallback: line-based "Label: Value"
  for (const line of cleaned.split(/\n+/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    pairs.push([line.slice(0, idx).trim(), line.slice(idx + 1).trim()]);
  }

  void parts;
  return pairs;
}

function parseCaseSize(value: string) {
  const match = value.match(/(\d+(?:\.\d+)?)\s*mm/i) ?? value.match(/\b(\d{2})\b/);
  return match ? Number(match[1]) : undefined;
}

function parseMaterials(value: string) {
  const lower = value.toLowerCase();
  const materials: string[] = [];
  if (lower.includes("steel") || lower.includes("stainless")) materials.push("steel");
  if (lower.includes("titanium")) materials.push("titanium");
  if (lower.includes("gold")) materials.push("gold");
  if (lower.includes("ceramic")) materials.push("ceramic");
  return materials.length ? materials : [value];
}

function parseWater(value: string) {
  const meters = value.match(/(\d+)\s*m/i);
  if (meters) return `${meters[1]}m`;
  return value;
}

/**
 * Infer watch specs from freeform Shopify product descriptions
 * when custom metafields are missing.
 */
export function parseSpecsFromDescription(description?: string): SpecDraft {
  if (!description?.trim()) return {};

  const draft: SpecDraft = {};
  const pairs = extractPairs(description);

  for (const [rawLabel, rawValue] of pairs) {
    const label = normalizeLabel(rawLabel);
    const value = rawValue.replace(/\s+/g, " ").trim();
    if (!value) continue;

    if (label.includes("movement")) {
      draft.movement = value.toLowerCase().includes("automatic")
        ? "automatic"
        : value.toLowerCase().includes("quartz")
          ? "quartz"
          : value.toLowerCase();
    } else if (label === "glass" || label.includes("crystal")) {
      draft.crystal = value.toLowerCase().includes("sapphire") ? "Sapphire" : value;
    } else if (label.includes("water")) {
      draft.water_resistance = parseWater(value);
    } else if (label.includes("dial")) {
      const color = value.split(/[·|,/]/)[0]?.trim() ?? value;
      draft.dial_color = color;
    } else if (label.includes("strap")) {
      const strap = value.toLowerCase();
      draft.strap_type = strap.includes("bracelet")
        ? "bracelet"
        : strap.includes("leather")
          ? "leather"
          : strap.includes("rubber") || strap.includes("silicone")
            ? "rubber"
            : value;
    } else if (label.includes("material")) {
      draft.case_material = parseMaterials(value);
    } else if (label.includes("case size") || label === "case") {
      const size = parseCaseSize(value);
      if (size) draft.case_size_mm = size;
    } else if (label.includes("reference") || label === "ref") {
      draft.reference_number = value;
    } else if (label.includes("power")) {
      draft.power_reserve = value;
    }
  }

  // Title-less fallbacks from whole body
  const body = stripHtml(description);
  if (!draft.water_resistance) {
    const water = body.match(/water\s*resistance[^0-9]*(\d+)\s*m/i);
    if (water) draft.water_resistance = `${water[1]}m`;
  }
  if (!draft.case_size_mm) {
    const size = body.match(/(\d{2})\s*mm/i);
    if (size) draft.case_size_mm = Number(size[1]);
  }
  if (!draft.crystal && /sapphire/i.test(body)) {
    draft.crystal = "Sapphire";
  }
  if (!draft.movement) {
    if (/automatic/i.test(body)) draft.movement = "automatic";
    else if (/quartz/i.test(body)) draft.movement = "quartz";
  }
  if (!draft.case_material?.length && /stainless\s*steel|steel/i.test(body)) {
    draft.case_material = ["steel"];
  }
  if (!draft.dial_color) {
    const dial = body.match(/dial\s*color\s*[:：]?\s*([A-Za-z]+)/i);
    if (dial) draft.dial_color = dial[1];
  }

  return draft;
}

export function mergeMetafieldsWithDescription(
  metafields: WatchMetafields,
  description?: string
): WatchMetafields {
  const inferred = parseSpecsFromDescription(description);

  return {
    ...metafields,
    movement: metafields.movement || inferred.movement || metafields.movement,
    case_size_mm: metafields.case_size_mm || inferred.case_size_mm || 0,
    case_material:
      metafields.case_material.length > 0
        ? metafields.case_material
        : inferred.case_material ?? [],
    dial_color: metafields.dial_color || inferred.dial_color || "",
    crystal: metafields.crystal || inferred.crystal || "",
    water_resistance: metafields.water_resistance || inferred.water_resistance || "",
    strap_type: metafields.strap_type || inferred.strap_type || "",
    power_reserve: metafields.power_reserve || inferred.power_reserve || "",
    reference_number: metafields.reference_number || inferred.reference_number || "",
  };
}

/** Format description for readable PDP paragraphs. */
export function formatDescriptionForDisplay(description?: string) {
  if (!description?.trim()) return "";

  const text = stripHtml(description).replace(/\s+/g, " ").trim();
  const pairs = extractPairs(description);

  if (pairs.length >= 3) {
    return pairs.map(([label, value]) => `${label.trim()}: ${value.trim()}`).join("\n");
  }

  return text;
}
