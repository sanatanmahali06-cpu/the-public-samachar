import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function indiaDate(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  console.info("RASHIFAL_CRON_START", new Date().toISOString());

  if (!secret) {
    return NextResponse.json(
      { error: "Cron secret is not configured" },
      { status: 500 }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  const date = indiaDate();
  const slug = `rashifal-${date}`;

  try {
    const existing = await prisma.news.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        slug,
      });
    }

    const category = await prisma.category.findUnique({
      where: { slug: "rashifal" },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Rashifal category not found" },
        { status: 500 }
      );
    }

    const prompt = [
      "Write an original daily horoscope in natural Hindi using Devanagari script for THE PUBLIC SAMACHAR.",
      `Date: ${date}.`,
      "Cover all 12 zodiac signs in this exact order:",
      "Mesh (Aries), Vrishabh (Taurus), Mithun (Gemini), Kark (Cancer), Singh (Leo), Kanya (Virgo), Tula (Libra), Vrishchik (Scorpio), Dhanu (Sagittarius), Makar (Capricorn), Kumbh (Aquarius), Meen (Pisces).",
      "Use the correct Hindi Devanagari name as the heading for every sign.",
      "For each sign, write original, useful and distinct guidance about career, money, relationships and general wellbeing, followed by one practical tip.",
      "Use cautious language. Do not present predictions as facts or guarantees. Do not give medical diagnoses or guaranteed financial outcomes.",
      "Treat astrology as general entertainment and self-reflection.",
      "Write approximately 700 to 1000 Hindi words.",
      "Return plain text only. No HTML, no JSON and no Markdown bold markers.",
      "Put a blank line between signs. Start with a Hindi daily horoscope heading and the supplied date.",
    ].join(" ");

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a careful Hindi-language newspaper horoscope writer. Output readable Devanagari Hindi only.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          max_completion_tokens: 2400,
        }),
        cache: "no-store",
      }
    );

    if (!aiResponse.ok) {
      console.error("OpenAI request failed:", aiResponse.status);
      return NextResponse.json(
        { error: "AI content generation failed" },
        { status: 502 }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content?.trim();

    if (typeof content !== "string" || content.length < 500) {
      return NextResponse.json(
        { error: "AI returned empty or incomplete horoscope content" },
        { status: 502 }
      );
    }

    const title =
      "\u0906\u091c \u0915\u093e \u0930\u093e\u0936\u093f\u092b\u0932 - " +
      date.split("-").reverse().join("-");

    const excerpt =
      "\u0938\u092d\u0940 12 \u0930\u093e\u0936\u093f\u092f\u094b\u0902 " +
      "\u0915\u093e \u0906\u091c \u0915\u093e \u0926\u0948\u0928\u093f\u0915 " +
      "\u0930\u093e\u0936\u093f\u092b\u0932\u0964";

    try {
      const news = await prisma.news.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          author: "THE PUBLIC SAMACHAR",
          status: "published",
          isBreaking: false,
          publishedAt: new Date(),
          categoryId: category.id,
        },
      });

      return NextResponse.json({
        success: true,
        created: true,
        id: news.id,
        slug: news.slug,
        date,
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return NextResponse.json({
          success: true,
          alreadyExists: true,
          slug,
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Rashifal cron failed:", error);
    return NextResponse.json(
      { error: "Rashifal publishing failed" },
      { status: 500 }
    );
  }
}