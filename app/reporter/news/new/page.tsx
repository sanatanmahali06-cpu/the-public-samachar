import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyReporterToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReporterNewNewsForm from "./ReporterNewNewsForm";

export default async function ReporterNewNewsPage() {
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
      status: true,
    },
  });

  if (!reporter || reporter.status !== "active") {
    redirect("/reporter/login");
  }

  return (
    <ReporterNewNewsForm reporterName={reporter.name} />
  );
}