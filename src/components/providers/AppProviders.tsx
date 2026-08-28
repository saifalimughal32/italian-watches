"use client";

import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
