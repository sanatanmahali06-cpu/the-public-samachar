"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function ManagerNewNewsForm({
  managerName,
}: {
  managerName: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [video, setVideo] = useState("");
  const [status, setStatus] = useState("draft");
  const [isBreaking, setIsBreaking] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {
        setMessage("Categories load nahi ho paayi.");
      });
  }, []);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let finalImage = image.trim();

      if (imageFile) {
        setMessage("Image upload ho rahi hai...");

        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.url) {
          setMessage(uploadData.error || "Image upload failed.");
          return;
        }

        finalImage = uploadData.url;
      }

      setMessage("News save ho rahi hai...");

      const response = await fetch("/api/manager/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          categoryId: categoryId ? Number(categoryId) : null,
          excerpt,
          content,
          image: finalImage,
          video: video.trim(),
          status,
          isBreaking,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "News save nahi hui.");
        return;
      }

      setMessage(
        status === "published"
          ? "News successfully publish ho gayi."
          : "News draft mein save ho gayi."
      );

      setTitle("");
      setCategoryId("");
      setExcerpt("");
      setContent("");
      setImage("");
      setImageFile(null);
      setVideo("");
      setStatus("draft");
      setIsBreaking(false);

      const fileInput = document.getElementById(
        "manager-news-image-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
          <p className="text-sm font-bold text-slate-300">
            THE PUBLIC SAMACHAR
          </p>

          <h1 className="mt-1 text-3xl font-black">
            Add New News
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Manager: {managerName}
          </p>

          <p className="mt-1 text-sm text-slate-300">
            News ko draft mein save ya directly publish kar sakte hain.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-lg"
        >
          <div>
            <label className="mb-2 block font-bold">
              News Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="News ka title"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-950"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-xl border px-4 py-3 outline-none"
            >
              <option value="">Category select karein</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold">
              Upload Image
            </label>

            <input
              id="manager-news-image-file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border bg-white px-4 py-3"
            />

            {imageFile && (
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Selected: {imageFile.name}
              </p>
            )}

            <p className="mt-3 text-sm font-bold text-slate-500">
              Ya Image URL use karein
            </p>

            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/news-image.jpg"
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
            />

            <p className="mt-2 text-xs text-slate-500">
              Computer se image select karne par uploaded image ko priority milegi.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-bold">
              Video URL
            </label>

            <input
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />

            <p className="mt-2 text-xs text-slate-500">
              YouTube ya direct video link yahan paste karein.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-bold">
              Short Description
            </label>

            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="News ka short description"
              rows={3}
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">
              Full News
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Puri news yahan likhein..."
              rows={12}
              required
              className="w-full rounded-xl border px-4 py-3 outline-none"
            />
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="mb-3 font-black">
              Publish Status
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                />

                <span className="font-bold">
                  Save as Draft
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                />

                <span className="font-bold">
                  Publish Now
                </span>
              </label>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="h-5 w-5"
            />

            <span className="font-black">
              Breaking News
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-5 py-4 font-black text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : status === "published"
                ? "Publish News"
                : "Save Draft"}
          </button>

          {message && (
            <div className="rounded-xl bg-slate-100 p-4 text-sm font-semibold">
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}