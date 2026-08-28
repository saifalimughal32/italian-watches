"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WatchCard } from "@/components/WatchCard";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import type { WatchProduct } from "@/lib/types";

export function WishlistPageContent() {
  const { handles } = useWishlist();
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!handles.length) {
        if (active) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const response = await fetch("/api/products?handles=" + encodeURIComponent(handles.join(",")));
      const json = (await response.json()) as { products?: WatchProduct[] };
      if (active) {
        setProducts(json.products ?? []);
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [handles]);

  if (loading) {
    return (
      <Container>
        <div className="section-rhythm text-center">
          <p className="type-caption-md">Loading wishlist...</p>
        </div>
      </Container>
    );
  }

  if (!handles.length || products.length === 0) {
    return (
      <Container>
        <div className="section-rhythm text-center max-w-lg mx-auto">
          <h1 className="type-heading-xl normal-case">Wishlist</h1>
          <p className="type-caption-md mt-4">Your saved watches will appear here.</p>
          <Button href="/collections/all" variant="primary" className="mt-8">
            Explore Watches
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="section-rhythm">
        <h1 className="type-heading-xl normal-case">Wishlist</h1>
        <p className="type-caption-md mt-2">{products.length} saved watch{products.length === 1 ? "" : "es"}</p>
        <div className="grid-products mt-10">
          {products.map((product) => (
            <WatchCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Container>
  );
}
