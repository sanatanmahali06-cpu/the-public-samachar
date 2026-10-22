"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  meeshoUrl: string;
};

export default function ShoppingDeals() {
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
        console.error("Shopping deals error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="mx-auto my-6 w-full max-w-7xl px-3 sm:px-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            Shopping Deals
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
            Deals & Products
          </h2>
        </div>
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
          Shop Now
        </span>
      </div>

      {loading ? (
        <p className="rounded-xl bg-white p-5 text-center text-sm text-slate-500">
          Deals load ho rahe hain...
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex aspect-square items-center justify-center bg-slate-50">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="px-3 text-center text-sm text-slate-400">
                    Product image unavailable
                  </span>
                )}
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-slate-900">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {product.description}
                  </p>
                )}

                <p className="mt-3 text-lg font-black text-slate-900">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <a
                  href={product.meeshoUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-3 block rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-bold text-white hover:bg-red-700"
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