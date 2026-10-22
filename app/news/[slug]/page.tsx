import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShareButtons from "@/app/components/ShareButtons";
import SiteHeader from "@/app/components/SiteHeader";
import type { Metadata } from "next";
import ViewTracker from "@/app/components/ViewTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const numericId = Number(slug);

  const news =
    Number.isInteger(numericId) && numericId > 0
      ? await prisma.news.findUnique({
          where: { id: numericId },
        })
      : await prisma.news.findUnique({
          where: { slug },
        });

  if (!news || news.status !== "published") {
    return {};
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://the-public-samachar.vercel.app";

  const imageUrl = news.image
    ? `${baseUrl}/api/og/news/${news.id}`
    : `${baseUrl}/og-image.png`;

  const articleUrl = `${baseUrl}/news/${encodeURIComponent(slug)}`;
  const description = news.excerpt || news.title;

  return {
    title: news.title,
    description,

    alternates: {
      canonical: articleUrl,
    },

    openGraph: {
      title: news.title,
      description,
      url: articleUrl,
      siteName: "THE PUBLIC SAMACHAR",
      locale: "hi_IN",
      type: "article",

      publishedTime: news.publishedAt
        ? new Date(news.publishedAt).toISOString()
        : new Date(news.createdAt).toISOString(),

      authors: [news.author || "Admin"],

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      images: [imageUrl],
    },
  };
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "").trim();
      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : null;
    }

    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);

      if (parts[0] === "shorts" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }

      if (parts[0] === "embed" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default async function NewsArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const numericId = Number(slug);

  const news =
    Number.isInteger(numericId) && numericId > 0
      ? await prisma.news.findUnique({
          where: { id: numericId },
          include: {
            category: true,
            shoppingDeals: {
              include: { product: true },
              orderBy: { position: "asc" },
            },
          },
        })
      : await prisma.news.findUnique({
          where: { slug },
          include: {
            category: true,
            shoppingDeals: {
              include: { product: true },
              orderBy: { position: "asc" },
            },
          },
        });

  if (!news || news.status !== "published") {
    notFound();
  }


  const videoUrl = news.video ? getYouTubeEmbedUrl(news.video) : null;

  const latestNews = await prisma.news.findMany({
    where: {
      status: "published",
      id: { not: news.id },
    },
    include: { category: true },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 4,
  });

  const dealProducts = news.shoppingDeals.map((deal) => deal.product);
  const contentParts = news.content
    .split(/\r?\n\s*\r?\n/)
    .filter((part) => part.trim().length > 0);

  const firstBannerIndex = Math.max(0, Math.floor(contentParts.length / 4) - 1);
  const middleDealsIndex = Math.max(0, Math.floor(contentParts.length / 2) - 1);
  const secondBannerIndex = Math.max(0, Math.floor((contentParts.length * 3) / 4) - 1);

  const renderShoppingDeals = (placement: string) => {
    if (placement === "middle-one" || placement === "middle-two") {
      const isBanner1 = placement === "middle-one";
      const bannerUrl = isBanner1
        ? news.bannerAffiliateUrl?.trim() || ""
        : news.bannerAffiliateUrl2?.trim() || "";
      const bannerImage = isBanner1
        ? news.bannerImageUrl?.trim() || ""
        : news.bannerImageUrl2?.trim() || "";

      const renderBanner = (imageUrl: string, affiliateUrl: string, key: string) => {
        if (!imageUrl || !/^https?:\/\//i.test(affiliateUrl)) return null;

        return (
          <a
            key={key}
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="my-3 block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative">
              <img
                src={imageUrl}
                alt={`${news.title} sponsored offer`}
                className="block h-auto w-full object-contain"
                loading="lazy"
              />
              <span className="absolute bottom-3 right-3 rounded-full border-2 border-white bg-yellow-400 px-4 py-2 text-sm font-black tracking-wide text-red-700 shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-yellow-300">
                BUY NOW â†’
              </span>
            </div>
          </a>
        );
      };

      const banner = renderBanner(bannerImage, bannerUrl, isBanner1 ? "banner-1" : "banner-2");
      if (banner) return banner;
      return null;
    }

    if (dealProducts.length === 0) {
      return null;
    }

    return (
      <section className="my-6 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
        <div className="flex gap-2 overflow-x-auto">
          {dealProducts.map((product, index) => (
            <a
              key={`${placement}-${index}`}
              href={product.meeshoUrl?.trim() || "#"}
              target={product.meeshoUrl?.trim() ? "_blank" : undefined}
              rel={product.meeshoUrl?.trim() ? "noopener noreferrer sponsored" : undefined}
              className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-lg border border-slate-200 p-2 text-center transition hover:shadow-md"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-24 w-24 shrink-0 rounded-lg object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                  Product
                </div>
              )}
              <div className="min-w-0">
                <h3 className="line-clamp-3 text-sm font-bold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-2 font-black text-red-600">
                  â‚¹{Number(product.price).toLocaleString("en-IN")}
                </p>
                {product.meeshoUrl?.trim() && (
                  <span className="mt-2 inline-block rounded-md bg-red-600 px-3 py-2 text-xs font-bold text-white">
                    View Offer â†’
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
    );
  };
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <SiteHeader />
      <ViewTracker newsId={news.id} />

      <article className="mx-auto max-w-4xl px-2.5 py-4 sm:px-4 sm:py-8">
        <div className="mb-4 flex gap-3">
          <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
            {news.category?.name || "News"}
          </span>

          {news.isBreaking && (
            <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-bold text-white">
              BREAKING
            </span>
          )}
        </div>

        <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
          {news.title}
        </h1>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 sm:mt-4 sm:text-sm">
          <span>{news.author || "Admin"}</span>
          <span>{new Date(news.publishedAt || news.createdAt).toLocaleDateString("hi-IN")}</span>
          <span>{String.fromCodePoint(0x1F441, 0xFE0F)} {news.views.toLocaleString("en-IN")} Views</span>
        </div>

        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="mt-4 max-h-[280px] w-full rounded-xl object-cover sm:mt-7 sm:max-h-none sm:rounded-2xl"
          />
        )}

        {news.image && (
          <div className="mt-4">
            <ShareButtons slug={slug} />
          </div>
        )}

        {news.excerpt && (
          <p className="mt-4 text-base font-semibold leading-7 text-slate-700 sm:mt-7 sm:text-xl sm:leading-relaxed">
            {news.excerpt}
          </p>
        )}

        {videoUrl && (
          <div className="mt-5 overflow-hidden rounded-xl bg-black shadow-lg sm:mt-8 sm:rounded-2xl">
            <div className="aspect-video">
              <iframe
                src={videoUrl}
                title={news.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="mt-5 text-base leading-7 text-slate-800 sm:mt-7 sm:text-lg sm:leading-8">
          {contentParts.map((part, index) => (
            <div key={index}>
              <p className="mb-4 whitespace-pre-wrap">{part}</p>
              {index === firstBannerIndex && renderShoppingDeals("middle-one")}
              {index === middleDealsIndex && renderShoppingDeals("middle-deals")}
              {index === secondBannerIndex && renderShoppingDeals("middle-two")}
            </div>
          ))}
        </div>
        {renderShoppingDeals("article-bottom")}

        <ShareButtons slug={slug} />

        <section className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="mb-4 text-xl font-black text-slate-900">
            LATEST NEWS
          </h2>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4">
            {latestNews.map((item) => (
              <a
                key={item.id}
                href={`/news/${item.id}`}
                className="flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl bg-white p-2 shadow-sm transition hover:shadow-md sm:flex-row sm:gap-3 sm:p-2.5"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-full shrink-0 rounded-lg object-cover sm:h-20 sm:w-24"
                  />
                ) : (
                  <div className="h-20 w-full shrink-0 rounded-lg bg-slate-200 sm:h-20 sm:w-24" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-xs font-bold text-red-600">
                    {item.category?.name || "News"}
                  </div>

                  <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
                    {item.title}
                  </h3>

                  <div className="mt-1 text-xs text-slate-500">
                    {new Date(
                      item.publishedAt || item.createdAt
                    ).toLocaleDateString("hi-IN")}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}




