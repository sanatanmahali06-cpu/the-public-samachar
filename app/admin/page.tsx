"use client";

import { useState } from "react";

const news = [
  {
    id: 1,
    title: "देश की बड़ी खबरें और महत्वपूर्ण अपडेट",
    category: "राष्ट्रीय",
    status: "Published",
    breaking: true,
  },
  {
    id: 2,
    title: "राज्यों से जुड़ी ताजा खबरें",
    category: "राज्य",
    status: "Published",
    breaking: false,
  },
  {
    id: 3,
    title: "मनोरंजन जगत की नई खबरें",
    category: "मनोरंजन",
    status: "Draft",
    breaking: false,
  },
];

export default function AdminDashboard() {
  const [menu, setMenu] = useState("Dashboard");

  const total = news.length;
  const published = news.filter((n) => n.status === "Published").length;
  const drafts = news.filter((n) => n.status === "Draft").length;
  const breaking = news.filter((n) => n.breaking).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-black sm:text-2xl">
              THE PUBLIC SAMACHAR
            </h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>

          <a
            href="/"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
          >
            Website →
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden min-h-[calc(100vh-73px)] w-64 shrink-0 border-r bg-white p-4 md:block">
          <nav className="space-y-2">
            {["Dashboard", "News", "Categories", "Settings"].map((item) => (
              <button
                key={item}
                onClick={() => setMenu(item)}
                className={`w-full rounded-lg px-4 py-3 text-left font-bold ${
                  menu === item
                    ? "bg-red-600 text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                {item === "Dashboard" && "📊 "}
                {item === "News" && "📰 "}
                {item === "Categories" && "📂 "}
                {item === "Settings" && "⚙️ "}
                {item}
              </button>
            ))}

            <div className="mt-8 border-t pt-4">
              <button className="w-full rounded-lg px-4 py-3 text-left font-bold text-red-600 hover:bg-red-50">
                🚪 Logout
              </button>
            </div>
          </nav>
        </aside>

        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold text-red-600">
              ADMINISTRATION
            </p>
            <h2 className="text-3xl font-black">Dashboard</h2>
            <p className="mt-1 text-slate-500">
              The Public Samachar को manage करें।
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">Total News</p>
              <p className="mt-2 text-4xl font-black">{total}</p>
              <p className="mt-2 text-xs text-slate-400">
                सभी news
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">
                Published
              </p>
              <p className="mt-2 text-4xl font-black text-green-600">
                {published}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                प्रकाशित खबरें
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">Draft</p>
              <p className="mt-2 text-4xl font-black text-orange-500">
                {drafts}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                अभी प्रकाशित नहीं
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">
                Breaking
              </p>
              <p className="mt-2 text-4xl font-black text-red-600">
                {breaking}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Breaking News
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <button className="rounded-2xl bg-red-600 p-5 text-left text-white shadow-lg hover:bg-red-700">
              <span className="text-3xl">＋</span>
              <h3 className="mt-2 text-xl font-black">Add News</h3>
              <p className="mt-1 text-sm text-red-100">
                नई खबर प्रकाशित करें
              </p>
            </button>

            <button className="rounded-2xl bg-slate-950 p-5 text-left text-white shadow-lg hover:bg-slate-800">
              <span className="text-3xl">📂</span>
              <h3 className="mt-2 text-xl font-black">
                Categories
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                News categories manage करें
              </p>
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-xl font-black">Latest News</h3>
                <p className="text-sm text-slate-500">
                  हाल की खबरों की सूची
                </p>
              </div>

              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">
                + Add News
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50 text-sm">
                  <tr>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Breaking</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="max-w-sm font-bold">
                          {item.title}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {item.category}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {item.breaking ? (
                          <span className="font-bold text-red-600">
                            YES
                          </span>
                        ) : (
                          <span className="text-slate-400">NO</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200">
                            Edit
                          </button>

                          <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
