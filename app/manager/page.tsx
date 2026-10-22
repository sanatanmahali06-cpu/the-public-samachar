import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyManagerToken } from "@/lib/auth";

export default async function ManagerPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("manager_session")?.value;

  if (!token) {
    redirect("/");
  }

  const payload = await verifyManagerToken(token);

  if (!payload?.managerId) {
    redirect("/");
  }

  const manager = await prisma.manager.findUnique({
    where: {
      id: Number(payload.managerId),
    },
    select: {
      id: true,
      name: true,
      username: true,
      status: true,
    },
  });

  if (!manager || manager.status !== "active") {
    redirect("/");
  }

  const totalNews = await prisma.news.count();

  const publishedNews = await prisma.news.count({
    where: {
      status: "published",
    },
  });

  const draftNews = await prisma.news.count({
    where: {
      status: "draft",
    },
  });

  const pendingReporterNews = await prisma.news.count({
    where: {
      reporterId: {
        not: null,
      },
      status: "pending",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-300">
                THE PUBLIC SAMACHAR
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Manager Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Welcome, {manager.name}
              </p>
            </div>

            <form action="/api/manager/logout" method="post">
              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">All News</p>
            <p className="mt-2 text-3xl font-black">{totalNews}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Published</p>
            <p className="mt-2 text-3xl font-black">{publishedNews}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Draft</p>
            <p className="mt-2 text-3xl font-black">{draftNews}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">
              Pending Reporter News
            </p>
            <p className="mt-2 text-3xl font-black">
              {pendingReporterNews}
            </p>
            <a
              href="/manager/reporter-news"
              className="mt-3 inline-block text-sm font-black text-orange-600 hover:underline"
            >
              Manage Reporter News →
            </a>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Manager Controls
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/manager/news/new"
              className="rounded-xl bg-red-600 px-5 py-4 text-center font-black text-white hover:bg-red-700"
            >
              Add New News
            </a>

            <a
              href="/manager/news"
              className="rounded-xl bg-slate-900 px-5 py-4 text-center font-black text-white hover:bg-slate-700"
            >
              Manage All News
            </a>

            <a
              href="/manager/reporter-news"
              className="rounded-xl bg-orange-600 px-5 py-4 text-center font-black text-white hover:bg-orange-700"
            >
              Reporter News
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}