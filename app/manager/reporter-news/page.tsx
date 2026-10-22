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

export default function ManagerReporterNewsPage() {
  const [news, setNews] = useState<ReporterNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedNews, setSelectedNews] = useState<ReporterNews | null>(null);
  const [statusFilter, setStatusFilter] = useState("pending");

  async function loadNews(filter = statusFilter) {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/manager/reporter-news",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reporter news load failed");
      }

      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Reporter news load failed"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews(statusFilter);
  }, [statusFilter]);

  async function handleAction(
    id: number,
    action: "approve" | "reject"
  ) {
    const confirmText =
      action === "approve"
        ? "Approve and publish this reporter news?"
        : "Reject this reporter news?";

    if (!confirm(confirmText)) {
      return;
    }

    try {
      setMessage("");

      const res = await fetch("/api/manager/reporter-news", {
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
          ? "News approved and published successfully."
          : "News rejected successfully."
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
    if (!confirm("Permanently delete this reporter news?")) {
      return;
    }

    try {
      setMessage("");

      const res = await fetch("/api/manager/reporter-news", {
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
      setMessage("Reporter news deleted successfully.");
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
              Manager - Reporter News Management
            </p>
          </div>

          <a
            href="/manager"
            className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-700"
          >
            Back to Manager
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6">
        {message && (
          <div className="mb-6 rounded-xl border bg-white p-4 font-bold">
            {message}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl bg-white p-3 shadow-sm">
          {[
            ["pending", "Pending"],
            ["published", "Published"],
            ["rejected", "Rejected"],
            ["all", "All"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`rounded-xl px-5 py-3 font-black ${
                statusFilter === value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center font-bold">
            Reporter news loading...
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°</div>

            <h3 className="mt-4 text-2xl font-black">
              No pending reporter news
            </h3>

            <p className="mt-2 font-semibold text-slate-500">
              There is no pending reporter news right now.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[1100px] text-left">
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
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                            BREAKING
                          </span>
                        )}

                        {item.video && (
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
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
                      {item.category?.name || "No category"}
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : item.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.status.toUpperCase()}
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
                            window.location.href =
                              `/manager/news/${item.id}/edit`
                          }
                          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-700"
                        >
                          Edit
                        </button>

                        {item.status === "pending" && (
                          <button
                            onClick={() =>
                              handleAction(item.id, "approve")
                            }
                            className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}

                        {item.status === "pending" && (
                          <button
                            onClick={() =>
                              handleAction(item.id, "reject")
                            }
                            className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-bold text-white hover:bg-orange-700"
                          >
                            Reject
                          </button>
                        )}

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
                X
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
                  <p className="mb-3 text-xl font-black">
                    News Video
                  </p>

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

                <p className="text-sm text-slate-500">
                  @{selectedNews.reporter?.username || "unknown"}
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
                  window.location.href =
                    `/manager/news/${selectedNews.id}/edit`
                }
                className="rounded-xl bg-slate-900 px-5 py-3 font-black text-white hover:bg-slate-700"
              >
                Edit
              </button>

              {selectedNews.status === "pending" && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}