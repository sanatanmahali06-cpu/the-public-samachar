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

  if (!payload || !Number.isInteger(managerId)) {
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

export async function GET() {
  try {
    const manager = await getManager();

    if (!manager) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const news = await prisma.news.findMany({
      include: {
        category: true,
        reporter: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Manager news fetch failed:", error);

    return NextResponse.json(
      { error: "News fetch failed" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const manager = await getManager();

    if (!manager) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim() || null;
    const content = String(body.content || "").trim();
    const image = String(body.image || "").trim() || null;
    const video = String(body.video || "").trim() || null;

    const categoryId =
      body.categoryId === null ||
      body.categoryId === undefined ||
      body.categoryId === ""
        ? null
        : Number(body.categoryId);

    const status =
      body.status === "published" ? "published" : "draft";

    const isBreaking = body.isBreaking === true;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and full news are required" },
        { status: 400 }
      );
    }

    if (title.length < 5) {
      return NextResponse.json(
        { error: "Title is too short" },
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { error: "News content is too short" },
        { status: 400 }
      );
    }

    if (categoryId !== null && !Number.isInteger(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (categoryId !== null) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 400 }
        );
      }
    }

    const slug =
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0900-\u097f]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now();

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        video,
        status,
        author: null,
        categoryId,
        reporterId: null,
        isBreaking,
        publishedAt: status === "published" ? new Date() : null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        categoryId: true,
        isBreaking: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "News created successfully",
        news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Manager news creation failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create news",
      },
      { status: 500 }
    );
  }
}