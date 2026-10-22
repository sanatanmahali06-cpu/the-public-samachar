import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://the-public-samachar.vercel.app";

  const news = await prisma.news.findMany({
    where: { status: "published" },
    select: {
      id: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return [
    {
      url: `${baseUrl}/all-news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...news.map((item) => ({
      url: `${baseUrl}/news/${item.id}`,
      lastModified: item.updatedAt ?? item.publishedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}