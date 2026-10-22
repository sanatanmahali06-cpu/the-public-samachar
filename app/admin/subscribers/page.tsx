"use client";

import { useCallback, useEffect, useState } from "react";

type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/subscribers", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscribers load nahi hue.");
      }

      setSubscribers(data.subscribers || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Newsletter Subscribers
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Website par subscribe karne wale log.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void loadSubscribers()}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              Refresh
            </button>
            <a
              href="/admin"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800"
            >
              Admin
            </a>
          </div>
        </div>

        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Subscribers</p>
          <p className="mt-2 text-4xl font-bold text-red-600">{total}</p>
        </section>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">Subscriber List</h2>
          </div>

          {loading ? (
            <p className="p-5 text-slate-600">Loading...</p>
          ) : subscribers.length === 0 ? (
            <p className="p-5 text-slate-600">Abhi koi subscriber nahi hai.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber.id} className="border-t border-slate-100">
                      <td className="px-5 py-3">{index + 1}</td>
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {subscriber.email}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {new Date(subscriber.createdAt).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}