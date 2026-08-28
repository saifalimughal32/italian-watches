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

const WISHLIST_STORAGE_KEY = "iw-wishlist";

type WishlistContextValue = {
  handles: string[];
  toggle: (handle: string) => void;
  has: (handle: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [handles, setHandles] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        setHandles(JSON.parse(stored) as string[]);
      } catch {
        setHandles([]);
      }
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setHandles(next);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (handle: string) => {
      persist(handles.includes(handle) ? handles.filter((item) => item !== handle) : [...handles, handle]);
    },
    [handles, persist]
  );

  const has = useCallback((handle: string) => handles.includes(handle), [handles]);

  const value = useMemo(() => ({ handles, toggle, has }), [handles, toggle, has]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
