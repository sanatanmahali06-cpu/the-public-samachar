"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  content?: string;
  excerpt?: string | null;
  author?: string | null;
  image?: string | null;
  id: number;
  title: string;
  category?: {
    name: string;
  } | null;
  status?: string;
  isBreaking?: boolean;
  createdAt?: string;
  views?: number;
};

type CountData = {
  total: number;
  today: number;
  week: number;
  published: number;
  draft: number;
  breaking: number;
  pending: number;
  rejected: number;
  reporters: number;
  categories: number;
};

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
}

export default function AdminPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState<CountData>({
  total: 0,
  today: 0,
  week: 0,
  published: 0,
  draft: 0,
  breaking: 0,
  pending: 0,
  rejected: 0,
  reporters: 0,
  categories: 0,
});

  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })
    } finally {
      window.location.href = "/"
    }
  }

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        newsData,
        pendingData,
        rejectedData,
        reportersData,
        categoriesData,
      ] = await Promise.all([
        fetchJson("/api/news"),
        fetchJson("/api/admin/reporter-news?status=pending"),
        fetchJson("/api/admin/reporter-news?status=rejected"),
        fetchJson("/api/reporters"),
        fetchJson("/api/categories"),
      ]);

      const allNews: NewsItem[] = Array.isArray(newsData)
        ? newsData
        : [];

      const pendingNews = Array.isArray(pendingData)
        ? pendingData
        : [];

      const rejectedNews = Array.isArray(rejectedData)
        ? rejectedData
        : [];

      const reporters = Array.isArray(reportersData)
        ? reportersData
        : [];

      const categories = Array.isArray(categoriesData)
        ? categoriesData
        : [];

      const now = new Date();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);

      const todayNews = allNews.filter((item) => {
        if (!item.createdAt) return false;

        const createdAt = new Date(item.createdAt);

        return createdAt >= startOfToday;
      });

      const weekNews = allNews.filter((item) => {
        if (!item.createdAt) return false;

        const createdAt = new Date(item.createdAt);

        return createdAt >= startOfWeek;
      });

      setCounts({
        total: allNews.length,
        today: todayNews.length,
        week: weekNews.length,
        published: allNews.filter(
          (item) => item.status === "published"
        ).length,
        draft: allNews.filter(
          (item) => item.status === "draft"
        ).length,
        breaking: allNews.filter(
          (item) => item.isBreaking === true
        ).length,
        pending: pendingNews.length,
        rejected: rejectedNews.length,
        reporters: reporters.length,
        categories: categories.length,
      });

      setLatestNews(allNews.slice(0, 8));
    } catch (error) {
      console.error("Dashboard load failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Dashboard data load failed"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/logo.png"
              alt="The Public Samachar Logo"
              className="h-12 w-12 shrink-0 rounded-xl object-contain"
            />
            <div className="min-w-0">
              <h1 className="text-lg font-black leading-tight sm:text-2xl">
                THE PUBLIC SAMACHAR
              </h1>
              <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                Admin Control Panel
              </p>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button
            type="button"
            aria-label="Toggle admin menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 md:hidden"
          >
            <span className="text-2xl leading-none">☰</span>
          </button>
            <a
              href="/"
              className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Website →
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className={`${mobileMenuOpen ? "block" : "hidden"} w-full shrink-0 border-b bg-white p-3 md:block md:min-h-[calc(100vh-88px)] md:w-64 md:border-b-0 md:border-r md:p-4`}>
          <nav className="space-y-2">
  <a href="/admin" className="block rounded-lg bg-red-600 px-4 py-3 font-bold text-white">{"\u{1F4CA} Dashboard"}</a>
  <a href="/admin/news" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">{"\u2795 Add News"}</a>
  <a href="/admin/news" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">{"\u{1F4F0} News"}</a>
  <a href="/admin/categories" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">{"\u{1F4C2} Categories"}</a>
  <a href="/admin/products" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Products</a>
  <a href="/admin/subscribers" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Newsletter Subscribers</a>
  <a href="/admin/banners" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Global Banner Ads</a>
  <a href="/admin/reporters" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">{"\u{1F464} Reporters"}</a>
  <a href="/admin/managers" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Managers</a>
  <a href="/admin/users" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">User &amp; Role Management</a>
  <a href="/admin/reporter-news" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Reporter News</a>
  <a href="/admin/reporter-news" className="block rounded-lg px-4 py-3 font-bold hover:bg-orange-50">{"\u{1F7E0} Pending News"}</a>
  <a href="/admin/approved-news" className="block rounded-lg px-4 py-3 font-bold hover:bg-green-50">{"\u{1F7E2} Approved News"}</a>
  <a href="/admin/rejected-news" className="block rounded-lg px-4 py-3 font-bold hover:bg-red-50">{"\u{1F534} Rejected News"}</a>
  <a href="#breaking-news-management" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">{"\u{1F525} Breaking News Management"}</a>
  <a href="#news-statistics" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">{"\u{1F4CA} News Statistics"}</a>
  <a href="#latest-news" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Latest News</a>
  <a href="/admin/reporter-news" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Review Reporter News</a>
  <a href="/admin/categories" className="block rounded-lg px-4 py-3 font-bold hover:bg-slate-100">Manage Categories</a>
</nav>
        </aside>

        <section className="flex-1 p-4 md:p-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-red-600">
                Administration
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Dashboard
              </h2>

              <p className="mt-2 font-semibold text-slate-500">
                The Public Samachar को manage करें।
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="rounded-xl bg-slate-900 px-5 py-3 font-black text-white hover:bg-slate-700"
            >
              🔄 Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
              Dashboard error: {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center font-bold shadow-sm">
              Dashboard loading...
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold text-slate-500">
                    Total News
                  </p>
                  <p className="mt-2 text-4xl font-black">
                    {counts.total}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    सभी news
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold text-slate-500">
                    Published
                  </p>
                  <p className="mt-2 text-4xl font-black text-green-600">
                    {counts.published}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    प्रकाशित खबरें
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold text-slate-500">
                    Draft
                  </p>
                  <p className="mt-2 text-4xl font-black text-orange-500">
                    {counts.draft}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    अभी प्रकाशित नहीं
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold text-slate-500">
                    Breaking
                  </p>
                  <p className="mt-2 text-4xl font-black text-red-600">
                    {counts.breaking}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Breaking News
                  </p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        Today News
                      </p>
                      <p className="mt-2 text-4xl font-black text-blue-600">
                        {counts.today}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        आज जोड़ी गई खबरें
                      </p>
                    </div>
                    <div className="text-4xl">📅</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        This Week News
                      </p>
                      <p className="mt-2 text-4xl font-black text-purple-600">
                        {counts.week}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        पिछले 7 दिनों की खबरें
                      </p>
                    </div>
                    <div className="text-4xl">📈</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/admin/reporter-news"
                  className="rounded-2xl bg-orange-50 p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="text-3xl">⏳</div>
                  <p className="mt-3 text-sm font-bold text-orange-700">
                    Pending Reporter News
                  </p>
                  <p className="mt-1 text-4xl font-black text-orange-600">
                    {counts.pending}
                  </p>
                </a>

                <a
                  href="/admin/rejected-news"
                  className="rounded-2xl bg-red-50 p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="text-3xl">❌</div>
                  <p className="mt-3 text-sm font-bold text-red-700">
                    Rejected News
                  </p>
                  <p className="mt-1 text-4xl font-black text-red-600">
                    {counts.rejected}
                  </p>
                </a>

                <a
                  href="/admin/reporters"
                  className="rounded-2xl bg-blue-50 p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="text-3xl">👤</div>
                  <p className="mt-3 text-sm font-bold text-blue-700">
                    Reporters
                  </p>
                  <p className="mt-1 text-4xl font-black text-blue-600">
                    {counts.reporters}
                  </p>
                </a>

                <a
                  href="/admin/categories"
                  className="rounded-2xl bg-purple-50 p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="text-3xl">📂</div>
                  <p className="mt-3 text-sm font-bold text-purple-700">
                    Categories
                  </p>
                  <p className="mt-1 text-4xl font-black text-purple-600">
                    {counts.categories}
                  </p>
                </a>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <a
                  href="/admin/news"
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="text-3xl">➕</div>
                  <h3 className="mt-3 text-xl font-black">
                    Add News
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    नई खबर प्रकाशित करें।
                  </p>
                </a>

                <a
                  href="/admin/reporter-news"
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="text-3xl">📰</div>
                  <h3 className="mt-3 text-xl font-black">
                    Review Reporter News
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Reporter की pending news review करें।
                  </p>
                </a>

                <a
                  href="/admin/categories"
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="text-3xl">📂</div>
                  <h3 className="mt-3 text-xl font-black">
                    Manage Categories
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    News categories manage करें।
                  </p>
                </a>
              </div>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 id="breaking-news-management" className="text-xl font-black">
                      🔥 Breaking News Management
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Breaking News को Dashboard से manage करें।
                    </p>
                  </div>

                  <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">
                    {counts.breaking} Breaking
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {latestNews.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-5 text-center">
                      <p className="font-bold text-slate-600">
                        अभी कोई Breaking News नहीं है।
                      </p>
                    </div>
                  ) : (
                    latestNews.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50 p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-black text-white ${
                                  item.isBreaking
                                    ? "bg-red-600"
                                    : "bg-slate-500"
                                }`}
                              >
                                {item.isBreaking ? "BREAKING" : "NORMAL"}
                              </span>

                              <span className="text-xs font-bold text-slate-500">
                                {item.category?.name || "राष्ट्रीय"}
                              </span>
                            </div>

                            <p className="font-black text-slate-900">
                              {item.title}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const response = await fetch("/api/news", {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    id: item.id,
                                    title: item.title,
                                    content: item.content,
                                    excerpt: item.excerpt || "",
                                    author: item.author || "Admin",
                                    category:
                                      item.category?.name || "राष्ट्रीय",
                                    image: item.image || "",
                                    isBreaking: !item.isBreaking,
                                    publishNow:
                                      item.status === "published",
                                  }),
                                });

                                if (!response.ok) {
                                  throw new Error("Breaking status update failed");
                                }

                                await loadDashboard();
                              } catch (error) {
                                console.error(error);
                                alert("Breaking News update नहीं हो सका।");
                              }
                            }}
                            className={`shrink-0 rounded-xl px-4 py-3 text-sm font-black shadow-sm ring-1 transition ${
                              item.isBreaking
                                ? "bg-white text-red-600 ring-red-200 hover:bg-red-100"
                                : "bg-red-600 text-white ring-red-600 hover:bg-red-700"
                            }`}
                          >
                            {item.isBreaking ? "Remove Breaking" : "Make Breaking"}
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 id="news-statistics" className="text-xl font-black">
                      📊 News Statistics
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      News activity का overview
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      label: "Total News",
                      value: counts.total,
                      color: "bg-blue-500",
                      icon: "📰",
                    },
                    {
                      label: "Today News",
                      value: counts.today,
                      color: "bg-cyan-500",
                      icon: "📅",
                    },
                    {
                      label: "This Week",
                      value: counts.week,
                      color: "bg-purple-500",
                      icon: "📈",
                    },
                    {
                      label: "Published",
                      value: counts.published,
                      color: "bg-green-500",
                      icon: "🟢",
                    },
                    {
                      label: "Breaking News",
                      value: counts.breaking,
                      color: "bg-red-500",
                      icon: "🔥",
                    },
                    {
                      label: "Draft",
                      value: counts.draft,
                      color: "bg-orange-500",
                      icon: "📝",
                    },
                  ].map((stat) => {
                    const maxValue = Math.max(
                      counts.total,
                      counts.today,
                      counts.week,
                      counts.published,
                      counts.breaking,
                      counts.draft,
                      1
                    );

                    const percentage = Math.round(
                      (stat.value / maxValue) * 100
                    );

                    return (
                      <div key={stat.label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          
                            <span>{stat.icon}</span>
                            <span className="text-sm font-bold text-slate-700">
                              {stat.label}
                            </span>
                          </div>

                          <span className="text-sm font-black text-slate-900">
                            {stat.value}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${stat.color} transition-all duration-700`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-8 min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-3 shadow-sm sm:p-6">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 id="latest-news" className="break-words text-xl font-black">
                      Latest News
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Database से latest news
                    </p>
                  </div>

                  <a
                    href="/admin/news"
                    className="shrink-0 rounded-xl bg-red-600 px-4 py-3 font-black text-white hover:bg-red-700 sm:px-5"
                  >
                    + Add News
                  </a>
                </div>

                <div className="mt-6 overflow-x-auto">
                  {latestNews.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-6 text-center font-bold text-slate-500">
                      अभी कोई news नहीं है।
                    </div>
                  ) : (
                    <table className="w-full min-w-[700px] text-left">
                      <thead>
                        <tr className="border-b text-sm text-slate-500">
                          <th className="px-3 py-3">Title</th>
                          <th className="px-3 py-3">Date</th>
                          <th className="px-3 py-3">Category</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Breaking</th>
                          <th className="px-3 py-3">&#128065; Views</th>
                        </tr>
                      </thead>

                      <tbody>
                        {latestNews.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b last:border-0"
                          >
                            <td className="px-3 py-4 font-bold">
                              {item.title}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString("en-IN")
                                : "-"}
                            </td>

                            <td className="px-3 py-4">
                              {item.category?.name ||
                                "बिना category"}
                            </td>

                            <td className="px-3 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                  item.status === "published"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "draft"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {item.status || "unknown"}
                              </span>
                            </td>

                            <td className="px-3 py-4">
                              {item.isBreaking ? "YES" : "NO"}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 font-bold text-slate-700">
                              &#128065; {item.views ?? 0} Views
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
