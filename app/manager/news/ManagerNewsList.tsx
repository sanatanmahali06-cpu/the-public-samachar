"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  status: string;
  isBreaking: boolean;
  image: string | null;
  createdAt: string;
  publishedAt: string | null;
  category: {
    id: number;
    name: string;
  } | null;
  reporter: {
    id: number;
    name: string;
    username: string;
  } | null;
};

export default function ManagerNewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadNews() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/manager/news", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "News load nahi hui.");
        return;
      }

      setNews(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-300">
                THE PUBLIC SAMACHAR
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Manage All News
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                सभी news यहाँ से manage करें।
              </p>
            </div>

            <a
              href="/manager"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-slate-950"
            >
              Back to Dashboard
            </a>
          </div>
        </header>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center font-bold">
            News loading...
          </div>
        ) : message ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center font-bold text-red-600">
            {message}
          </div>
        ) : news.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center font-bold">
            अभी कोई news नहीं है।
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {news.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-xl font-black">
                      {item.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-2 text-sm font-bold">
                      <span className="rounded-lg bg-slate-100 px-3 py-1">
                        ID: {item.id}
                      </span>

                      <span className="rounded-lg bg-slate-100 px-3 py-1">
                        {item.category?.name || "No Category"}
                      </span>

                      <span className="rounded-lg bg-slate-100 px-3 py-1">
                        {item.status}
                      </span>

                      {item.isBreaking && (
                        <span className="rounded-lg bg-red-600 px-3 py-1 text-white">
                          BREAKING
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {item.reporter
                        ? `Reporter: ${item.reporter.name}`
                        : "Added by Manager/Admin"}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <a
                      href={`/news/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-300 px-4 py-3 font-bold hover:bg-slate-100"
                    >
                      View
                    </a>

                    <button
                      type="button"
                      onClick={() => (window.location.href = `/manager/news/${item.id}/edit`)}
                      className="rounded-xl bg-slate-900 px-4 py-3 font-bold text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm("Kya aap is news ko delete karna chahte hain?")) return;

                        const response = await fetch(`/api/manager/news/${item.id}`, {
                          method: "DELETE",
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          alert(data.error || "Delete failed");
                          return;
                        }

                        alert("News delete ho gayi.");
                        window.location.reload();
                      }}
                      className="rounded-xl bg-red-600 px-4 py-3 font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}