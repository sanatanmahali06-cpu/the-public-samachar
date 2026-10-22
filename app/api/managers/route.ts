import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const token = request.headers
      .get("cookie")
      ?.match(/(?:^|;\s*)admin_session=([^;]+)/)?.[1];

    if (!token || !(await verifyAdminToken(decodeURIComponent(token)))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const email = String(body.email || "").trim() || null;
    const phone = String(body.phone || "").trim() || null;

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Name, username and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingManager = await prisma.manager.findUnique({
      where: { username },
    });

    if (existingManager) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const manager = await prisma.manager.create({
      data: {
        name,
        username,
        passwordHash,
        email,
        phone,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, manager },
      { status: 201 }
    );
  } catch (error) {
    console.error("Manager creation failed:", error);

    return NextResponse.json(
      { error: "Failed to create manager" },
      { status: 500 }
    );
  }
}