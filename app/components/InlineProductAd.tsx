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

export default function InlineProductAd({ startIndex = 0 }: { startIndex?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Products load failed");
        return response.json();
      })
      .then((data: Product[]) => {
        if (!cancelled && Array.isArray(data)) {
          setProducts(data.slice(startIndex, startIndex + 3));
        }
      })
      .catch((error) => {
        console.error("Inline product ad error:", error);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || products.length === 0) return null;

  return (
    <div className="col-span-2 grid grid-cols-3 gap-1.5 sm:gap-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="min-w-0 overflow-hidden rounded-lg border border-red-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-1 bg-red-50 px-1.5 py-1">
            <span className="truncate text-[8px] font-black text-red-700 sm:text-[10px]">
              
            </span>
            <span className="text-[8px] text-slate-500">Ad</span>
          </div>

          <div className="flex h-20 items-center justify-center bg-slate-50 sm:h-28">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={(event) => { event.currentTarget.style.display = "none"; }}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-center text-[9px] text-slate-400">
                No image
              </span>
            )}
          </div>

          <div className="p-1.5 sm:p-2">
            <h3 className="line-clamp-2 text-[10px] font-bold leading-tight text-slate-900 sm:text-xs">
              {product.name}
            </h3>

            <p className="mt-1 text-xs font-black text-slate-900 sm:text-sm">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            {product.meeshoUrl?.trim() && (
              <a
                href={product.meeshoUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-1 block rounded bg-red-600 px-1 py-1 text-center text-[9px] font-bold text-white hover:bg-red-700 sm:text-[11px]"
              >
                Buy Now
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
