"use client";

import { Fragment, useEffect, useState } from "react";
import ShareButtons from "@/app/components/ShareButtons";
import InlineProductAd from "@/app/components/InlineProductAd";

type NewsItem = {
  id: number;
  title: string;
  excerpt: string | null;
  image: string | null;
  publishedAt: string | null;
  createdAt: string;
  category?: { name: string } | null;
};

type Banner = {
  id: number;
  name: string;
  imageUrl: string;
  targetUrl: string;
  placements: string[];
  interval: number;
  active: boolean;
};

type Props = {
  news: NewsItem[];
  fallbackImage: string;
  formatDate: (date: string | null) => string;
  readLink: (item: any) => string;
};

export default function NewsGridWithAds({
  news,
  fallbackImage,
  formatDate,
  readLink,
}: Props) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/banners")
      .then((r) => {
        if (!r.ok) throw new Error("Banner request failed");
        return r.json();
      })
      .then((data: Banner[]) => {
        if (!cancelled && Array.isArray(data)) {
          setBanners(data.filter((b) =>
            b.active && b.placements?.includes("latest_news") &&
            [1, 2, 3, 5].includes(b.interval)
          ));
        }
      })
      .catch(() => {
        if (!cancelled) setBanners([]);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-3">
      {news.map((item, index) => (
        <Fragment key={item.id}>
          <article className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl sm:rounded-2xl">
            <a href={readLink(item)} className="block cursor-pointer">
              <img
                src={item.image || fallbackImage}
                alt={item.title}
                className="h-28 w-full object-contain bg-slate-100 sm:h-52 sm:object-contain"
              />
            </a>

            <div className="flex flex-1 flex-col px-3 py-2 sm:px-5 sm:py-4">
              <span className="text-[10px] font-black text-red-600 sm:text-sm">
                {item.category?.name || "राष्ट्रीय"}
              </span>

              <h3 className="mt-1.5 line-clamp-2 text-sm font-black leading-snug sm:mt-2 sm:text-xl sm:leading-tight">
                <a href={readLink(item)} className="hover:text-red-600">
                  {item.title}
                </a>
              </h3>

              <p className="mt-2 hidden line-clamp-3 text-xs leading-5 text-slate-600 sm:mt-3 sm:block sm:text-sm sm:leading-6">
                {item.excerpt ||
                  "देश और दुनिया से जुड़ी महत्वपूर्ण खबरों की जानकारी The Public Samachar पर पढ़ें।"}
              </p>

              <div className="mt-0 flex min-w-0 flex-row flex-wrap items-center justify-between gap-1 pt-0 sm:mt-4 sm:gap-3">
                <span className="block text-[9px] leading-3 text-slate-400 sm:mt-1 sm:text-xs">
                  {formatDate(item.publishedAt || item.createdAt)}
                </span>

                <a
                  href={readLink(item)}
                  className="whitespace-nowrap text-xs font-bold text-red-600 hover:underline sm:text-base"
                >
                  पढ़ें →
                </a>

                <div className="hidden sm:block">
                  <ShareButtons
                    slug={String(item.id)}
                    compact
                  />
                </div>
              </div>
            </div>
          </article>
          {(index + 1) % 2 === 0 && (
            <div className="col-span-2 lg:hidden">
              <InlineProductAd startIndex={Math.floor((index + 1) / 2 - 1) * 3} />
            </div>
          )}
          {(index + 1) % 3 === 0 && (
            <div className="col-span-2 hidden lg:col-span-3 lg:block">
              <InlineProductAd startIndex={Math.floor((index + 1) / 3 - 1) * 3} />
            </div>
          )}
          {banners.map((b) => (
            <Fragment key={`global-banner-${b.id}-${item.id}`}>
              {(index + 1) % 2 === 0 && (
                <div className="col-span-2 w-full min-w-0 overflow-hidden lg:hidden">
                  <a href={b.targetUrl} target="_blank" rel="noopener noreferrer sponsored" className="block w-full overflow-hidden">
                    <img src={b.imageUrl} alt={b.name} className="block h-auto max-h-none w-full object-cover" loading="lazy" />
                  </a>
                </div>
              )}
              {(index + 1) % b.interval === 0 && (
                <div className="col-span-2 hidden min-w-0 overflow-hidden lg:col-span-3 lg:block">
                  <a href={b.targetUrl} target="_blank" rel="noopener noreferrer sponsored" className="block w-full overflow-hidden rounded-xl shadow-md">
                    <img src={b.imageUrl} alt={b.name} className="block h-auto max-h-96 w-full object-contain" loading="lazy" />
                  </a>
                </div>
              )}
            </Fragment>
          ))}
          </Fragment>
      ))}
    </div>
  );
}