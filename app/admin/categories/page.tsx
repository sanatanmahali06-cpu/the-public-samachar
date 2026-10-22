"use client";

import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  news: number;
};

export default function CategoriesAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Categories fetch failed");
      }

      setCategories(
        data.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          news: category._count?.news ?? 0,
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Categories load नहीं हो सकीं।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setSlug("");
  };

  const saveCategory = async () => {
    const cleanName = name.trim();
    const cleanSlug = slug.trim().toLowerCase();

    if (!cleanName || !cleanSlug) {
      alert("Category Name और Slug दोनों भरें।");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/categories", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? {
                id: editingId,
                name: cleanName,
                slug: cleanSlug,
              }
            : {
                name: cleanName,
                slug: cleanSlug,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Category save नहीं हुई।");
        return;
      }

      if (editingId) {
        setCategories((current) =>
          current.map((category) =>
            category.id === editingId
              ? {
                  ...category,
                  name: data.name,
                  slug: data.slug,
                }
              : category
          )
        );

        alert("Category successfully update हो गई।");
      } else {
        setCategories((current) => [
          ...current,
          {
            id: data.id,
            name: data.name,
            slug: data.slug,
            news: 0,
          },
        ]);

        alert("Category successfully save हो गई।");
      }

      closeForm();
    } catch (error) {
      console.error(error);
      alert("Server से connection नहीं हो पाया।");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: number) => {
    const category = categories.find((item) => item.id === id);

    if (!category) return;

    const confirmed = window.confirm(
      `"${category.name}" category को delete करना चाहते हैं?`
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Category delete नहीं हो सकी। अगर इस category में news जुड़ी है, तो पहले उसे हटाएँ या दूसरी category में बदलें।"
        );
        return;
      }

      setCategories((current) =>
        current.filter((category) => category.id !== id)
      );

      if (editingId === id) {
        closeForm();
      }

      alert("Category successfully delete हो गई।");
    } catch (error) {
      console.error(error);
      alert("Server से connection नहीं हो पाया।");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-black sm:text-2xl">
              THE PUBLIC SAMACHAR
            </h1>
            <p className="text-xs text-slate-400">Category Management</p>
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
            <p className="text-sm font-bold text-red-600">ADMIN PANEL</p>
            <h2 className="text-3xl font-black">Categories</h2>
            <p className="mt-1 text-slate-500">
              News categories को manage करें।
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-red-600 px-5 py-3 font-black text-white shadow-lg hover:bg-red-700"
          >
            + Add Category
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>

              <button
                onClick={closeForm}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Category Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="जैसे: बिहार"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Slug
                </label>

                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="bihar"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={saveCategory}
                disabled={saving}
                className="rounded-xl bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Save Category"}
              </button>

              <button
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl bg-slate-100 px-6 py-3 font-black hover:bg-slate-200 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center font-bold">
            Categories loading...
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center font-bold">
            अभी कोई category नहीं है।
          </div>
        ) : (
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
                  <button
                    onClick={() => openEditForm(category)}
                    className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(category.id)}
                    disabled={deletingId === category.id}
                    className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === category.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
