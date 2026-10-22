"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function ReporterNewNewsForm({
  reporterName,
}: {
  reporterName: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [video, setVideo] = useState("");
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

      setMessage("News submit ho rahi hai...");

      const response = await fetch("/api/reporter/news", {
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "News submit nahi hui.");
        return;
      }

      setMessage(
        "News successfully submit ho gayi. Admin approval ka wait karein."
      );

      setTitle("");
      setCategoryId("");
      setExcerpt("");
      setContent("");
      setImage("");
      setImageFile(null);
      setVideo("");

      const fileInput = document.getElementById(
        "news-image-file"
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
            Submit New News
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Reporter: {reporterName}
          </p>

          <p className="mt-1 text-sm text-slate-300">
            News submit karein. Publish hone se pehle Admin approval zaroori hai.
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
              id="news-image-file"
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
              Agar computer se image select ki hai, to uploaded image ko
              priority milegi.
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-5 py-4 font-black text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit News for Approval"}
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