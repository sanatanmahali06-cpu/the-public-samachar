import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reporters = await prisma.reporter.findMany({
      orderBy: {
        createdAt: "desc",
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

    return NextResponse.json(reporters);
  } catch (error) {
    console.error("Reporters fetch failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch reporters" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
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

    const existing = await prisma.reporter.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const reporter = await prisma.reporter.create({
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
      { success: true, reporter },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reporter creation failed:", error);

    return NextResponse.json(
      { error: "Failed to create reporter" },
      { status: 500 }
    );
  }
}
