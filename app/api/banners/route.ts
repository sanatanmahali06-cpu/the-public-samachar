import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

const allowedPlacements = ["trending_below", "trending_1", "trending_2", "trending_3", "latest_news", "hero_below"];

async function isAdmin() {
  const store = await cookies();
  const token = store.get("admin_session")?.value;
  if (!token) return false;
  const payload = await verifyAdminToken(token);
  return Boolean(payload?.adminId);
}

function validUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateBanner(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const imageUrl = String(body.imageUrl ?? "").trim();
  const targetUrl = String(body.targetUrl ?? "").trim();
  const placements = body.placements;
  const interval = Number(body.interval ?? 2);

  if (!name || !imageUrl || !targetUrl ||
      !validUrl(imageUrl) || !validUrl(targetUrl)) {
    return { error: "Name, valid image URL aur target URL zaroori hain" };
  }

  if (!Array.isArray(placements) ||
      placements.some((p) => typeof p !== "string" ||
        !allowedPlacements.includes(p))) {
    return { error: "Banner placement invalid hai" };
  }

  if (![1, 2, 3, 5].includes(interval)) {
    return { error: "Interval 1, 2, 3 ya 5 hona chahiye" };
  }

  return {
    data: {
      name,
      imageUrl,
      targetUrl,
      placements: [...new Set(placements as string[])],
      interval,
    },
  };
}

export async function GET() {
  try {
    const admin = await isAdmin();
    const banners = await prisma.banner.findMany({
      ...(admin ? {} : { where: { active: true } }),
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Banner fetch failed:", error);
    return NextResponse.json(
      { error: "Banners load nahi ho sake" },
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
    const checked = validateBanner(body);

    if ("error" in checked) {
      return NextResponse.json({ error: checked.error }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        ...checked.data,
        active: body.active !== false,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Banner create failed:", error);
    return NextResponse.json(
      { error: "Banner save nahi hua" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Banner ID invalid hai" },
        { status: 400 }
      );
    }

    if (body.active !== undefined &&
        Object.keys(body).every((key) => ["id", "active"].includes(key))) {
      if (typeof body.active !== "boolean") {
        return NextResponse.json(
          { error: "Active value true ya false hona chahiye" },
          { status: 400 }
        );
      }

      const banner = await prisma.banner.update({
        where: { id },
        data: { active: body.active },
      });
      return NextResponse.json(banner);
    }

    const checked = validateBanner(body);
    if ("error" in checked) {
      return NextResponse.json({ error: checked.error }, { status: 400 });
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...checked.data,
        active: body.active !== false,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner update failed:", error);
    return NextResponse.json(
      { error: "Banner update nahi hua" },
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

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Banner ID invalid hai" },
        { status: 400 }
      );
    }

    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Banner delete failed:", error);
    return NextResponse.json(
      { error: "Banner delete nahi hua" },
      { status: 500 }
    );
  }
}
