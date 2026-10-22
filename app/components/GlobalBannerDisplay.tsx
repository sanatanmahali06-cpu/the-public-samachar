"use client";

import { useEffect, useState } from "react";

type Banner = {
  id: number;
  name: string;
  imageUrl: string;
  targetUrl: string;
  placements: string[];
  interval: number;
  active: boolean;
};

export default function GlobalBannerDisplay({
  placement,
}: {
  placement: "trending_below" | "hero_below" | "trending_1" | "trending_2" | "trending_3";
}) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/banners")
      .then((response) => {
        if (!response.ok) throw new Error("Banner request failed");
        return response.json();
      })
      .then((data: Banner[]) => {
        if (!cancelled && Array.isArray(data)) {
          setBanners(
            data.filter(
              (banner) =>
                banner.active && banner.placements?.includes(placement)
            )
          );
        }
      })
      .catch(() => {
        if (!cancelled) setBanners([]);
      });

    return () => {
      cancelled = true;
    };
  }, [placement]);

  if (banners.length === 0) return null;

  return (
    <div className={`w-full overflow-hidden ${placement === "hero_below" ? "p-0 lg:pt-0 lg:pb-0" : "pb-2 min-w-0 w-full pb-2"} `}>
      <div className={`grid w-full min-w-0 grid-cols-1 gap-3 ${placement.startsWith("trending_") ? "lg:grid-cols-1" : "lg:justify-items-center"}`}>
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`block w-full overflow-hidden sm:rounded-xl sm:bg-white sm:shadow-md ${placement === "hero_below" ? "lg:w-[560px]" : "lg:w-full"}`}
          >
            <div className="relative">
              <img
                src={banner.imageUrl}
                alt={banner.name}
                className={`block h-auto max-h-none w-full object-cover sm:max-h-96 sm:object-contain ${placement === "hero_below" ? "lg:max-h-[180px] lg:object-contain" : "lg:max-h-none"}`}
                loading="lazy"
              />
              <span className="absolute bottom-2 right-2 rounded-full border-2 border-white bg-yellow-400 px-4 py-2 text-sm font-black tracking-wide text-red-700 shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-yellow-300 sm:bottom-3 sm:right-3">
                BUY NOW →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}