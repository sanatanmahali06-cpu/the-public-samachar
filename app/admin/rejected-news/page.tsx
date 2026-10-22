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
  createdAt: string;
  category?: {
    name: string;
  } | null;
  reporter?: {
    name: string;
    username: string;
  } | null;
};

export default function RejectedNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  async function loadNews() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin/reporter-news?status=rejected",
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
      alert("Rejected news load nahi hui");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function approveNews(id: number) {
    if (!confirm("Is news ko approve karna hai?")) return;

    const res = await fetch("/api/admin/reporter-news", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        action: "approve",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Approve failed");
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
            <h1 className="text-3xl font-black text-red-700">
              Rejected News
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Rejected Reporter News
            </p>
          </div>

          <a
            href="/admin/reporter-news"
            className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-700"
          >
            ← Reporter News
          </a>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center font-bold">
            Rejected News loading...
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <div className="text-4xl">📭</div>
            <p className="mt-3 font-bold text-slate-600">
              अभी कोई Rejected News नहीं है।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                        REJECTED
                      </span>

                      {item.category?.name && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {item.category.name}
                        </span>
                      )}

                      {item.video && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
                          VIDEO
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-black text-slate-900">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Reporter: {item.reporter?.name || "Unknown"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelected(item)}
                      className="rounded-xl bg-blue-600 px-4 py-2 font-black text-white hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      onClick={() => approveNews(item.id)}
                      className="rounded-xl bg-green-600 px-4 py-2 font-black text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => deleteNews(item.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-black text-white hover:bg-red-700"
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
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-black text-slate-900">
                  {selected.title}
                </h2>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg bg-slate-200 px-3 py-2 font-black"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-red-100 px-3 py-1 font-bold text-red-700">
                  REJECTED
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">
                  Reporter: {selected.reporter?.name || "Unknown"}
                </span>
              </div>

              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="mt-5 max-h-96 w-full rounded-xl object-cover"
                />
              )}

              {selected.excerpt && (
                <p className="mt-5 rounded-xl bg-slate-100 p-4 font-semibold text-slate-700">
                  {selected.excerpt}
                </p>
              )}

              <div className="mt-5 whitespace-pre-wrap leading-7 text-slate-800">
                {selected.content}
              </div>

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

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => approveNews(selected.id)}
                  className="rounded-xl bg-green-600 px-5 py-3 font-black text-white"
                >
                  Approve
                </button>

                <button
                  onClick={() => deleteNews(selected.id)}
                  className="rounded-xl bg-red-600 px-5 py-3 font-black text-white"
                >
                  Delete
                </button>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-slate-200 px-5 py-3 font-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}