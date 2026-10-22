"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  excerpt?: string | null;
  content: string;
  image?: string | null;
  video?: string | null;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
  category?: {
    name: string;
  } | null;
  reporter?: {
    name: string;
    username: string;
  } | null;
};

export default function ApprovedNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  async function loadNews() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin/reporter-news?status=published",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "News fetch failed");
      }

      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Approved news load nahi hui");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function rejectNews(id: number) {
    if (!confirm("Is news ko reject karna hai?")) return;

    const res = await fetch("/api/admin/reporter-news", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        action: "reject",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Reject failed");
      return;
    }

    setNews((prev) => prev.filter((item) => item.id !== id));
    setSelected(null);
  }

  async function deleteNews(id: number) {
    if (!confirm("News permanently delete karna hai?")) return;

    const res = await fetch("/api/admin/reporter-news", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    setNews((prev) => prev.filter((item) => item.id !== id));
    setSelected(null);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-green-700">
              Approved News
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Approved / Published Reporter News
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/reporter-news"
              className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-700"
            >
              Pending News
            </a>

            <a
              href="/admin/rejected-news"
              className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              Rejected News
            </a>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center font-bold">
            Approved news loading...
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center font-bold text-slate-600">
            Abhi koi approved news nahi hai.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      PUBLISHED
                    </span>

                    {item.category?.name && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {item.category.name}
                      </span>
                    )}

                    {item.video && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                        VIDEO
                      </span>
                    )}
                  </div>

                  <h2 className="line-clamp-2 text-xl font-black text-slate-900">
                    {item.title}
                  </h2>

                  {item.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.excerpt}
                    </p>
                  )}

                  <div className="mt-4 text-xs font-semibold text-slate-500">
                    Reporter: {item.reporter?.name || "Unknown"}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {new Date(
                      item.publishedAt || item.createdAt
                    ).toLocaleDateString("hi-IN")}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelected(item)}
                      className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      onClick={() => rejectNews(item.id)}
                      className="rounded-xl bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => deleteNews(item.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white">
              <div className="flex items-center justify-between border-b p-5">
                <h2 className="text-2xl font-black">News Preview</h2>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-slate-200 px-4 py-2 font-black hover:bg-slate-300"
                >
                  Close
                </button>
              </div>

              <div className="p-5 md:p-7">
                {selected.image && (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="mb-6 w-full rounded-2xl object-cover"
                  />
                )}

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    PUBLISHED
                  </span>

                  {selected.category?.name && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {selected.category.name}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-black leading-tight">
                  {selected.title}
                </h2>

                <div className="mt-3 text-sm text-slate-500">
                  Reporter: {selected.reporter?.name || "Unknown"}
                </div>

                {selected.excerpt && (
                  <p className="mt-6 text-lg font-semibold leading-8 text-slate-700">
                    {selected.excerpt}
                  </p>
                )}

                {selected.video && (
                  <div className="mt-6">
                    <p className="mb-3 text-xl font-black">News Video</p>

                    <div className="overflow-hidden rounded-2xl bg-black">
                      <div className="aspect-video">
                        <iframe
                          src={
                            selected.video.includes("youtu.be/")
                              ? `https://www.youtube.com/embed/${selected.video.split("youtu.be/")[1].split("?")[0]}`
                              : selected.video.includes("watch?v=")
                                ? `https://www.youtube.com/embed/${new URL(selected.video).searchParams.get("v")}`
                                : selected.video
                          }
                          title={selected.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    <a
                      href={selected.video}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block break-all text-sm font-semibold text-blue-600 underline"
                    >
                      Video link: {selected.video}
                    </a>
                  </div>
                )}

                <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-800">
                  {selected.content}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() => rejectNews(selected.id)}
                    className="rounded-xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-600"
                  >
                    Reject News
                  </button>

                  <button
                    onClick={() => deleteNews(selected.id)}
                    className="rounded-xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
                  >
                    Delete News
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}