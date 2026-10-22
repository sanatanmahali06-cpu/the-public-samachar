"use client";
import ShareButtons from "@/app/components/ShareButtons";
import ShoppingDealsSidebars from "@/app/components/ShoppingDealsSidebars";
import NewsGridWithAds from "@/app/components/NewsGridWithAds";
import GlobalBannerDisplay from "@/app/components/GlobalBannerDisplay";
import { useEffect, useMemo, useState } from "react";
import HomeLoginButton from "./components/HomeLoginButton";
import PushNotificationPrompt from "./components/PushNotificationPrompt";

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  image: string | null;
  status: string;
  isBreaking: boolean;
  state?: string | null;
  city?: string | null;
  publishedAt: string | null;
  createdAt: string;
  category?: {
    name: string;
  } | null;
};

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];
const baseCategories = ["होम", "ब्रेकिंग न्यूज़", "\u0916\u0947\u0932", "\u0930\u093e\u0936\u093f\u092b\u0932"];

const fallbackImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

export default function Home() {
  const [notificationBellEnabled, setNotificationBellEnabled] = useState(false);

  useEffect(() => {
    const updateBellStatus = (event: Event) => {
      setNotificationBellEnabled(
        (event as CustomEvent<boolean>).detail === true
      );
    };

    window.addEventListener("news-notification-status", updateBellStatus);

    if ("serviceWorker" in navigator && "Notification" in window) {
      navigator.serviceWorker.getRegistration("/").then(async (registration) => {
        const subscription = await registration?.pushManager.getSubscription();
        setNotificationBellEnabled(
          Boolean(subscription) && Notification.permission === "granted"
        );
      }).catch(() => setNotificationBellEnabled(false));
    }

    return () => {
      window.removeEventListener("news-notification-status", updateBellStatus);
    };
  }, []);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const [active, setActive] = useState("होम");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterBusy, setNewsletterBusy] = useState(false);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus("");
    setNewsletterBusy(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Subscription failed.");
      setNewsletterStatus(result.message || "Subscription successful!");
      setNewsletterEmail("");
    } catch (error) {
      setNewsletterStatus(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setNewsletterBusy(false);
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch("/api/news", {
          cache: "no-store",
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setNews(data);
        }
      } catch (error) {
        console.error("News fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data.map((item) => item.name).filter(Boolean));
        }
      } catch (error) {
        console.error("Categories fetch failed:", error);
      }
    };

    loadCategories();
  }, []);

  const navCategories = [
  ...baseCategories,
  ...categories.filter((name) => !baseCategories.includes(name)),
];

