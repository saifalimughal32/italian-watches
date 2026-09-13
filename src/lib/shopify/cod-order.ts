import { shopifyAdminFetch } from "./admin";

export type CodOrderLine = {
  variantId: string;
  quantity: number;
  title: string;
  price: string;
};

export type CodOrderInput = {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
  lines: CodOrderLine[];
};

export type CodOrderResult = {
  orderId: string;
  orderName: string;
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Customer", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/** Shopify expects E.164. Convert common PK formats like 03XXXXXXXXX → +923XXXXXXXXX */
export function normalizePakistanPhone(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d+]/g, "");

  let normalized = digits;
  if (normalized.startsWith("+")) {
    normalized = `+${normalized.slice(1).replace(/\D/g, "")}`;
  } else {
    const onlyDigits = normalized.replace(/\D/g, "");
    if (onlyDigits.startsWith("0092")) {
      normalized = `+${onlyDigits.slice(2)}`;
    } else if (onlyDigits.startsWith("92")) {
      normalized = `+${onlyDigits}`;
    } else if (onlyDigits.startsWith("0") && onlyDigits.length >= 10) {
      normalized = `+92${onlyDigits.slice(1)}`;
    } else if (onlyDigits.length === 10) {
      normalized = `+92${onlyDigits}`;
    } else {
      normalized = onlyDigits ? `+${onlyDigits}` : trimmed;
    }
  }

  if (!/^\+92\d{10}$/.test(normalized)) {
    throw new Error(
      "Phone is invalid. Use a Pakistan mobile like 03XX XXXXXXX."
    );
  }

  return normalized;
}

const DRAFT_ORDER_CREATE = `
  mutation CodDraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DRAFT_ORDER_COMPLETE = `
  mutation CodDraftOrderComplete($id: ID!) {
    draftOrderComplete(id: $id, paymentPending: true) {
      draftOrder {
        id
        order {
          id
          name
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function assertNoUserErrors(userErrors: Array<{ message: string }>) {
  if (userErrors.length) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }
}

/** Create a payment-pending COD order in Shopify Admin (no hosted checkout). */
export async function createCodOrder(input: CodOrderInput): Promise<CodOrderResult> {
  if (!input.lines.length) {
    throw new Error("Your bag is empty.");
  }

  const { firstName, lastName } = splitName(input.fullName);
  const phone = normalizePakistanPhone(input.phone);
  const phoneDisplay = input.phone.trim();
  const noteParts = [
    "Payment: Cash on Delivery (COD)",
    `Phone: ${phoneDisplay}`,
    `City: ${input.city}`,
    input.notes?.trim() ? `Notes: ${input.notes.trim()}` : null,
  ].filter(Boolean);

  const draftData = await shopifyAdminFetch<{
    draftOrderCreate: {
      draftOrder: { id: string; name: string } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(DRAFT_ORDER_CREATE, {
    input: {
      note: noteParts.join("\n"),
      tags: ["COD", "cash-on-delivery"],
      email: input.email?.trim() || undefined,
      phone,
      shippingAddress: {
        firstName,
        lastName,
        address1: input.address.trim(),
        city: input.city.trim(),
        countryCode: "PK",
        phone,
      },
      customAttributes: [
        { key: "Payment Method", value: "Cash on Delivery (COD)" },
        { key: "Phone", value: phoneDisplay },
        { key: "City", value: input.city.trim() },
      ],
      lineItems: input.lines.map((line) => ({
        variantId: line.variantId,
        quantity: line.quantity,
      })),
    },
  });

  assertNoUserErrors(draftData.draftOrderCreate.userErrors);
  const draft = draftData.draftOrderCreate.draftOrder;
  if (!draft) throw new Error("Failed to create COD draft order");

  const completeData = await shopifyAdminFetch<{
    draftOrderComplete: {
      draftOrder: {
        id: string;
        order: { id: string; name: string } | null;
      } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(DRAFT_ORDER_COMPLETE, { id: draft.id });

  assertNoUserErrors(completeData.draftOrderComplete.userErrors);
  const order = completeData.draftOrderComplete.draftOrder?.order;
  if (!order) {
    throw new Error("COD draft created but order completion failed");
  }

  return {
    orderId: order.id,
    orderName: order.name,
  };
}
