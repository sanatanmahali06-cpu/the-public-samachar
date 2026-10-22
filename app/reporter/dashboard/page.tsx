import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyReporterToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ReporterDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("reporter_session")?.value;

  if (!token) {
    redirect("/reporter/login");
  }

  const payload = await verifyReporterToken(token);
  const reporterId = Number(payload?.reporterId);

  if (!payload || !Number.isInteger(reporterId)) {
    redirect("/reporter/login");
  }

  const reporter = await prisma.reporter.findUnique({
    where: { id: reporterId },
    select: {
      id: true,
      name: true,
      username: true,
      status: true,
    },
  });

  if (!reporter || reporter.status !== "active") {
    redirect("/reporter/login");
  }

  const totalNews = await prisma.news.count({
    where: {
      reporterId: reporter.id,
    },
  });

  const pendingNews = await prisma.news.count({
    where: {
      reporterId: reporter.id,
      status: "pending",
    },
  });

  const publishedNews = await prisma.news.count({
    where: {
      reporterId: reporter.id,
      status: "published",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-300">
                THE PUBLIC SAMACHAR
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Reporter Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Welcome, {reporter.name}
              </p>
            </div>

            <form action="/api/reporter/logout" method="post">
              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-slate-500">
              My News
            </p>
            <p className="mt-2 text-3xl font-black">
              {totalNews}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-slate-500">
              Pending
            </p>
            <p className="mt-2 text-3xl font-black">
              {pendingNews}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-slate-500">
              Published
            </p>
            <p className="mt-2 text-3xl font-black">
              {publishedNews}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-black">
            Reporter Menu
          </h2>

          <div className="mt-5">
            <a
              href="/reporter/news/new"
              className="block rounded-xl bg-slate-950 px-5 py-4 text-center font-bold text-white"
            >
              + Submit New News
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}