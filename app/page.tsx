"use client";

import { useState } from "react";

const categories = [
  "होम",
  "ब्रेकिंग न्यूज़",
  "राष्ट्रीय",
  "राज्य",
  "दुनिया",
  "मनोरंजन",
  "खेल",
  "बिजनेस",
];

const stories = [
  {
    category: "राष्ट्रीय",
    title: "देश की बड़ी खबरें और महत्वपूर्ण अपडेट",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "दुनिया",
    title: "दुनिया की प्रमुख खबरों पर एक नजर",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "मनोरंजन",
    title: "फिल्म और मनोरंजन जगत की ताजा खबरें",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "खेल",
    title: "खेल जगत की बड़ी खबरें और अपडेट",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "बिजनेस",
    title: "बाजार और बिजनेस की महत्वपूर्ण खबरें",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "राज्य",
    title: "राज्यों से जुड़ी ताजा और महत्वपूर्ण खबरें",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  const [active, setActive] = useState("होम");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredStories = stories.filter((story) =>
    `${story.title} ${story.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg bg-slate-950 px-3 py-2 text-xl text-white md:hidden"
          >
            ☰
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black tracking-tight text-red-600 sm:text-3xl">
              THE PUBLIC SAMACHAR
            </h1>
            <p className="text-xs font-medium text-slate-500">
              सच की खबर, सबसे पहले
            </p>
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="खबर खोजें..."
              className="w-full max-w-md rounded-full border border-slate-300 px-5 py-2.5 outline-none focus:border-red-500"
            />
          </div>

          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
            लॉगिन
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="border-t border-slate-200 bg-slate-950">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition ${
                  active === category
                    ? "bg-red-600 text-white"
                    : "text-white hover:bg-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        {/* MOBILE SEARCH */}
        <div className="border-t bg-white p-3 md:hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="खबर खोजें..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-red-500"
          />
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t bg-white p-4 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
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
              ))}
            </div>
          </div>
        )}
      </header>

      {/* BREAKING TICKER */}
      <section className="bg-red-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center overflow-hidden px-4 py-3">
          <span className="mr-4 shrink-0 rounded bg-white px-3 py-1 text-xs font-black text-red-600">
            BREAKING
          </span>

          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-pulse font-semibold">
              The Public Samachar — देश और दुनिया की ताजा खबरें | आज की
              महत्वपूर्ण खबरों पर नजर रखें
            </div>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="relative min-h-[390px] overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl lg:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80"
              alt="News"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="relative flex min-h-[390px] items-end p-6 sm:p-10">
              <div className="max-w-3xl">
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black">
                  TOP STORY
                </span>

                <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                  आज की बड़ी खबरें अब एक ही जगह
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-200 sm:text-base">
                  The Public Samachar पर पढ़ें देश, राज्य, दुनिया,
                  मनोरंजन, खेल और बिजनेस की ताजा खबरें।
                </p>

                <button className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-bold hover:bg-red-700">
                  पूरी खबर पढ़ें →
                </button>
              </div>
            </div>
          </article>

          {/* LATEST */}
          <aside className="rounded-2xl bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-3">
              <h3 className="text-xl font-black">⚡ ताजा खबरें</h3>
              <span className="text-xs font-bold text-red-600">LIVE</span>
            </div>

            <div className="divide-y">
              {[
                "देश की बड़ी खबरों पर नजर",
                "राज्य की महत्वपूर्ण खबरें",
                "मनोरंजन की ताजा अपडेट",
                "खेल जगत की खबरें",
                "बिजनेस की नई जानकारी",
              ].map((item, index) => (
                <div key={item} className="py-4">
                  <span className="text-xs font-black text-red-600">
                    0{index + 1}
                  </span>
                  <p className="mt-1 font-semibold">{item}</p>
                  <span className="text-xs text-slate-400">
                    अभी कुछ समय पहले
                  </span>
                </div>
              ))}
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
            <h2 className="text-2xl font-black sm:text-3xl">
              अभी चर्चा में
            </h2>
          </div>

          <button className="font-bold text-red-600">
            View All →
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredStories.slice(0, 3).map((story) => (
            <article
              key={story.title}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={story.image}
                alt={story.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-5">
                <span className="text-xs font-black text-red-600">
                  {story.category}
                </span>

                <h3 className="mt-2 text-xl font-black leading-tight">
                  {story.title}
                </h3>

                <p className="mt-3 text-sm text-slate-500">
                  The Public Samachar की ताजा जानकारी पढ़ें।
                </p>

                <button className="mt-4 font-bold text-red-600">
                  पूरी खबर पढ़ें →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ALL NEWS */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-6 border-b border-slate-300 pb-4">
          <span className="text-sm font-black text-red-600">
            LATEST NEWS
          </span>
          <h2 className="text-2xl font-black sm:text-3xl">
            ताजा खबरें
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <article
              key={story.title}
              className="overflow-hidden rounded-2xl bg-white shadow-md"
            >
              <img
                src={story.image}
                alt={story.title}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <span className="text-sm font-black text-red-600">
                  {story.category}
                </span>

                <h3 className="mt-2 text-xl font-black leading-tight">
                  {story.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  देश और दुनिया से जुड़ी महत्वपूर्ण खबरों की जानकारी
                  The Public Samachar पर पढ़ें।
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    29 सितंबर 2026
                  </span>

                  <button className="font-bold text-red-600">
                    पढ़ें →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-red-600 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">
            हर बड़ी खबर से जुड़े रहें
          </h2>

          <p className="mt-2 text-red-100">
            The Public Samachar की ताजा खबरें पढ़ते रहें।
          </p>

          <div className="mx-auto mt-5 flex max-w-xl gap-2">
            <input
              placeholder="अपना ईमेल लिखें"
              className="min-w-0 flex-1 rounded-lg px-4 py-3 text-slate-900 outline-none"
            />

            <button className="rounded-lg bg-slate-950 px-5 py-3 font-bold">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-4 py-10 text-center text-white">
        <h2 className="text-2xl font-black">THE PUBLIC SAMACHAR</h2>

        <p className="mt-2 text-slate-400">
          सच की खबर, सबसे पहले
        </p>

        <div className="mx-auto mt-6 flex max-w-md justify-center gap-5 text-sm text-slate-400">
          <button>About</button>
          <button>Contact</button>
          <button>Privacy</button>
          <button>Terms</button>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          © 2026 The Public Samachar. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
