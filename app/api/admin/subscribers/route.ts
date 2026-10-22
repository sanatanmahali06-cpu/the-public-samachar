import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAdminToken(token);

    if (!payload?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [total, subscribers] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({ total, subscribers });
  } catch (error) {
    console.error("Admin subscribers fetch failed:", error);
    return NextResponse.json(
      { error: "Subscribers fetch failed" },
      { status: 500 }
    );
  }
}