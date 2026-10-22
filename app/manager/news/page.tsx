import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyManagerToken } from "@/lib/auth";
import ManagerNewsList from "./ManagerNewsList";

export default async function ManagerNewsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("manager_session")?.value;

  if (!token) {
    redirect("/");
  }

  const payload = await verifyManagerToken(token);
  const managerId = Number(payload?.managerId);

  if (!payload || !Number.isInteger(managerId)) {
    redirect("/");
  }

  const manager = await prisma.manager.findUnique({
    where: { id: managerId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!manager || manager.status !== "active") {
    redirect("/");
  }

  return <ManagerNewsList />;
}