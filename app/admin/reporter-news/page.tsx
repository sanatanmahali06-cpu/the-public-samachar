"use client";

import { useEffect, useState } from "react";

type ReporterNews = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  video: string | null;
  status: string;
  isBreaking: boolean;
  publishedAt: string | null;
  createdAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  reporter: {
    id: number;
    name: string;
    username: string;
  } | null;
};

export default function ReporterNewsPage() {
  const [news, setNews] = useState<ReporterNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedNews, setSelectedNews] = useState<ReporterNews | null>(null);

  async function loadNews() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin/reporter-news?status=pending",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "News load failed");
      }

      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Reporter news load नहीं हो सकी।");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function handleAction(
    id: number,
    action: "approve" | "reject"
  ) {
    const confirmText =
      action === "approve"
        ? "क्या आप इस news को approve करके publish करना चाहते हैं?"
        : "क्या आप इस news को reject करना चाहते हैं?";

    if (!confirm(confirmText)) {
      return;
    }

    try {
      setMessage("");

      const res = await fetch("/api/admin/reporter-news", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Action failed");
      }

      setNews((current) =>
        current.filter((item) => item.id !== id)
      );

      setSelectedNews(null);

      setMessage(
        action === "approve"
          ? "News successfully approved और publish हो गई।"
          : "News successfully reject हो गई।"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Action failed"
      );
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("क्या आप इस news को permanently delete करना चाहते हैं?")) {
      return;
    }

    try {
      setMessage("");

      const res = await fetch("/api/admin/reporter-news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setNews((current) =>
        current.filter((item) => item.id !== id)
      );

      setSelectedNews(null);
      setMessage("News permanently delete हो गई।");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-black">
              THE PUBLIC SAMACHAR
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Reporter News Management
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-700"
          >
            ← Admin Dashboard
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Reporter News
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Reporter News
          </h2>

          <p className="mt-2 font-semibold text-slate-500">
            Reporter द्वारा भेजी गई news यहाँ review और manage करें।
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border bg-white p-4 font-bold">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center font-bold">
            Reporter news loading...
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">📰</div>

            <h3 className="mt-4 text-2xl font-black">
              No reporter news
            </h3>

            <p className="mt-2 font-semibold text-slate-500">
              अभी reporter की कोई news नहीं है।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b bg-slate-50 text-sm text-slate-500">
                  <th className="px-4 py-4">News</th>
                  <th className="px-4 py-4">Reporter</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {news.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-5">
                      <p className="max-w-md font-black">
                        {item.title}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.isBreaking && (
                          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                            BREAKING
                          </span>
                        )}

                        {item.video && (
                          <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
                            VIDEO
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <p className="font-bold">
                        {item.reporter?.name || "Unknown"}
                      </p>

                      <p className="text-sm text-slate-500">
                        @{item.reporter?.username || "unknown"}
                      </p>
                    </td>

                    <td className="px-4 py-5 font-semibold">
                      {item.category?.name || "बिना category"}
                    </td>

                    <td className="px-4 py-5">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                        PENDING
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedNews(item)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleAction(item.id, "approve")
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleAction(item.id, "reject")
                          }
                          className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-bold text-white hover:bg-orange-700"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-orange-600">
                  Reporter News
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {selectedNews.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                className="rounded-lg bg-slate-200 px-4 py-2 font-black hover:bg-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {selectedNews.image && (
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="max-h-96 w-full rounded-xl object-cover"
                />
              )}

              {selectedNews.video && (
                <div>
                  <p className="mb-3 text-xl font-black">News Video</p>

                  <div className="overflow-hidden rounded-2xl bg-black">
                    <div className="aspect-video">
                      <iframe
                        src={
                          selectedNews.video.includes("youtu.be/")
                            ? `https://www.youtube.com/embed/${selectedNews.video.split("youtu.be/")[1].split("?")[0]}`
                            : selectedNews.video.includes("watch?v=")
                              ? `https://www.youtube.com/embed/${new URL(selectedNews.video).searchParams.get("v")}`
                              : selectedNews.video
                        }
                        title={selectedNews.title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  <a
                    href={selectedNews.video}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block break-all text-sm font-semibold text-blue-600 underline"
                  >
                    Video link: {selectedNews.video}
                  </a>
                </div>
              )}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">
                  Reporter
                </p>

                <p className="mt-1 font-black">
                  {selectedNews.reporter?.name || "Unknown"}
                </p>
              </div>

              {selectedNews.excerpt && (
                <div>
                  <p className="font-black">Excerpt</p>
                  <p className="mt-1 text-slate-700">
                    {selectedNews.excerpt}
                  </p>
                </div>
              )}

              <div>
                <p className="font-black">Full News</p>

                <div className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 leading-7">
                  {selectedNews.content}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() =>
                  handleAction(selectedNews.id, "reject")
                }
                className="rounded-xl bg-orange-600 px-5 py-3 font-black text-white hover:bg-orange-700"
              >
                Reject
              </button>

              <button
                onClick={() =>
                  handleAction(selectedNews.id, "approve")
                }
                className="rounded-xl bg-green-600 px-5 py-3 font-black text-white hover:bg-green-700"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
