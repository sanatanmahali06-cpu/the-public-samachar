import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyManagerToken } from "@/lib/auth";

async function getManager() {
  const cookieStore = await cookies();
  const token = cookieStore.get("manager_session")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyManagerToken(token);
  const managerId = Number(payload?.managerId);

  if (!payload || payload.role !== "manager" || !Number.isInteger(managerId)) {
    return null;
  }

  const manager = await prisma.manager.findUnique({
    where: { id: managerId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!manager || manager.status !== "active") {
    return null;
  }

  return manager;
}

export async function GET(request: Request) {
  try {
    const manager = await getManager();

    if (!manager) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const allowedStatuses = ["pending", "published", "rejected"];

    const where =
      status && allowedStatuses.includes(status)
        ? {
            reporterId: {
              not: null,
            },
            status,
          }
        : {
            reporterId: {
              not: null,
            },
          };

    const news = await prisma.news.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        video: true,
        status: true,
        isBreaking: true,
        publishedAt: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Manager reporter news fetch failed:", error);

    return NextResponse.json(
      { error: "Reporter news fetch failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const manager = await getManager();

    if (!manager) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);
    const action = String(body.action || "").trim().toLowerCase();

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid news ID" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const existingNews = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        reporterId: true,
      },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    if (!existingNews.reporterId) {
      return NextResponse.json(
        { error: "This is not reporter news" },
        { status: 400 }
      );
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data:
        action === "approve"
          ? {
              status: "published",
              publishedAt: new Date(),
            }
          : {
              status: "rejected",
              publishedAt: null,
            },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "News approved successfully"
          : "News rejected successfully",
      news: updatedNews,
    });
  } catch (error) {
    console.error("Manager reporter news update failed:", error);

    return NextResponse.json(
      { error: "Reporter news update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const manager = await getManager();

    if (!manager) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid news ID" },
        { status: 400 }
      );
    }

    const existingNews = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        reporterId: true,
      },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    if (!existingNews.reporterId) {
      return NextResponse.json(
        { error: "This is not reporter news" },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Reporter news deleted successfully",
    });
  } catch (error) {
    console.error("Manager reporter news delete failed:", error);

    return NextResponse.json(
      { error: "Reporter news delete failed" },
      { status: 500 }
    );
  }
}