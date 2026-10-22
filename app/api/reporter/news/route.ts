import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyReporterToken } from "@/lib/auth";

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0900-\u097f]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "news"}-${Date.now()}`;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("reporter_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const payload = await verifyReporterToken(token);
    const reporterId = Number(payload?.reporterId);

    if (!payload || !Number.isInteger(reporterId)) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const reporter = await prisma.reporter.findUnique({
      where: { id: reporterId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!reporter || reporter.status !== "active") {
      return NextResponse.json(
        { error: "Reporter account is inactive" },
        { status: 403 }
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

    const slug = makeSlug(title);

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        video,
        status: "pending",
        author: null,
        categoryId,
        reporterId: reporter.id,
        isBreaking: false,
        publishedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        reporterId: true,
        categoryId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "News submitted successfully",
        news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reporter news submission failed:", error);

    return NextResponse.json(
      { error: "Failed to submit news" },
      { status: 500 }
    );
  }
}
