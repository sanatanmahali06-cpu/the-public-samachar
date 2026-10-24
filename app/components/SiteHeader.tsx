"use client";

import { useEffect, useMemo, useState } from "react";
import HomeLoginButton from "@/app/components/HomeLoginButton";

type HeaderNews = {
  id: number;
  title: string;
  status: string;
  isBreaking?: boolean;
  state?: string | null;
  city?: string | null;
  category?: { name: string } | null;
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

const baseCategories = [
  "\u0939\u094b\u092e",
  "\u092c\u094d\u0930\u0947\u0915\u093f\u0902\u0917 \u0928\u094d\u092f\u0942\u091c\u093c",
  "\u0916\u0947\u0932",
  "\u0930\u093e\u0936\u093f\u092b\u0932"
];

const categorySlugMap: Record<string, string> = {
  "\u0916\u0947\u0932": "khel",
  "\u0930\u093e\u0936\u093f\u092b\u0932": "rashifal",
  "\u092e\u0928\u094b\u0930\u0902\u091c\u0928": "manoranjan",
  "\u0930\u093e\u0937\u094d\u091f\u094d\u0930\u0940\u092f": "rashtriya",
  "\u092c\u093f\u0939\u093e\u0930": "bihar",
  "\u091d\u093e\u0930\u0916\u0902\u0921": "jharkhand",
  "\u0936\u093f\u0915\u094d\u0937\u093e": "shiksha"
};

export default function SiteHeader() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [news, setNews] = useState<HeaderNews[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadHeaderData = async () => {
      try {
        const [newsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/news", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" })
        ]);

        if (newsResponse.ok) {
          const data = await newsResponse.json();
          if (!cancelled && Array.isArray(data)) setNews(data);
        }

        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json();
          if (!cancelled && Array.isArray(data)) {
            setCategories(data.map((item) => item.name).filter(Boolean));
          }
        }
      } catch (error) {
        console.error("Header data loading failed:", error);
      }
    };

    loadHeaderData();
    return () => { cancelled = true; };
  }, []);

  const navCategories = useMemo(
    () => [...baseCategories, ...categories.filter((name) => !baseCategories.includes(name))],
    [categories]
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

  const breakingTitles = news
    .filter((item) => item.status === "published" && item.isBreaking)
    .slice(0, 3)
    .map((item) => item.title);

  const goCategory = (category: string) => {
    setMenuOpen(false);

    if (category === baseCategories[0]) {
      window.location.href = "/";
      return;
    }

    if (category === baseCategories[1]) {
      window.location.href = "/?breaking=true";
      return;
    }

    window.location.href = `/category/${categorySlugMap[category] || category}`;
  };

  const doSearch = () => {
    if (search.trim()) {
      window.location.href = `/?search=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* HOME PAGE TOP HEADER */}
      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-1 px-1 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <div className="flex shrink-0 flex-col items-start -ml-1 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-0 py-0 text-2xl font-bold leading-none text-red-600"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>

        <a href="/" className="min-w-0 flex-1 ml-0 text-left sm:ml-0 sm:flex-none sm:text-left">
          <div className="flex min-w-0 items-center justify-center gap-0.5 translate-x-0 sm:translate-x-3">
            <img
              src="/logo.png"
              alt="THE PUBLIC SAMACHAR"
              className="h-9 w-9 shrink-0 translate-y-1 rounded-full border-2 border-red-600 object-cover shadow-sm sm:h-12 sm:w-12"
            />
            <h1 className="truncate text-[18px] font-black tracking-tight text-red-600 sm:text-2xl">
              THE PUBLIC {"\u0938\u092e\u093e\u091a\u093e\u0930"}
            </h1>
          </div>
          <p className="mt-0.5 translate-x-4 text-center text-base font-medium text-slate-500 sm:translate-x-7">
            {"\u0938\u091a \u0915\u0940 \u0916\u092c\u0930, \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947"}
          </p>
        </a>

        <div className="hidden flex-1 justify-center md:flex">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
            placeholder={"\u0916\u092c\u0930 \u0916\u094b\u091c\u0947\u0902..."}
            className="w-[85px] h-6 rounded-full border border-slate-300 px-1.5 py-0 text-[8px] outline-none focus:border-red-500 sm:w-full sm:max-w-md sm:px-5 sm:py-2.5 sm:text-base"
          />
        </div>



        <div className="ml-1 flex shrink-0 items-center gap-1 md:hidden">
          <a
            href="/#newsletter"
            aria-label="News notifications"
            title="News notifications"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-red-600 text-base text-red-600 hover:bg-red-50"
          >
            🔔
          </a>
          <a
            href="/#newsletter"
            className="shrink-0 whitespace-nowrap rounded-md bg-red-600 px-1.5 py-1 text-[10px] font-bold text-white hover:bg-red-700"
          >
            Subscribe
          </a>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <HomeLoginButton />
          {/* HOME DESKTOP SOCIAL LINKS */}
          <div className="flex items-center gap-2">
            <a href="https://chat.whatsapp.com/HML0RaaVCJtE3s0LeTY8gM?s=cl&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="text-green-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.1 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.9 1 1-3.8-.3-.4a9.8 9.8 0 1 1 8.6 4.8Zm5.4-7.3c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6s-.7-1.6-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 2 .6.8.3 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61595261695622" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="text-blue-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.08 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.56-4.71 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.27h3.35l-.54 3.49H13.9V24C19.64 23.08 24 18.1 24 12.07Z"/></svg>
            </a>
            <a href="https://www.instagram.com/samacharthepublic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="text-pink-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://youtube.com/@thepublicsamachar24?si=QLDh191jDoL_bK5q" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className="text-red-600">
              <svg width="22" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.4.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.58 9.4.58 9.4.58s7.55 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.93V8.07L16.2 12l-6.6 3.93Z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden border-t border-slate-200 bg-slate-950 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4">
          <div className="shrink-0 whitespace-nowrap py-3 text-xs font-semibold text-white">
            {currentDateTime.toLocaleDateString("hi-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <div className="flex min-w-0 flex-1 justify-center gap-1 overflow-x-auto">
            {navCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => goCategory(category)}
                className="whitespace-nowrap px-3 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                {category}
              </button>
            ))}
          </div>
          <div className="shrink-0 whitespace-nowrap py-3 text-xs font-semibold text-white">
            {currentDateTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </nav>

      {/* DESKTOP BREAKING TICKER - HOME STYLE */}
      <section className="hidden border-y-2 border-red-950 bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white shadow-md md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-1">
          <span className="shrink-0 rounded-md border border-white/70 bg-white px-4 py-1.5 text-xs font-black tracking-widest text-red-700 shadow">
            BREAKING
          </span>
          <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            <div className="breaking-ticker inline-block font-semibold">
              {breakingTitles.length > 0
                ? breakingTitles.join("  |  ")
                : "The Public Samachar — \u0926\u0947\u0936 \u0914\u0930 \u0926\u0941\u0928\u093f\u092f\u093e \u0915\u0940 \u0924\u093e\u091c\u093e \u0916\u092c\u0930\u0947\u0902"}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STATE AND CITY FILTER */}
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
          list="mobile-header-news-cities"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          placeholder="City / District"
          aria-label="Enter city or district"
          className="min-w-0 flex-1 rounded-md bg-zinc-800 px-2 py-1.5 text-xs text-white"
        />

        <datalist id="mobile-header-news-cities">
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

      {/* MOBILE DATE, SEARCH AND SOCIAL LINKS */}
      <div className="flex items-center gap-1 border-t border-slate-200 bg-white px-2 py-1 md:hidden">
        <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold text-slate-500">
          {currentDateTime.toLocaleDateString("en-GB")}
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
          placeholder={"\u0916\u092c\u0930 \u0916\u094b\u091c\u0947\u0902..."}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs outline-none focus:border-red-500"
        />

        <div className="flex shrink-0 items-center gap-1">
          <a href="https://chat.whatsapp.com/HML0RaaVCJtE3s0LeTY8gM?s=cl&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-green-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.1 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.9 1 1-3.8-.3-.4a9.8 9.8 0 1 1 8.6 4.8Zm5.4-7.3c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.1 0-.4 0-.6s-.7-1.6-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.3 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/></svg>
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
          {currentDateTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* MOBILE BREAKING NEWS */}
      <section className="border-y-2 border-red-800 bg-red-600 text-white shadow-md md:hidden">
        <div className="flex items-center overflow-hidden px-2 py-0.5">
          <span className="relative z-10 mr-2 shrink-0 rounded-md border border-red-200 bg-white px-2 py-0 text-[9px] font-black tracking-wide text-red-600 shadow-sm">
            BREAKING
          </span>
          <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            <div className="breaking-ticker inline-block text-xs font-bold">
              {breakingTitles.length > 0
                ? breakingTitles.join("  |  ")
                : "THE PUBLIC SAMACHAR — \u0926\u0947\u0936 \u0914\u0930 \u0926\u0941\u0928\u093f\u092f\u093e \u0915\u0940 \u0924\u093e\u091c\u093e \u0916\u092c\u0930\u0947\u0902"}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t bg-white p-4 md:hidden">
          <div className="grid grid-cols-1 gap-2">
            {navCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => goCategory(category)}
                className="rounded-lg bg-slate-100 px-3 py-3 text-left font-bold hover:bg-red-50"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}