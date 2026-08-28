import { shopifyFetch } from "./client";
import { CART_FRAGMENT } from "./fragments";
import { mapShopifyCart } from "./mappers";
import type { Cart } from "../types";

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
  });

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
  });

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
  });

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
  });

  assertNoErrors(data.cartLinesRemove.userErrors);
  if (!data.cartLinesRemove.cart) throw new Error("Failed to remove cart line");
  return mapShopifyCart(data.cartLinesRemove.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Parameters<typeof mapShopifyCart>[0] | null }>(
    GET_CART,
    { cartId }
  );

  return data.cart ? mapShopifyCart(data.cart) : null;
}
