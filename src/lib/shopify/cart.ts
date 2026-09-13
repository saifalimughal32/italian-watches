import { shopifyFetch } from "./client";
import { CART_FRAGMENT } from "./fragments";
import { mapShopifyCart } from "./mappers";
import type { Cart } from "../types";

const NO_STORE = { cache: "no-store" as const };

const CART_CREATE = `
  ${CART_FRAGMENT}
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_CART = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

function assertNoErrors(userErrors: Array<{ message: string }>) {
  if (userErrors.length) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }
}

export async function createCart(variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: Parameters<typeof mapShopifyCart>[0] | null; userErrors: Array<{ message: string }> };
  }>(CART_CREATE, {
    input: { lines: [{ merchandiseId: variantId, quantity }] },
  }, NO_STORE);

  assertNoErrors(data.cartCreate.userErrors);
  if (!data.cartCreate.cart) throw new Error("Failed to create cart");
  return mapShopifyCart(data.cartCreate.cart);
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Parameters<typeof mapShopifyCart>[0] | null; userErrors: Array<{ message: string }> };
  }>(CART_LINES_ADD, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  }, NO_STORE);

  assertNoErrors(data.cartLinesAdd.userErrors);
  if (!data.cartLinesAdd.cart) throw new Error("Failed to update cart");
  return mapShopifyCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: Parameters<typeof mapShopifyCart>[0] | null; userErrors: Array<{ message: string }> };
  }>(CART_LINES_UPDATE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  }, NO_STORE);

  assertNoErrors(data.cartLinesUpdate.userErrors);
  if (!data.cartLinesUpdate.cart) throw new Error("Failed to update cart line");
  return mapShopifyCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: Parameters<typeof mapShopifyCart>[0] | null; userErrors: Array<{ message: string }> };
  }>(CART_LINES_REMOVE, {
    cartId,
    lineIds: [lineId],
  }, NO_STORE);

  assertNoErrors(data.cartLinesRemove.userErrors);
  if (!data.cartLinesRemove.cart) throw new Error("Failed to remove cart line");
  return mapShopifyCart(data.cartLinesRemove.cart);
}

export type CodCheckoutDetails = {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
};

const CART_ATTRIBUTES_UPDATE = `
  ${CART_FRAGMENT}
  mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_BUYER_IDENTITY_UPDATE = `
  ${CART_FRAGMENT}
  mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/** Attach COD delivery details to the cart, then return checkout URL. */
export async function prepareCodCheckout(
  cartId: string,
  details: CodCheckoutDetails
): Promise<Cart> {
  const attributes = [
    { key: "Payment Method", value: "Cash on Delivery (COD)" },
    { key: "Full Name", value: details.fullName },
    { key: "Phone", value: details.phone },
    { key: "City", value: details.city },
    { key: "Address", value: details.address },
    ...(details.notes?.trim()
      ? [{ key: "Order Notes", value: details.notes.trim() }]
      : []),
  ];

  const attrData = await shopifyFetch<{
    cartAttributesUpdate: {
      cart: Parameters<typeof mapShopifyCart>[0] | null;
      userErrors: Array<{ message: string }>;
    };
  }>(CART_ATTRIBUTES_UPDATE, { cartId, attributes }, NO_STORE);

  assertNoErrors(attrData.cartAttributesUpdate.userErrors);

  const buyerIdentity: {
    phone: string;
    countryCode: "PK";
    email?: string;
  } = {
    phone: details.phone,
    countryCode: "PK",
  };

  if (details.email?.trim()) {
    buyerIdentity.email = details.email.trim();
  }

  const buyerData = await shopifyFetch<{
    cartBuyerIdentityUpdate: {
      cart: Parameters<typeof mapShopifyCart>[0] | null;
      userErrors: Array<{ message: string }>;
    };
  }>(CART_BUYER_IDENTITY_UPDATE, {
    cartId,
    buyerIdentity,
  }, NO_STORE);

  assertNoErrors(buyerData.cartBuyerIdentityUpdate.userErrors);
  if (!buyerData.cartBuyerIdentityUpdate.cart) {
    // Attributes already saved — still return the cart from attributes update
    if (attrData.cartAttributesUpdate.cart) {
      return mapShopifyCart(attrData.cartAttributesUpdate.cart);
    }
    throw new Error("Failed to prepare COD checkout");
  }

  return mapShopifyCart(buyerData.cartBuyerIdentityUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Parameters<typeof mapShopifyCart>[0] | null }>(
    GET_CART,
    { cartId },
    NO_STORE
  );

  return data.cart ? mapShopifyCart(data.cart) : null;
}
