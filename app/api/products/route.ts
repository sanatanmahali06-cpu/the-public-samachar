import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

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

// Public: website par active products dikhane ke liye
export async function GET() {
  try {
    const admin = await isAdmin();

    const products = await prisma.product.findMany({
      ...(admin ? {} : { where: { active: true } }),
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products fetch failed:", error);
    return NextResponse.json(
      { error: "Products load nahi ho sake" },
      { status: 500 }
    );
  }
}

// // Admin: naya product add karein
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price);
    const imageUrl = String(body.imageUrl || "").trim();
    const meeshoUrl = String(body.meeshoUrl || "").trim();

    if (!name || !Number.isFinite(price) || price <= 0 || (meeshoUrl && !validUrl(meeshoUrl))) {
      return NextResponse.json(
        { error: "Product name, valid price aur valid Meesho URL zaroori hain" },
        { status: 400 }
      );
    }

    if (imageUrl && !validUrl(imageUrl)) {
      return NextResponse.json({ error: "Image URL invalid hai" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        meeshoUrl,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product create failed:", error);
    return NextResponse.json({ error: "Product save nahi hua" }, { status: 500 });
  }
}

// Admin: product edit karein
export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Product ID invalid hai" }, { status: 400 });
    }

    const hasSidebarSetting =
      typeof body.showInShoppingDeals === "boolean" ||
      typeof body.showInBestDeals === "boolean";

    if (hasSidebarSetting) {
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(typeof body.showInShoppingDeals === "boolean"
            ? { showInShoppingDeals: body.showInShoppingDeals }
            : {}),
          ...(typeof body.showInBestDeals === "boolean"
            ? { showInBestDeals: body.showInBestDeals }
            : {}),
        },
      });

      return NextResponse.json(product);
    }

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price);
    const imageUrl = String(body.imageUrl || "").trim();
    const meeshoUrl = String(body.meeshoUrl || "").trim();
    const active = body.active !== false;

    if (!name || !Number.isFinite(price) || price <= 0 ||
        (meeshoUrl && !validUrl(meeshoUrl))) {
      return NextResponse.json({ error: "Product details ya URL invalid hain" }, { status: 400 });
    }

    if (imageUrl && !validUrl(imageUrl)) {
      return NextResponse.json({ error: "Image URL invalid hai" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        meeshoUrl,
        active,
        ...(typeof body.showInShoppingDeals === "boolean"
          ? { showInShoppingDeals: body.showInShoppingDeals }
          : {}),
        ...(typeof body.showInBestDeals === "boolean"
          ? { showInBestDeals: body.showInBestDeals }
          : {}),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product update failed:", error);
    return NextResponse.json({ error: "Product update nahi hua" }, { status: 500 });
  }
}

// Admin: product delete karein
export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Product ID invalid hai" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete failed:", error);
    return NextResponse.json({ error: "Product delete nahi hua" }, { status: 500 });
  }
}