"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Cart } from "@/lib/types";

const CART_STORAGE_KEY = "iw-cart-id";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

async function requestCart(body: Record<string, unknown>) {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as { cart?: Cart | null; error?: string };
  if (!response.ok) {
    throw new Error(json.error ?? "Cart request failed");
  }

  return json.cart ?? null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const cartId = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartId) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`);
      const json = (await response.json()) as { cart?: Cart | null };
      setCart(json.cart ?? null);
      if (!json.cart) localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true);
      try {
        const cartId = localStorage.getItem(CART_STORAGE_KEY);
        const nextCart = cartId
          ? await requestCart({ action: "add", cartId, variantId, quantity })
          : await requestCart({ action: "create", variantId, quantity });

        if (nextCart) {
          localStorage.setItem(CART_STORAGE_KEY, nextCart.id);
          setCart(nextCart);
        }
      } catch (error) {
        // Clear stale cart ids that cause repeated failures
        if (
          error instanceof Error &&
          /cart|not found|invalid/i.test(error.message)
        ) {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartId) return;

    setLoading(true);
    try {
      const nextCart = await requestCart({ action: "update", cartId, lineId, quantity });
      setCart(nextCart);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeLine = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartId) return;

    setLoading(true);
    try {
      const nextCart = await requestCart({ action: "remove", cartId, lineId });
      setCart(nextCart);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCart(null);
  }, []);

  const value = useMemo(
    () => ({ cart, loading, addItem, updateLine, removeLine, refresh, clearCart }),
    [cart, loading, addItem, updateLine, removeLine, refresh, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
