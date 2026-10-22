import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "सभी खबरें | THE PUBLIC SAMACHAR",
  description: "THE PUBLIC SAMACHAR की सभी प्रकाशित खबरें पढ़ें।",
  alternates: {
    canonical: "https://the-public-samachar.vercel.app/all-news",
  },
};

export default async function AllNewsPage() {
  const news = await prisma.news.findMany({
    where: { status: "published" },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      createdAt: true,
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-5 text-slate-900">
      <Link href="/" className="font-bold text-red-600">
        ← मुख्य पृष्ठ
      </Link>

      <h1 className="my-6 text-3xl font-black">सभी खबरें</h1>

      {news.length === 0 ? (
        <p>अभी कोई प्रकाशित खबर उपलब्ध नहीं है।</p>
      ) : (
        <ul className="space-y-4">
          {news.map((item) => (
            <li key={item.id} className="border-b border-slate-200 pb-4">
              <Link
                href={`/news/${item.id}`}
                className="text-lg font-bold hover:text-red-600"
              >
                {item.title}
              </Link>
              {item.category?.name ? (
                <p className="mt-1 text-sm text-slate-500">
                  श्रेणी: {item.category.name}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}