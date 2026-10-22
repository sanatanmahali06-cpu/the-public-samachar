import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyAdminToken(token);

  if (!payload?.adminId) {
    return null;
  }

  return payload;
}

export async function GET() {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [reporters, managers] = await Promise.all([
      prisma.reporter.findMany({
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
      }),
      prisma.manager.findMany({
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
      }),
    ]);

    return NextResponse.json({
      reporters,
      managers,
    });
  } catch (error) {
    console.error("Admin users fetch failed:", error);

    return NextResponse.json(
      { error: "Users fetch failed" },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);
    const fromRole = body.fromRole;

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Valid user ID is required" },
        { status: 400 }
      );
    }

    if (fromRole === "reporter") {
      const reporter = await prisma.reporter.findUnique({
        where: { id },
        include: { news: { select: { id: true } } },
      });

      if (!reporter) {
        return NextResponse.json(
          { error: "Reporter not found" },
          { status: 404 }
        );
      }

      const existingManager = await prisma.manager.findUnique({
        where: { username: reporter.username },
      });

      if (existingManager) {
        return NextResponse.json(
          { error: "A Manager with this username already exists" },
          { status: 409 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.manager.create({
          data: {
            name: reporter.name,
            username: reporter.username,
            passwordHash: reporter.passwordHash,
            email: reporter.email,
            phone: reporter.phone,
            status: "active",
          },
        });

        await tx.reporter.update({
          where: { id: reporter.id },
          data: { status: "converted_to_manager" },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Reporter converted to Manager successfully",
      });
    }

    if (fromRole === "manager") {
      const manager = await prisma.manager.findUnique({
        where: { id },
      });

      if (!manager) {
        return NextResponse.json(
          { error: "Manager not found" },
          { status: 404 }
        );
      }

      const existingReporter = await prisma.reporter.findUnique({
        where: { username: manager.username },
      });

      if (existingReporter) {
        return NextResponse.json(
          { error: "A Reporter with this username already exists" },
          { status: 409 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.reporter.create({
          data: {
            name: manager.name,
            username: manager.username,
            passwordHash: manager.passwordHash,
            email: manager.email,
            phone: manager.phone,
            status: "active",
          },
        });

        await tx.manager.delete({
          where: { id: manager.id },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Manager converted to Reporter successfully",
      });
    }

    return NextResponse.json(
      { error: "Invalid source role" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin user role conversion failed:", error);

    return NextResponse.json(
      { error: "Role conversion failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);
    const role = body.role;

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Valid user ID is required" },
        { status: 400 }
      );
    }

    if (role === "reporter") {
      const reporter = await prisma.reporter.findUnique({
        where: { id },
        include: { news: { select: { id: true } } },
      });

      if (!reporter) {
        return NextResponse.json(
          { error: "Reporter not found" },
          { status: 404 }
        );
      }

      if (reporter.news.length > 0) {
        return NextResponse.json(
          {
            error: `Reporter has ${reporter.news.length} news record(s). Delete or reassign the news first.`,
          },
          { status: 409 }
        );
      }

      await prisma.reporter.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Reporter deleted successfully",
      });
    }

    if (role === "manager") {
      const manager = await prisma.manager.findUnique({
        where: { id },
      });

      if (!manager) {
        return NextResponse.json(
          { error: "Manager not found" },
          { status: 404 }
        );
      }

      await prisma.manager.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Manager deleted successfully",
      });
    }

    return NextResponse.json(
      { error: "Invalid role" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin user delete failed:", error);

    return NextResponse.json(
      { error: "User delete failed" },
      { status: 500 }
    );
  }
}