import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminToken, createManagerToken, createReporterToken } from "@/lib/auth";

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

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (admin) {
      const passwordValid = await bcrypt.compare(
        password,
        admin.passwordHash
      );

      if (!passwordValid) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }

      const token = await createAdminToken(admin.id);

      const response = NextResponse.json({
        success: true,
        role: "admin",
        redirect: "/admin",
      });

      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    const manager = await prisma.manager.findUnique({
      where: { username },
    });

    if (manager) {
      if (manager.status !== "active") {
        return NextResponse.json(
          { error: "Manager account is inactive" },
          { status: 403 }
        );
      }

      const passwordValid = await bcrypt.compare(
        password,
        manager.passwordHash
      );

      if (!passwordValid) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }

      const token = await createManagerToken(manager.id);

      const response = NextResponse.json({
        success: true,
        role: "manager",
        redirect: "/manager",
        manager: {
          id: manager.id,
          name: manager.name,
          username: manager.username,
          email: manager.email,
          phone: manager.phone,
        },
      });

      response.cookies.set("manager_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
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
      role: "reporter",
      redirect: "/reporter/dashboard",
      reporter: {
        id: reporter.id,
        name: reporter.name,
        username: reporter.username,
        email: reporter.email,
        phone: reporter.phone,
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
    console.error("Unified login failed:", error);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}