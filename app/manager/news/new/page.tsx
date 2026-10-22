import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyManagerToken } from "@/lib/auth";
import ManagerNewNewsForm from "./ManagerNewNewsForm";

export default async function NewManagerNewsPage() {
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
      name: true,
      status: true,
    },
  });

  if (!manager || manager.status !== "active") {
    redirect("/");
  }

  return <ManagerNewNewsForm managerName={manager.name} />;
}