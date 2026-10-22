"use client";

import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type ShoppingProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string | null;
  meeshoUrl: string;
  active: boolean;
};

type NewsItem = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  image: string | null;
  bannerImageUrl?: string | null;
  bannerAffiliateUrl?: string | null;
  bannerImageUrl2?: string | null;
  bannerAffiliateUrl2?: string | null;
  status: string;
  isBreaking: boolean;
  categoryId: number | null;
  state?: string | null;
  city?: string | null;
  category?: {
    name: string;
  } | null;
  shoppingDeals?: {
    productId: number;
    position: number;
    product: ShoppingProduct;
  }[];
};

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function NewsAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ShoppingProduct[]>([]);
  const [selectedShoppingDealIds, setSelectedShoppingDealIds] = useState<number[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishNow, setPublishNow] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [existingBannerImage, setExistingBannerImage] = useState("");
  const [bannerAffiliateUrl, setBannerAffiliateUrl] = useState("");
  const [bannerImage2, setBannerImage2] = useState<File | null>(null);
  const [existingBannerImage2, setExistingBannerImage2] = useState("");
  const [bannerAffiliateUrl2, setBannerAffiliateUrl2] = useState("");

  const loadNews = async () => {
    try {
      const response = await fetch("/api/news", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "News fetch failed");
      }

      setNews(data);
    } catch (error) {
      console.error(error);
      alert("News load नहीं हो पाई।");
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Categories fetch failed");
      }

      setCategories(data);

      if (data.length > 0) {
        setCategory((current) => current || String(data[0].name));
      }
    } catch (error) {
      console.error(error);
      alert("Categories load नहीं हो सकीं।");
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Products load failed");
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Shopping Deals के प्रोडक्ट लोड नहीं हो सके।");
    }
  };

  const loadData = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadNews(),
        loadCategories(),
        loadProducts(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategory(categories[0]?.name || "");
    setState("");
    setCity("");
    setAuthor("Admin");
    setExcerpt("");
    setContent("");
    setIsBreaking(false);
    setPublishNow(false);
    setImage(null);
    setExistingImage("");
    setBannerImage(null);
    setExistingBannerImage("");
    setBannerAffiliateUrl("");
    setBannerImage2(null);
    setExistingBannerImage2("");
    setBannerAffiliateUrl2("");
    setSelectedShoppingDealIds([]);
    setEditingId(null);
  };

  const openAddForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory(categories[0]?.name || "");
    setState("");
    setCity("");
    setAuthor("Admin");
    setExcerpt("");
    setContent("");
    setIsBreaking(false);
    setPublishNow(false);
    setImage(null);
    setExistingImage("");
    setBannerImage(null);
    setExistingBannerImage("");
    setBannerAffiliateUrl("");
    setBannerImage2(null);
    setExistingBannerImage2("");
    setBannerAffiliateUrl2("");
    setSelectedShoppingDealIds([]);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openEditForm = (item: NewsItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category?.name || categories[0]?.name || "");
    setState(item.state || "");
    setCity(item.city || "");
    setAuthor(item.author || "Admin");
    setExcerpt(item.excerpt || "");
    setContent(item.content);
    setIsBreaking(item.isBreaking);
    setPublishNow(item.status === "published");
    setImage(null);
    setExistingImage(item.image || "");
    setBannerImage(null);
    setExistingBannerImage(item.bannerImageUrl || "");
    setBannerAffiliateUrl(item.bannerAffiliateUrl || "");
    setBannerImage2(null);
    setExistingBannerImage2(item.bannerImageUrl2 || "");
    setBannerAffiliateUrl2(item.bannerAffiliateUrl2 || "");
    setSelectedShoppingDealIds(
      (item.shoppingDeals || [])
        .sort((a, b) => a.position - b.position)
        .map((deal) => deal.productId)
        .slice(0, 4)
    );
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const uploadImage = async () => {
    if (!image) {
      return "";
    }

    const formData = new FormData();
    formData.append("file", image);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Image upload failed");
    }

    return String(data.url || "");
  };

  const uploadBannerImage = async () => {
    if (!bannerImage) return "";
    const formData = new FormData();
    formData.append("file", bannerImage);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Banner image upload failed");
    return String(data.url || "");
  };
  const uploadBannerImage2 = async () => {
    if (!bannerImage2) return "";
    const formData = new FormData();
    formData.append("file", bannerImage2);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Second banner image upload failed");
    return String(data.url || "");
  };

  const saveNews = async () => {
    if (!title.trim() || !content.trim()) {
      alert("News Title और Full News जरूरी है।");
      return;
    }

    if (!category) {
      alert("Category select करें।");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = existingImage;
      let bannerImageUrl = existingBannerImage;
      let bannerImageUrl2 = existingBannerImage2;

      if (bannerImage) {
        bannerImageUrl = await uploadBannerImage();
      }

      if (bannerImage2) {
        bannerImageUrl2 = await uploadBannerImage2();
      }


      if (image) {
        imageUrl = await uploadImage();
      }

      const response = await fetch("/api/news", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          title: title.trim(),
          category,
          state,
          city,
          author: author.trim() || "Admin",
          excerpt: excerpt.trim(),
          content: content.trim(),
          image: imageUrl,
          bannerImageUrl,
          bannerAffiliateUrl: bannerAffiliateUrl.trim(),
          bannerImageUrl2,
          bannerAffiliateUrl2: bannerAffiliateUrl2.trim(),
          isBreaking,
          publishNow,
          shoppingDealIds: selectedShoppingDealIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "News save failed");
      }

      await loadNews();

      setShowForm(false);
      resetForm();

      alert(
        editingId
          ? "News successfully update हो गई।"
          : "News successfully save हो गई।"
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "News save नहीं हो पाई।"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = async (id: number) => {
    const confirmed = window.confirm(
      "क्या आप यह खबर delete करना चाहते हैं?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "News delete failed");
      }

      setNews((current) =>
        current.filter((item) => item.id !== id)
      );

      alert("News successfully delete हो गई।");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "News delete नहीं हो पाई।"
      );
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

            <p className="text-xs text-slate-400">
              News Management
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
              News Management
            </h2>

            <p className="mt-1 text-slate-500">
              अपनी सभी खबरों को manage करें।
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-red-600 px-5 py-3 font-black text-white shadow-lg hover:bg-red-700"
          >
            + Add New News
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">
                  {editingId ? "Edit News" : "Add New News"}
                </h3>

                <p className="text-sm text-slate-500">
                  {editingId
                    ? "News की जानकारी update करें।"
                    : "नई खबर की जानकारी भरें।"}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-lg bg-slate-100 px-3 py-2 font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  News Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="खबर का पूरा शीर्षक लिखें"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map((item) => (
                      <option
                        key={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Author
                  </label>

                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  >
                    <option value="">राज्य चुनें (वैकल्पिक)</option>
                    {indianStates.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">City / District</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="जैसे Chandil, Ranchi, Patna"
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
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="खबर का छोटा विवरण..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3">
                  <label className="block text-sm font-bold">
                    Shopping Deals (अधिकतम 4 प्रोडक्ट)
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    खबर के साथ दिखाने के लिए प्रोडक्ट चुनें। चुने गए Deals खबर के बीच और नीचे दिखेंगे।
                  </p>
                  <p className="mt-1 text-sm font-bold text-red-600">
                    चुने गए: {selectedShoppingDealIds.length}/4
                  </p>
                </div>

                {products.length === 0 ? (
                  <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    कोई प्रोडक्ट उपलब्ध नहीं है। पहले Products सेक्शन में प्रोडक्ट जोड़ें।
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {products.map((product) => {
                      const selected = selectedShoppingDealIds.includes(product.id);
                      const disabled =
                        !selected && selectedShoppingDealIds.length >= 4;

                      return (
                        <label
                          key={product.id}
                          className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${
                            selected
                              ? "border-red-500 bg-red-50"
                              : "border-slate-200"
                          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 accent-red-600"
                            checked={selected}
                            disabled={disabled}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setSelectedShoppingDealIds((current) =>
                                  current.length < 4 && !current.includes(product.id)
                                    ? [...current, product.id]
                                    : current
                                );
                              } else {
                                setSelectedShoppingDealIds((current) =>
                                  current.filter((id) => id !== product.id)
                                );
                              }
                            }}
                          />

                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                              No image
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-bold">{product.name}</p>
                            <p className="mt-1 text-sm font-semibold text-green-700">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>
                            <p className="break-all text-xs text-slate-500">
                              {product.active ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Full News
                </label>

                <textarea
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                />

                {existingImage && !image && (
                  <p className="mt-2 text-xs text-slate-500">
                    Existing image लगी हुई है। नई image चुनने पर replace हो जाएगी।
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <label className="mb-2 block text-sm font-bold">
                  Banner Image (Article के बीच)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setBannerImage(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
                {existingBannerImage && !bannerImage && (
                  <p className="mt-2 text-xs text-slate-500">
                    Existing banner लगा हुआ है। नई image चुनने पर replace होगा।
                  </p>
                )}
                <label className="mb-2 mt-4 block text-sm font-bold">
                  Banner Affiliate URL
                </label>
                <input
                  type="url"
                  value={bannerAffiliateUrl}
                  onChange={(e) => setBannerAffiliateUrl(e.target.value)}
                  placeholder="https://example.com/product"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
                <p className="mt-2 text-xs text-slate-500">
                  बैनर पर क्लिक करने से यह लिंक खुलेगा।
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <label className="mb-2 block text-sm font-bold">
                  Banner 2 Image (Article के बीच)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setBannerImage2(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
                {existingBannerImage2 && !bannerImage2 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Existing second banner लगा हुआ है। नई image चुनने पर replace होगा।
                  </p>
                )}
                <label className="mb-2 mt-4 block text-sm font-bold">
                  Banner 2 Affiliate URL
                </label>
                <input
                  type="url"
                  value={bannerAffiliateUrl2}
                  onChange={(e) => setBannerAffiliateUrl2(e.target.value)}
                  placeholder="https://example.com/product"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Banner 2 पर क्लिक करने से यह लिंक खुलेगा।
                </p>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 font-bold">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) =>
                      setIsBreaking(e.target.checked)
                    }
                    className="h-5 w-5"
                  />

                  Breaking News
                </label>

                <label className="flex cursor-pointer items-center gap-2 font-bold">
                  <input
                    type="checkbox"
                    checked={publishNow}
                    onChange={(e) =>
                      setPublishNow(e.target.checked)
                    }
                    className="h-5 w-5"
                  />

                  Publish Now
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveNews}
                  disabled={saving}
                  className="rounded-xl bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update News"
                      : "Save News"}
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
            <table className="w-full min-w-[900px] text-left">
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
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      News load हो रही है...
                    </td>
                  </tr>
                ) : (
                  <>
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
                          {item.category?.name || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {item.author || "Admin"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              item.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {item.status === "published"
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {item.isBreaking ? (
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
                            <button
                              onClick={() =>
                                openEditForm(item)
                              }
                              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteNews(item.id)
                              }
                              disabled={
                                deletingId === item.id
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === item.id
                                ? "Deleting..."
                                : "Delete"}
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
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
