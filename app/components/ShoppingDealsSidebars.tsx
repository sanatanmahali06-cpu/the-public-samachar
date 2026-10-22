"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  meeshoUrl: string;
  showInShoppingDeals: boolean;
  showInBestDeals: boolean;
};

type Props = {
  side: "left" | "right";
};

export default function ShoppingDealsSidebars({ side }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Products load failed");

        const data = await response.json();
        if (!cancelled && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Shopping sidebar error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProducts =
    side === "left"
      ? products.filter((product) => product.showInShoppingDeals)
      : products.filter((product) => product.showInBestDeals);

  const heading = side === "left" ? "Shopping Deals" : "Best Deals";

  return (
    <section className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="mb-3 border-b border-red-200 pb-2 text-base font-black text-red-600">
        {heading}
      </h2>

      {loading ? (
        <p className="py-4 text-center text-xs text-slate-500">
          Loading deals...
        </p>
      ) : visibleProducts.length === 0 ? (
        <p className="py-4 text-center text-xs text-slate-500">
          No deals available yet.
        </p>
      ) : (
        <div className="flex min-w-0 flex-col gap-4">
          {visibleProducts.slice(0, 3).map((product) => (
            <article
              key={product.id}
              className="min-w-0 overflow-hidden rounded-lg border border-slate-100"
            >
              <div className="flex aspect-square max-h-[140px] items-center justify-center overflow-hidden bg-slate-50">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="p-2 text-center text-xs text-slate-400">
                    Image unavailable
                  </span>
                )}
              </div>

              <div className="min-w-0 p-2">
                <h3 className="line-clamp-2 min-h-[2rem] break-words text-xs font-bold leading-4 text-slate-900">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm font-black text-slate-900">
                  {"\u20B9"}{Number(product.price).toLocaleString("en-IN")}
                </p>

                <a
                  href={product.meeshoUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-1 block rounded-md bg-red-600 px-2 py-1.5 text-center text-xs font-bold text-white hover:bg-red-700"
                >
                  Buy Now
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