const categorySlugMap: Record<string, string> = {
  "\u0916\u0947\u0932": "khel",
  "\u0930\u093e\u0936\u093f\u092b\u0932": "rashifal",
  "\u092e\u0928\u094b\u0930\u0902\u091c\u0928": "manoranjan",
  "राष्ट्रीय": "rashtriya",
  "बिहार": "bihar",
  "झारखंड": "jharkhand",
  "शिक्षा": "shiksha",
};

  const publishedNews = useMemo(
    () => news.filter((item) => item.status === "published"),
    [news]
  );

  const availableCities = useMemo(() => {
    const citySet = new Set<string>();

    news.forEach((item) => {
      if (
        item.status === "published" &&
        item.city?.trim() &&
        (!selectedState || item.state?.trim() === selectedState)
      ) {
        citySet.add(item.city.trim());
      }
    });

    return Array.from(citySet).sort((a, b) => a.localeCompare(b));
  }, [news, selectedState]);
  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return publishedNews.filter((item) => {
      const category = item.category?.name || "";

      const matchesSearch =
        !query ||
        `${item.title} ${item.excerpt || ""} ${category}`
          .toLowerCase()
          .includes(query);

      let matchesCategory = true;

      if (active === "ब्रेकिंग न्यूज़") {
        matchesCategory = item.isBreaking;
      } else if (active !== "होम") {
        matchesCategory = category === active;
      }

      const matchesState =

        !selectedState || item.state?.trim() === selectedState;


      const matchesCity =

        !selectedCity ||

        item.city?.trim().toLowerCase() === selectedCity.trim().toLowerCase();


      return matchesSearch && matchesCategory && matchesState && matchesCity;
    });
  }, [publishedNews, search, active, selectedState, selectedCity]);

  const breakingNews = publishedNews.filter(
    (item) => item.isBreaking
  );

  const latestNews = filteredNews.slice(0, 6);

  const heroNews = filteredNews[0] || publishedNews[0];

  const biharNews = publishedNews
    .filter((item) => item.category?.name === "बिहार")
    .slice(0, 6);

  const formatDate = (date: string | null) => {
    if (!date) return "अभी";

    return new Date(date).toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const readLink = (item: NewsItem) => `/news/${item.id}`;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 px-2 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
          <div className="flex shrink-0 flex-col items-start -ml-1 md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-0 py-0 text-2xl font-bold leading-none text-red-600"
            >
              ☰
            </button>

          </div>

          <a href="/" className="min-w-0 flex-none ml-1 text-left sm:ml-0 sm:flex-none sm:text-left">
            <div className="flex items-center justify-center gap-0.5 translate-x-0 sm:translate-x-3"><img src="/logo.png" alt="THE PUBLIC समाचार" className="h-9 w-9 shrink-0 translate-y-1 rounded-full border-2 border-red-600 object-cover shadow-sm sm:h-12 sm:w-12" /><h1 className="truncate text-[24px] font-black tracking-tight text-red-600 sm:text-2xl">
              THE PUBLIC समाचार
            </h1></div>

            <p className="mt-0.5 translate-x-4 text-center text-base font-medium text-slate-500 sm:translate-x-7">
              सच की खबर, सबसे पहले
            </p>
          </a>

          <div className="hidden flex-1 justify-center md:flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="खबर खोजें..."
              className="w-[85px] h-6 rounded-full border border-slate-300 px-1.5 py-0 text-[8px] outline-none focus:border-red-500 sm:w-full sm:max-w-md sm:px-5 sm:py-2.5 sm:text-base"
            />
          </div>



          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                (window as Window & { toggleNewsNotifications?: () => void }).toggleNewsNotifications?.();
              }}
              aria-label="News notifications"
              title="News notifications"
              className={`flex h-7 w-7 items-center justify-center rounded-md border text-base ${
                notificationBellEnabled
                  ? "border-green-600 text-green-600"
                  : "border-red-600 text-red-600"
              }`}
            >
              🔔
            </a>
            <a
              href="#newsletter"
              className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700"
            >
              Subscribe
            </a>
          </div>
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <HomeLoginButton />
            <div className="flex items-center gap-2">
              <a href="https://chat.whatsapp.com/HML0RaaVCJtE3s0LeTY8gM?s=cl&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-green-600" title="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.1 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.9 1 1-3.8-.3-.4a9.8 9.8 0 1 1 8.6 4.8Zm5.4-7.3c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6s-.7-1.6-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 2 .6.8.3 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61595261695622" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-600" title="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.08 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.56-4.71 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.27h3.35l-.54 3.49H13.9V24C19.64 23.08 24 18.1 24 12.07Z"/></svg>
              </a>
              <a href="https://www.instagram.com/samacharthepublic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pink-600" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://youtube.com/@thepublicsamachar24?si=QLDh191jDoL_bK5q" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-red-600" title="YouTube">
                <svg width="22" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.4.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.58 9.4.58 9.4.58s7.55 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.93V8.07L16.2 12l-6.6 3.93Z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="hidden border-t border-slate-200 bg-slate-950 md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4">
            <div className="shrink-0 whitespace-nowrap py-3 text-xs font-semibold text-white">
              {currentDateTime.toLocaleDateString("hi-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </div>
            <div className="flex min-w-0 flex-1 justify-center gap-1 overflow-x-auto">
            {navCategories.map((category) => {
              const isSpecial =
                category === "होम" || category === "ब्रेकिंग न्यूज़";

              const slugMap: Record<string, string> = {
  "राष्ट्रीय": "rashtriya",
                "बिहार": "bihar",
              };

              return isSpecial ? (
                <button
                  key={category}
                  onClick={() => setActive(category)}
                  className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition ${
                    active === category
                      ? "bg-transparent text-white"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              ) : (
                <a
                  key={category}
                  href={`/category/${categorySlugMap[category] || (category.includes("manoranjan") ? "manoranjan" : category)}`}
                  className="whitespace-nowrap px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  {category}
                </a>
              );
            })}
            </div>
            <div className="shrink-0 whitespace-nowrap py-3 text-xs font-semibold text-white">
              {currentDateTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </nav>

{/* BREAKING TICKER */}
      <section className="hidden border-y-2 border-red-950 bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white shadow-md md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-1">
          <span className="shrink-0 rounded-md border border-white/70 bg-white px-4 py-1.5 text-xs font-black tracking-widest text-red-700 shadow">
            BREAKING
          </span>

          <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            <div className="breaking-ticker inline-block font-semibold">
              {breakingNews.length > 0 ? (
                breakingNews
                  .slice(0, 3)
                  .map((item) => item.title)
                  .join("  |  ")
              ) : (
                "The Public Samachar — देश और दुनिया की ताजा खबरें"
              )}
            </div>
          </div>
        </div>
      </section>

        {/* MOBILE BLACK STRIP */}
        <div className="flex items-center gap-2 border-b-2 border-black bg-black px-2 py-1 md:hidden">
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity("");
            }}
            aria-label="Select state"
            className="min-w-0 max-w-[48%] flex-1 rounded-md bg-zinc-800 px-2 py-1.5 text-xs font-semibold text-white"
          >
            <option value="">All states</option>
            {indianStates.map((stateName) => (
              <option key={stateName} value={stateName}>{stateName}</option>
            ))}
          </select>
          <input
            list="mobile-news-cities"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            placeholder="City / District"
            aria-label="Enter city or district"
            className="min-w-0 flex-1 rounded-md bg-zinc-800 px-2 py-1.5 text-xs text-white"
          />
          <datalist id="mobile-news-cities">
            {availableCities.map((cityName) => (
              <option key={cityName} value={cityName} />
            ))}
          </datalist>
          {(selectedState || selectedCity) && (
            <button
              type="button"
              onClick={() => {
                setSelectedState("");
                setSelectedCity("");
              }}
              className="shrink-0 rounded-md bg-red-600 px-2 py-1.5 text-xs font-bold text-white"
            >
              Reset
            </button>
          )}
        </div>

        {/* MOBILE DATE SEARCH SOCIAL AND TIME */}
        <div className="flex items-center gap-1 border-t border-slate-200 bg-white px-2 py-1 md:hidden">
          <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold text-slate-500">
            {currentDateTime.toLocaleDateString("en-GB")}
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="खबर खोजें..."
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs outline-none focus:border-red-500"
          />
          <div className="flex shrink-0 items-center gap-1">
            <a href="https://chat.whatsapp.com/HML0RaaVCJtE3s0LeTY8gM?s=cl&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-green-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.1 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.9 1 1-3.8-.3-.4a9.8 9.8 0 1 1 8.6 4.8Zm5.4-7.3c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6s-.7-1.6-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.3 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/></svg>
            </a>
            <a href="https://www.instagram.com/samacharthepublic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pink-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61595261695622" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.08 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.56-4.71 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.27h3.35l-.54 3.49H13.9V24C19.64 23.08 24 18.1 24 12.07Z"/></svg>
            </a>
            <a href="https://youtube.com/@thepublicsamachar24?si=QLDh191jDoL_bK5q" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-red-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.4.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.58 9.4.58 9.4.58s7.55 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.93V8.07L16.2 12l-6.6 3.93Z"/></svg>
            </a>
          </div>
          <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold text-slate-500">
            {currentDateTime.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
          </span>
        </div>

        {/* MOBILE BREAKING */}
        <section className="border-y-2 border-red-800 bg-red-600 text-white shadow-md md:hidden">
          <div className="flex items-center overflow-hidden px-2 py-0.5">
            <span className="relative z-10 mr-2 shrink-0 rounded-md border border-red-200 bg-white px-2 py-0 text-[9px] font-black tracking-wide text-red-600 shadow-sm">
              BREAKING
            </span>
            <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
              <div className="breaking-ticker inline-block text-xs font-bold">
                {breakingNews.length > 0 ? breakingNews.slice(0, 3).map((item) => item.title).join("  |  ") : "The Public Samachar — देश और दुनिया की ताजा खबरें"}
              </div>
            </div>
          </div>
        </section>



        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t bg-white p-4 md:hidden">
            <div className="grid grid-cols-1 gap-2">
              {navCategories.map((category) => {
                const isSpecial =
                  category === "होम" || category === "ब्रेकिंग न्यूज़";

                const slugMap: Record<string, string> = {
  "राष्ट्रीय": "rashtriya",
                  "बिहार": "bihar",
                };

                return isSpecial ? (
                  <button
                    key={category}
                    onClick={() => {
                      setActive(category);
                      setMenuOpen(false);
                    }}
                    className="rounded-lg bg-slate-100 px-3 py-3 text-left font-bold hover:bg-red-50"
                  >
                    {category}
                  </button>
                ) : (
                  <a
                    key={category}
                    href={`/category/${categorySlugMap[category] || (category.includes("manoranjan") ? "manoranjan" : category)}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-slate-100 px-3 py-3 text-left font-bold hover:bg-red-50"
                  >
                    {category}
                  </a>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
              <div className="rounded-lg bg-slate-100 px-3 py-3 text-center font-bold">
                <HomeLoginButton />
              </div>
              <a
                href="#newsletter"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-red-600 px-3 py-3 text-center font-bold text-white hover:bg-red-700"
              >
                Subscribe
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-4 px-4 xl:grid-cols-[180px_minmax(0,1fr)_180px] xl:items-start">
        <aside className="hidden min-w-0 xl:sticky xl:top-4 xl:block">
          <ShoppingDealsSidebars side="left" />
        </aside>

        <div className="min-w-0">

      {/* HERO */}
      <section className="hidden min-[1024px]:block mx-auto max-w-7xl px-4 pt-6 pb-1 sm:pt-8 sm:pb-1">
        <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)] lg:items-start">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <article className="relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl min-w-0 min-h-[620px] lg:min-h-[520px] lg:aspect-video lg:col-start-1 lg:row-start-1 w-full">
            {heroNews ? (
              <>
                <a href={readLink(heroNews)} className="absolute inset-0 z-0 block" aria-label={heroNews.title}>
                <img
                  src={heroNews.image || fallbackImage}
                  alt={heroNews.title}
                  className="absolute inset-0 h-full w-full object-contain opacity-50"
                />
                </a>

                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/90 to-black/30" />

                <div className="relative z-20 flex min-h-[620px] items-end p-4 sm:p-6 lg:min-h-0 lg:h-full">
                  <div className="max-w-3xl">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black">
                      {heroNews.isBreaking
                        ? "BREAKING NEWS"
                        : "TOP STORY"}
                    </span>

                    <h2 className="mt-2 break-words text-lg font-black leading-snug sm:text-3xl sm:leading-tight">
                      <a href={readLink(heroNews)} className="hover:underline">
                        {heroNews.title}
                      </a>
                    </h2>
                    <p className="mt-2 break-words text-xs leading-5 text-white drop-shadow-md sm:text-sm">
                      {heroNews.excerpt ||
                        "The Public Samachar पर पढ़ें देश और दुनिया की ताजा खबरें।"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <a
                        href={readLink(heroNews)}
                        className="inline-flex items-center whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 font-bold hover:bg-red-700"
                      >
                        पूरी खबर पढ़ें →
                      </a>
                      <ShareButtons slug={String(heroNews.id)} compact />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[390px] items-center justify-center p-8 text-center">
                <div>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black">
                    THE PUBLIC समाचार
                  </span>

                  <h2 className="mt-5 text-3xl font-black sm:text-5xl">
                    आज की बड़ी खबरें
                  </h2>


                  <p className="mt-4 text-slate-300">
                    Admin Panel से खबर publish करें।
                  </p>
                </div>
              </div>
            )}
          </article>
          <div className="hidden min-w-0 lg:mt-4 lg:block">
            <GlobalBannerDisplay placement="hero_below" />
          </div>
          </div>

          {/* LATEST */}
          <aside className="hidden min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-lg lg:block lg:col-start-2 lg:row-start-1 w-full">
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-3">
              <h3 className="text-xl font-black">⚡ ताजा खबरें</h3>

              <span className="text-xs font-bold text-red-600">
                LIVE
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <p className="py-8 text-center text-slate-500">
                  खबरें load हो रही हैं...
                </p>
              ) : latestNews.length > 0 ? (
                latestNews.slice(0, 5).map((item, index) => (
                  <a
                    key={item.id}
                    href={readLink(item)}
                    className="block min-w-0 border-b border-slate-100 py-4 transition-colors hover:bg-slate-50 last:border-b-0"
                  >
                    <span className="text-xs font-black text-red-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="mt-1 break-words font-semibold leading-6">
                      {item.title}
                    </p>

                    <span className="mt-1 block text-xs text-slate-400">
                      {formatDate(
                        item.publishedAt || item.createdAt
                      )}
                    </span>
                  </a>
                ))
              ) : (
                <p className="py-8 text-center text-slate-500">
                  अभी कोई published news नहीं है।
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>



      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-sm font-black text-red-600">
              TRENDING
            </span>

            <h2 className="text-base font-black sm:text-2xl">
              अभी चर्चा में
            </h2>
        </div>


          <button
            onClick={() => setActive("होम")}
            className="font-bold text-red-600"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center font-bold">
            News loading...
          </div>
        ) : latestNews.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
            अभी कोई published news नहीं है।
          </div>
        ) : (
          <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.slice(0, 3).map((item, index) => (
              <div key={item.id} className="min-w-0">
              <article
                className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <a href={readLink(item)} className="block cursor-pointer"><img src={item.image || fallbackImage} alt={item.title} className="h-auto max-h-80 w-full object-contain" /></a>

                <div className="p-5">
                  <span className="text-xs font-black text-red-600">
                    {item.category?.name || "राष्ट्रीय"}
                  </span>

                  <h3 className="mt-2 text-xl font-black leading-tight"><a href={readLink(item)} className="hover:text-red-600">{item.title}</a></h3>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {item.excerpt ||
                      "The Public Samachar की ताजा जानकारी पढ़ें।"}
                  </p>

                  <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
  <a
    href={readLink(item)}
    className="font-bold text-red-600 hover:underline"
  >
    पूरी खबर पढ़ें →
  </a>
                    <ShareButtons slug={String(item.id)} compact mobileButtonOnly />
</div></div>
              </article>
              <div className="mt-4 md:hidden">
                {index === 0 && <GlobalBannerDisplay placement="trending_1" />}
                {index === 1 && <GlobalBannerDisplay placement="trending_2" />}
                {index === 2 && <GlobalBannerDisplay placement="trending_3" />}
              </div>
              </div>
            ))}
          </div>
          <div className="hidden min-w-0 md:grid md:grid-cols-3 md:gap-5">
            <GlobalBannerDisplay placement="trending_1" />
            <GlobalBannerDisplay placement="trending_2" />
            <GlobalBannerDisplay placement="trending_3" />
          </div>
          </>
        )}
      </section>

      <div className="hidden md:block">
        <GlobalBannerDisplay placement="trending_below" />
      </div>
      {/* ALL NEWS */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-3 border-b border-slate-300 pb-2 sm:mb-6 sm:pb-4">
          <span className="text-[10px] font-black text-red-600 sm:text-sm">
            LATEST NEWS
          </span>

          <h2 className="text-sm font-black sm:text-2xl">
            ताजा खबरें
          </h2>
        </div>

        <div className="mb-6">
        </div>

        {filteredNews.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
            इस category में अभी कोई खबर नहीं है।
          </div>
        ) : (
          <NewsGridWithAds news={filteredNews} fallbackImage={fallbackImage} formatDate={formatDate} readLink={readLink} />
        )}
      </section>

      {/* BIHAR NEWS */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-6 border-b border-slate-300 pb-4">
          <span className="text-sm font-black text-red-600">
            BIHAR NEWS
          </span>

          <h2 className="text-base font-black sm:text-2xl">
            बिहार की ताजा खबरें
          </h2>
        </div>


        {biharNews.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
            अभी बिहार की कोई published news नहीं है।
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {biharNews.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-md"
              >
                <img
                  src={item.image || fallbackImage}
                  alt={item.title}
                  className="block h-auto max-h-80 w-full object-contain object-center"
                />

                <div className="p-5">
                  <span className="text-sm font-black text-red-600">
                    बिहार
                  </span>

                  <h3 className="mt-2 text-xl font-black leading-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.excerpt ||
                      "बिहार की ताजा और महत्वपूर्ण खबरें The Public Samachar पर पढ़ें।"}
                  </p>

                  <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
  <a
    href={readLink(item)}
    className="font-bold text-red-600 hover:underline"
  >
    पूरी खबर पढ़ें →
  </a>
                    <ShareButtons slug={String(item.id)} compact mobileButtonOnly />
</div></div>
              </article>
            ))}
          </div>
        )}
      </section>

        </div>

        <aside className="hidden min-w-0 xl:sticky xl:top-4 xl:block">
          <ShoppingDealsSidebars side="right" />
        </aside>
      </div>

      {/* FOOTER WITH NEWSLETTER */}
      <footer className="relative mt-8 overflow-hidden border-t-4 border-red-600 bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.16),transparent_55%)]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-9 text-center sm:px-8 sm:py-12 lg:gap-10">
          <div className="flex min-w-0 flex-col items-center">
            <a href="/" className="group inline-flex flex-col items-center gap-3">
              <img
                src="/logo.png"
                alt="THE PUBLIC समाचार"
                className="h-16 w-16 rounded-full border-2 border-red-500 object-cover shadow-lg shadow-red-950/40 transition duration-300 group-hover:scale-105 sm:h-[76px] sm:w-[76px]"
              />
              <div>
                <h2 className="text-xl font-black tracking-tight sm:text-3xl">
                  {"THE PUBLIC \u0938\u092e\u093e\u091a\u093e\u0930"}
                </h2>
                <p className="mt-2 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300 sm:text-sm">
                  {"\u0938\u091a \u0915\u0940 \u0916\u092c\u0930, \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947"}
                </p>
              </div>
            </a>

            <p className="mt-5 max-w-lg text-center text-sm leading-7 text-slate-300 sm:text-base">
              {"\u0926\u0947\u0936-\u0926\u0941\u0928\u093f\u092f\u093e \u0914\u0930 \u0906\u092a\u0915\u0947 \u0906\u0938\u092a\u093e\u0938 \u0915\u0940 \u0924\u093e\u091c\u093e \u0916\u092c\u0930\u0947\u0902 \u092a\u0922\u093c\u0947\u0902 \u2014 \u0938\u091a \u0915\u0940 \u0916\u092c\u0930, \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947\u0964"}
            </p>

            <nav aria-label="Footer navigation" className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-semibold text-slate-300">
              <a href="/about" className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white">About</a>
              <a href="/privacy" className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white">Privacy</a>
              <a href="/terms" className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white">Terms</a>
              <a href="/contact" className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white">Contact</a>
              <a href="/disclaimer" className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white">Disclaimer</a>
              <a href="/advertise" className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white">विज्ञापन के लिए संपर्क करें</a>
              <a href="/all-news" className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white">{"\u0938\u092d\u0940 \u0916\u092c\u0930\u0947\u0902"}</a>
            </nav>

            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61595261695622" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[#1877F2] transition hover:-translate-y-1 hover:border-blue-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.08 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.56-4.71 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.27h3.35l-.54 3.49H13.9V24C19.64 23.08 24 18.1 24 12.07Z"/></svg>
              </a>
              <a href="https://www.instagram.com/samacharthepublic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-pink-500 transition hover:-translate-y-1 hover:border-pink-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://youtube.com/@thepublicsamachar24?si=QLDh191jDoL_bK5q" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-red-500 transition hover:-translate-y-1 hover:border-red-500">
                <svg width="22" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.4.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.58 9.4.58 9.4.58s7.55 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.93V8.07L16.2 12l-6.6 3.93Z"/></svg>
              </a>
            </div>
          </div>

          <div className="relative min-w-0 overflow-hidden rounded-2xl border border-red-500/30 bg-slate-950 p-5 text-center shadow-2xl shadow-black/30 sm:p-7">
            <div className="absolute inset-x-0 top-0 h-7 bg-red-700" />
            <h2 className="mt-5 text-xl font-black sm:text-2xl">
              {"\u0939\u0930 \u092c\u0921\u093c\u0940 \u0916\u092c\u0930 \u0938\u0947 \u091c\u0941\u0921\u093c\u0947 \u0930\u0939\u0947\u0902"}
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-300">
              {"The Public Samachar \u0915\u0940 \u0924\u093e\u091c\u093e \u0916\u092c\u0930\u0947\u0902 \u092a\u0922\u093c\u0924\u0947 \u0930\u0939\u0947\u0902\u0964"}
            </p>

            <form id="newsletter" onSubmit={handleNewsletterSubmit} className="mx-auto mt-6 flex w-full max-w-md flex-col items-center gap-3">
              <label htmlFor="newsletter-email" className="text-center text-sm font-bold text-slate-200">
                {"\u0906\u092a\u0915\u093e \u0908\u092e\u0947\u0932 \u092a\u0924\u093e"}
              </label>
              <div className="flex w-full flex-col items-stretch gap-3">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Email address"
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                />
                <button
                  type="submit"
                  disabled={newsletterBusy}
                  className="min-h-12 w-full rounded-xl bg-red-600 px-7 py-3 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {newsletterBusy ? "Please wait..." : "Subscribe"}
                </button>
              </div>
            </form>

            <PushNotificationPrompt />

            {newsletterStatus && (
              <p role="status" aria-live="polite" className="mx-auto mt-4 max-w-md rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-bold text-slate-200">
                {newsletterStatus}
              </p>
            )}
          </div>
        </div>

        <div className="relative border-t border-slate-800 bg-black/30 px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center text-xs text-slate-400">
            <p>© 2026 The Public Samachar. All Rights Reserved.</p>
            <p>{"\u0938\u091a \u0915\u0940 \u0916\u092c\u0930, \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947"}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
