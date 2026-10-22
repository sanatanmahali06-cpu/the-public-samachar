import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const endpoint = body?.endpoint;
    const p256dh = body?.keys?.p256dh;
    const auth = body?.keys?.auth;

    if (
      typeof endpoint !== "string" ||
      !endpoint.startsWith("https://") ||
      typeof p256dh !== "string" ||
      typeof auth !== "string" ||
      !p256dh ||
      !auth
    ) {
      return NextResponse.json(
        { error: "Invalid push subscription" },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh, auth },
      create: { endpoint, p256dh, auth },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not save push subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const endpoint = body?.endpoint;

    if (typeof endpoint !== "string" || !endpoint.startsWith("https://")) {
      return NextResponse.json(
        { error: "Invalid subscription endpoint" },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not remove push subscription" },
      { status: 500 }
    );
  }
}