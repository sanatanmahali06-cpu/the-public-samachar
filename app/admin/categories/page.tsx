"use client";

import { useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  news: number;
};

export default function CategoriesAdmin() {
  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "राष्ट्रीय", slug: "rashtriya", news: 12 },
    { id: 2, name: "राज्य", slug: "rajya", news: 8 },
    { id: 3, name: "दुनिया", slug: "duniya", news: 5 },
    { id: 4, name: "मनोरंजन", slug: "manoranjan", news: 10 },
    { id: 5, name: "खेल", slug: "khel", news: 7 },
    { id: 6, name: "बिजनेस", slug: "business", news: 4 },
    { id: 7, name: "लाइफस्टाइल", slug: "lifestyle", news: 3 },
  ]);

  const deleteCategory = (id: number) => {
    setCategories(
      categories.filter((category) => category.id !== id)
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-black sm:text-2xl">
              THE PUBLIC SAMACHAR
            </h1>
            <p className="text-xs text-slate-400">
              Category Management
            </p>
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
              Categories
            </h2>

            <p className="mt-1 text-slate-500">
              News categories को manage करें।
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-red-600 px-5 py-3 font-black text-white shadow-lg hover:bg-red-700"
          >
            + Add Category
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-5 text-xl font-black">
              Add New Category
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Category Name
                </label>

                <input
                  type="text"
                  placeholder="जैसे: राजनीति"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Slug
                </label>

                <input
                  type="text"
                  placeholder="politics"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="rounded-xl bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700">
                Save Category
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl bg-slate-100 px-6 py-3 font-black hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
                  📰
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {category.news} News
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black">
                {category.name}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                /{category.slug}
              </p>

              <div className="mt-5 flex gap-2">
                <button className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200">
                  Edit
                </button>

                <button
                  onClick={() => deleteCategory(category.id)}
                  className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">📂</div>

            <h3 className="mt-4 text-xl font-black">
              No Categories
            </h3>

            <p className="mt-2 text-slate-500">
              पहली category बनाने के लिए Add Category दबाएँ।
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
