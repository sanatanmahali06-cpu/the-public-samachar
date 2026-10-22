"use client";

import { useEffect, useState } from "react";

type Banner = {
  id: number;
  name: string;
  imageUrl: string;
  targetUrl: string;
  placements: string[];
  interval: number;
  active: boolean;
};

const blank = {
  name: "",
  imageUrl: "",
  targetUrl: "",
  placements: ["trending_below", "latest_news"],
  interval: 2,
};

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadBanners() {
    setLoading(true);
    try {
      const response = await fetch("/api/banners", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Banners load nahi hue");
      setBanners(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Banners load nahi hue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBanners();
  }, []);

  function updateField<K extends keyof typeof blank>(
    key: K,
    value: (typeof blank)[K]
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function togglePlacement(placement: string, checked: boolean) {
    setForm((previous) => ({
      ...previous,
      placements: checked
        ? [...new Set([...previous.placements, placement])]
        : previous.placements.filter((item) => item !== placement),
    }));
  }

  function editBanner(banner: Banner) {
    setEditingId(banner.id);
    setForm({
      name: banner.name,
      imageUrl: banner.imageUrl,
      targetUrl: banner.targetUrl,
      placements: banner.placements || [],
      interval: banner.interval,
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("JPG, PNG ya WebP photo chunein.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo 5 MB ya usse chhoti honi chahiye.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Photo upload nahi hui");

      updateField("imageUrl", data.url);
      setNotice("Image upload ho gayi.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Photo upload nahi hui");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveBanner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/banners", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...(editingId ? { id: editingId } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Banner save nahi hua");

      setForm(blank);
      setEditingId(null);
      setNotice("Banner save ho gaya.");
      await loadBanners();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Banner save nahi hua");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(banner: Banner) {
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner.id, active: !banner.active }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Status update nahi hua");
      setNotice(banner.active ? "Banner band kar diya." : "Banner chalu kar diya.");
      await loadBanners();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status update nahi hua");
    }
  }

  async function deleteBanner(id: number) {
    if (!window.confirm("Kya aap is banner ko delete karna chahte hain?")) return;

    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete nahi hua");
      setNotice("Banner delete ho gaya.");
      if (editingId === id) {
        setEditingId(null);
        setForm(blank);
      }
      await loadBanners();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete nahi hua");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(blank);
    setError("");
    setNotice("");
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-red-600">
              THE PUBLIC SAMACHAR
            </p>
            <h1 className="mt-1 text-3xl font-black">Global Banner Ads</h1>
            <p className="mt-2 text-sm text-slate-600">
              Homepage banners ko manage karein.
            </p>
          </div>
          <a
            href="/admin"
            className="rounded-lg border bg-white px-4 py-2 text-sm font-bold"
          >
            ← Admin Dashboard
          </a>
        </header>

        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-black">
            {editingId ? "Edit Banner" : "Add New Banner"}
          </h2>

          <form onSubmit={saveBanner} className="mt-5 space-y-5">
            <div>
              <label className="text-sm font-bold">Banner name</label>
              <input
                className={fieldClass}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                maxLength={150}
                placeholder="Example: Festival Offer"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Banner image URL</label>
              <input
                className={fieldClass}
                type="url"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                required
                placeholder="https://..."
              />
              <label className="mt-3 block text-sm font-semibold">
                Ya image upload karein (JPG, PNG, WebP; max 5 MB)
              </label>
              <input
                className="mt-2 block w-full text-sm"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={uploadImage}
              />
              {uploading && <p className="mt-2 text-sm">Uploading image...</p>}
              {form.imageUrl && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-slate-500">Image preview</p>
                  <img
                    src={form.imageUrl}
                    alt="Banner preview"
                    className="max-h-44 max-w-full rounded-lg border object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-bold">Click-through URL</label>
              <input
                className={fieldClass}
                type="url"
                value={form.targetUrl}
                onChange={(e) => updateField("targetUrl", e.target.value)}
                required
                placeholder="https://advertiser.example"
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-bold">Homepage placements</legend>
              <label className="flex items-start gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.placements.includes("trending_below")}
                  onChange={(e) => togglePlacement("trending_below", e.target.checked)}
                />
                <span>
                  <span className="block font-bold">Below TRENDING cards</span>
                  <span className="text-sm text-slate-500">
                    Trending ke 3 cards ke neeche banner.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.placements.includes("trending_1")}
                  onChange={(e) => togglePlacement("trending_1", e.target.checked)}
                />
                <span>
                  <span className="block font-bold">1 News ke neeche</span>
                  <span className="text-sm text-slate-500">
                    Trending ki pehli news ke neeche banner.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.placements.includes("trending_2")}
                  onChange={(e) => togglePlacement("trending_2", e.target.checked)}
                />
                <span>
                  <span className="block font-bold">2 News ke neeche</span>
                  <span className="text-sm text-slate-500">
                    Trending ki doosri news ke neeche banner.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.placements.includes("trending_3")}
                  onChange={(e) => togglePlacement("trending_3", e.target.checked)}
                />
                <span>
                  <span className="block font-bold">3 News ke neeche</span>
                  <span className="text-sm text-slate-500">
                    Trending ki teesri news ke neeche banner.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.placements.includes("latest_news")}
                  onChange={(e) => togglePlacement("latest_news", e.target.checked)}
                />
                <span>
                  <span className="block font-bold">Inside ताज़ा खबरें</span>
                  <span className="text-sm text-slate-500">
                    News cards ke beech banner. Dono placements ek saath chun sakte hain.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.placements.includes("hero_below")}
                  onChange={(e) => togglePlacement("hero_below", e.target.checked)}
                />
                <span>
                  <span className="block font-bold">Hero ke neeche (Desktop)</span>
                  <span className="text-sm text-slate-500">
                    Desktop par Hero section ke turant neeche aur TRENDING se pehle banner.
                  </span>
                </span>
              </label>
            </fieldset>

            <div>
              <label className="text-sm font-bold">
                ताज़ा खबरें: har kitne news cards ke baad?
              </label>
              <select
                className={fieldClass}
                value={form.interval}
                onChange={(e) => updateField("interval", Number(e.target.value))}
              >
                {[1, 2, 3, 5].map((n) => (
                  <option key={n} value={n}>
                    Har {n} news card ke baad
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700">
                {notice}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Banner" : "Save Banner"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border px-5 py-3 font-bold"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black">Saved Banners</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold">
              {banners.length} total
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-slate-500">Banners load ho rahe hain...</p>
          ) : banners.length === 0 ? (
            <p className="py-8 text-center text-slate-500">Abhi koi banner nahi hai.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {banners.map((banner) => (
                <article
                  key={banner.id}
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.name}
                    className="h-28 w-full rounded-lg border bg-slate-50 object-contain sm:w-44"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black">{banner.name}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                        banner.active
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {banner.active ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {banner.targetUrl}
                    </p>
                    <p className="mt-2 text-sm">
                      Placements: {banner.placements.map((p) =>
                        p === "trending_below" ? "TRENDING (सामान्य)" :
                        p === "trending_1" ? "1 News ke neeche" :
                        p === "trending_2" ? "2 News ke neeche" :
                        p === "trending_3" ? "3 News ke neeche" :
                        p === "latest_news" ? "ताज़ा खबरें" :
                        p === "hero_below" ? "Hero ke neeche" : p
                      ).join(", ") || "Koi placement nahi"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      News interval: har {banner.interval} cards
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => editBanner(banner)}
                        className="rounded-lg border px-3 py-2 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleActive(banner)}
                        className="rounded-lg border px-3 py-2 text-sm font-semibold"
                      >
                        {banner.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteBanner(banner.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}