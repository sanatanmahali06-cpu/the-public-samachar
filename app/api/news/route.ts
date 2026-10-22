import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsPush } from "@/lib/push";

async function isAdmin() {
  const store = await cookies();
  const token = store.get("admin_session")?.value;
  if (!token) return false;
  const payload = await verifyAdminToken(token);
  return Boolean(payload?.adminId);
}

function makeSlug(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097f]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now()
  );
}

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      include: {
        category: true,
        shoppingDeals: {
          include: { product: true },
          orderBy: { position: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "News fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    const title = String(body.title || "").trim();
    const content = String(body.content || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const author = String(body.author || "Admin").trim();
    const categoryName = String(body.category || "राष्ट्रीय").trim();
    const state = String(body.state || "").trim();
    const city = String(body.city || "").trim();
    const image = String(body.image || "").trim();
    const bannerImageUrl = String(body.bannerImageUrl || "").trim();
    const bannerAffiliateUrl = String(body.bannerAffiliateUrl || "").trim();
    const bannerImageUrl2 = String(body.bannerImageUrl2 || "").trim();
    const bannerAffiliateUrl2 = String(body.bannerAffiliateUrl2 || "").trim();
    const isBreaking = Boolean(body.isBreaking);
    const publishNow = Boolean(body.publishNow);
    const shoppingDealIds: number[] = (Array.isArray(body.shoppingDealIds)
      ? body.shoppingDealIds
      : [])
      .map((id: unknown) => Number(id))
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .filter((id: number, index: number, all: number[]) => all.indexOf(id) === index)
      .slice(0, 4);

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title और Full News जरूरी है" },
        { status: 400 }
      );
    }

    let category = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: makeSlug(categoryName),
        },
      });
    }

    const createdNews = await prisma.news.create({
      data: {
        title,
        slug: makeSlug(title),
        excerpt: excerpt || null,
        content,
        author: author || "Admin",
        image: image || null,
        bannerImageUrl: bannerImageUrl || null,
        bannerAffiliateUrl: bannerAffiliateUrl || null,
        bannerImageUrl2: bannerImageUrl2 || null,
        bannerAffiliateUrl2: bannerAffiliateUrl2 || null,
        status: publishNow ? "published" : "draft",
        isBreaking,
        state: state || null,
        city: city || null,
        publishedAt: publishNow ? new Date() : null,
        categoryId: category.id,
        shoppingDeals: {
          create: shoppingDealIds.map((productId, index) => ({
            position: index + 1,
            product: { connect: { id: productId } },
          })),
        },
      },
      include: {
        category: true,
        shoppingDeals: {
          include: { product: true },
          orderBy: { position: "asc" },
        },
      },
    });

    if (publishNow) {
      try {
        await sendNewsPush({
          title: createdNews.title,
          body: createdNews.excerpt || "नई खबर पढ़ने के लिए वेबसाइट खोलें।",
          url: `/news/${createdNews.slug}`,
        });
      } catch (pushError) {
        console.error("News push notification failed:", pushError);
      }
    }

    return NextResponse.json(createdNews, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "News save failed",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    const id = Number(body.id);
    const title = String(body.title || "").trim();
    const content = String(body.content || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const author = String(body.author || "Admin").trim();
    const categoryName = String(body.category || "राष्ट्रीय").trim();
    const state = String(body.state || "").trim();
    const city = String(body.city || "").trim();
    const image = String(body.image || "").trim();
    const bannerImageUrl = String(body.bannerImageUrl || "").trim();
    const bannerAffiliateUrl = String(body.bannerAffiliateUrl || "").trim();
    const bannerImageUrl2 = String(body.bannerImageUrl2 || "").trim();
    const bannerAffiliateUrl2 = String(body.bannerAffiliateUrl2 || "").trim();
    const isBreaking = Boolean(body.isBreaking);
    const publishNow = Boolean(body.publishNow);
    const shoppingDealIds: number[] = (Array.isArray(body.shoppingDealIds)
      ? body.shoppingDealIds
      : [])
      .map((id: unknown) => Number(id))
      .filter((id: number) => Number.isInteger(id) && id > 0)
      .filter((id: number, index: number, all: number[]) => all.indexOf(id) === index)
      .slice(0, 4);

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "ID, Title और Full News जरूरी है" },
        { status: 400 }
      );
    }

    let category = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: makeSlug(categoryName),
        },
      });
    }

    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News नहीं मिली" },
        { status: 404 }
      );
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        excerpt: excerpt || null,
        content,
        author: author || "Admin",
        image: image || existingNews.image,
        bannerImageUrl: Object.prototype.hasOwnProperty.call(body, "bannerImageUrl") ? (bannerImageUrl || null) : existingNews.bannerImageUrl,
        bannerAffiliateUrl: Object.prototype.hasOwnProperty.call(body, "bannerAffiliateUrl") ? (bannerAffiliateUrl || null) : existingNews.bannerAffiliateUrl,
        bannerImageUrl2: Object.prototype.hasOwnProperty.call(body, "bannerImageUrl2") ? (bannerImageUrl2 || null) : existingNews.bannerImageUrl2,
        bannerAffiliateUrl2: Object.prototype.hasOwnProperty.call(body, "bannerAffiliateUrl2") ? (bannerAffiliateUrl2 || null) : existingNews.bannerAffiliateUrl2,
        status: publishNow ? "published" : "draft",
        isBreaking,
        state: state || null,
        city: city || null,
        publishedAt: publishNow
          ? existingNews.publishedAt || new Date()
          : null,
        categoryId: category.id,
        shoppingDeals: {
          deleteMany: {},
          create: shoppingDealIds.map((productId, index) => ({
            position: index + 1,
            product: { connect: { id: productId } },
          })),
        },
      },
      include: {
        category: true,
        shoppingDeals: {
          include: { product: true },
          orderBy: { position: "asc" },
        },
      },
    });

    if (publishNow && existingNews.status !== "published") {
      try {
        await sendNewsPush({
          title: updatedNews.title,
          body: updatedNews.excerpt || "नई खबर पढ़ने के लिए वेबसाइट खोलें।",
          url: `/news/${updatedNews.slug}`,
        });
      } catch (pushError) {
        console.error("News push notification failed:", pushError);
      }
    }

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "News update failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { error: "Invalid news ID" },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "News delete failed",
      },
      { status: 500 }
    );
  }
}
