"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  meeshoUrl: string;
  active: boolean;
  showInShoppingDeals: boolean;
  showInBestDeals: boolean;
};

const blank = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  meeshoUrl: "",
  showInShoppingDeals: false,
  showInBestDeals: false,
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Products load nahi hue");
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Products load nahi hue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      imageUrl: product.imageUrl || "",
      meeshoUrl: product.meeshoUrl,
      showInShoppingDeals: product.showInShoppingDeals,
      showInBestDeals: product.showInBestDeals,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          imageUrl: form.imageUrl,
          meeshoUrl: form.meeshoUrl,
          ...(editingId ? {
            id: editingId,
            showInShoppingDeals: form.showInShoppingDeals,
            showInBestDeals: form.showInBestDeals,
          } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save nahi hua");

      setForm(blank);
      setEditingId(null);
      await loadProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save nahi hua");
    } finally {
      setSaving(false);
    }
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

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Photo upload nahi hui.");
      }

      setForm((previous) => ({ ...previous, imageUrl: data.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Photo upload nahi hui.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function toggleActive(product: Product) {
    const response = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        id: product.id,
        active: !product.active,
        price: product.price,
        imageUrl: product.imageUrl || "",
        description: product.description || "",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Status update nahi hua");
      return;
    }
    await loadProducts();
  }

  async function setSidebar(
    product: Product,
    field: "showInShoppingDeals" | "showInBestDeals",
    checked: boolean
  ) {
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, [field]: checked }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sidebar setting save nahi hui");
      }

      await loadProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sidebar setting save nahi hui");
    }
  }

  async function deleteProduct(id: number) {
    if (!window.confirm("Kya aap is product ko delete karna chahte hain?")) return;

    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Delete nahi hua");
      return;
    }
    await loadProducts();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(blank);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            THE PUBLIC SAMACHAR
          </p>
          <h1 className="mt-2 text-3xl font-black">Shopping Deals</h1>
          <p className="mt-2 text-slate-600">
            Products add karein aur Meesho Buy Now link manage karein.
          </p>
        </header>

        <form onSubmit={saveProduct} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">
            {editingId ? "Product edit karein" : "Naya product add karein"}
          </h2>

          <label className="block text-sm font-semibold">
            Product ka naam *
            <input
              required
              className="mt-1 w-full rounded-lg border p-3 font-normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jaise Men's Shirt"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Price (₹) *
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                className="mt-1 w-full rounded-lg border p-3 font-normal"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="499"
              />
            </label>

            <div className="space-y-3">
              <label className="block text-sm font-semibold">
                Computer se photo upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading}
                  onChange={uploadImage}
                  className="mt-1 block w-full rounded-lg border p-3 font-normal"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  JPG, PNG ya WebP; maximum 5 MB.
                </span>
                {uploading && (
                  <span className="mt-1 block text-sm text-blue-700">
                    Photo upload ho rahi hai...
                  </span>
                )}
              </label>

              <label className="block text-sm font-semibold">
                Ya Image URL dalein
                <input
                  type="url"
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </label>
            </div>
          </div>

          <label className="block text-sm font-semibold">
            Product description
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border p-3 font-normal"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product ki chhoti jaankari"
            />
          </label>

          <label className="block text-sm font-semibold">
            Affiliate Link (optional - baad mein jodein)
            <input
              type="url"
              className="mt-1 w-full rounded-lg border p-3 font-normal"
              value={form.meeshoUrl}
              onChange={(e) => setForm({ ...form, meeshoUrl: e.target.value })}
              placeholder="https://www.meesho.com/..."
            />
          </label>

          {editingId && (
            <div className="space-y-3 rounded-lg border p-4">
              <p className="font-bold">Homepage sidebar mein dikhayein</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.showInShoppingDeals}
                  onChange={(e) =>
                    setForm({ ...form, showInShoppingDeals: e.target.checked })
                  }
                />
                Shopping Deals (Left)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.showInBestDeals}
                  onChange={(e) =>
                    setForm({ ...form, showInBestDeals: e.target.checked })
                  }
                />
                Best Deals (Right)
              </label>
            </div>
          )}

          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Product preview"
              className="h-36 w-36 rounded-xl border object-contain"
            />
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              disabled={saving}
              className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Changes save karein" : "Product add karein"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border px-5 py-3 font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Saved products</h2>

          {loading ? (
            <p>Products load ho rahe hain...</p>
          ) : products.length === 0 ? (
            <p className="rounded-xl bg-white p-5 text-slate-600">
              Abhi koi active product nahi hai.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <article key={product.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-28 w-24 rounded-lg border object-contain"
                      />
                    ) : (
                      <div className="flex h-28 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                        No image
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="mt-1 font-black text-red-600">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.active ? "Active" : "Hidden"}
                      </p>
                      <a
                        href={product.meeshoUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm font-semibold text-blue-700 underline"
                      >
                        Link check karein
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-bold">Homepage sidebar mein dikhayein</p>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={product.showInShoppingDeals}
                        onChange={(e) =>
                          void setSidebar(product, "showInShoppingDeals", e.target.checked)
                        }
                      />
                      Shopping Deals (Left)
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={product.showInBestDeals}
                        onChange={(e) =>
                          void setSidebar(product, "showInBestDeals", e.target.checked)
                        }
                      />
                      Best Deals (Right)
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="rounded-lg border px-3 py-2 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleActive(product)}
                      className="rounded-lg border px-3 py-2 text-sm font-semibold"
                    >
                      {product.active ? "Hide" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteProduct(product.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"
                    >
                      Delete
                    </button>
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