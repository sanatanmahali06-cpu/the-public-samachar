"use client";

import { useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  category: string;
  author: string;
  status: "Published" | "Draft";
  breaking: boolean;
};

export default function NewsAdmin() {
  const [showForm, setShowForm] = useState(false);

  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      title: "देश की बड़ी खबरें और महत्वपूर्ण अपडेट",
      category: "राष्ट्रीय",
      author: "Admin",
      status: "Published",
      breaking: true,
    },
    {
      id: 2,
      title: "राज्यों से जुड़ी ताजा खबरें",
      category: "राज्य",
      author: "Admin",
      status: "Published",
      breaking: false,
    },
    {
      id: 3,
      title: "मनोरंजन जगत की नई खबरें",
      category: "मनोरंजन",
      author: "Admin",
      status: "Draft",
      breaking: false,
    },
  ]);

  const deleteNews = (id: number) => {
    setNews(news.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-black sm:text-2xl">
              THE PUBLIC SAMACHAR
            </h1>
            <p className="text-xs text-slate-400">News Management</p>
          </div>

          <a
            href="/admin"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-red-600">
              ADMIN PANEL
            </p>

            <h2 className="text-3xl font-black">
              News Management
            </h2>

            <p className="mt-1 text-slate-500">
              अपनी सभी खबरों को manage करें।
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-red-600 px-5 py-3 font-black text-white shadow-lg hover:bg-red-700"
          >
            + Add New News
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="text-xl font-black">
                Add New News
              </h3>

              <p className="text-sm text-slate-500">
                नई खबर की जानकारी भरें।
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  News Title
                </label>

                <input
                  type="text"
                  placeholder="खबर का पूरा शीर्षक लिखें"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Category
                  </label>

                  <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none">
                    <option>राष्ट्रीय</option>
                    <option>राज्य</option>
                    <option>दुनिया</option>
                    <option>मनोरंजन</option>
                    <option>खेल</option>
                    <option>बिजनेस</option>
                    <option>लाइफस्टाइल</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Author
                  </label>

                  <input
                    type="text"
                    placeholder="Author name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Short Description
                </label>

                <textarea
                  rows={3}
                  placeholder="खबर का छोटा विवरण..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Full News
                </label>

                <textarea
                  rows={8}
                  placeholder="खबर की पूरी जानकारी..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  News Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 font-bold">
                  <input type="checkbox" className="h-5 w-5" />
                  Breaking News
                </label>

                <label className="flex cursor-pointer items-center gap-2 font-bold">
                  <input type="checkbox" className="h-5 w-5" />
                  Publish Now
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-xl bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700">
                  Save News
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl bg-slate-100 px-6 py-3 font-black hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b p-5">
            <h3 className="text-xl font-black">
              All News
            </h3>

            <p className="text-sm text-slate-500">
              कुल {news.length} खबरें
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-sm">
                <tr>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Author</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Breaking</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {news.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="max-w-xs font-bold">
                        {item.title}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.category}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {item.author}
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
                        <span className="font-black text-red-600">
                          YES
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          NO
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200">
                          Edit
                        </button>

                        <button
                          onClick={() => deleteNews(item.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {news.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      अभी कोई खबर नहीं है।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
