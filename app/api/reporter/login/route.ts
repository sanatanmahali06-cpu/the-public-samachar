import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createReporterToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const reporter = await prisma.reporter.findUnique({
      where: { username },
    });

    if (!reporter) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    if (reporter.status !== "active") {
      return NextResponse.json(
        { error: "Reporter account is inactive" },
        { status: 403 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      reporter.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await createReporterToken(reporter.id);

    const response = NextResponse.json({
      success: true,
      reporter: {
        id: reporter.id,
        name: reporter.name,
        username: reporter.username,
        email: reporter.email,
        phone: reporter.phone,
        status: reporter.status,
      },
    });

    response.cookies.set("reporter_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Reporter login failed:", error);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}