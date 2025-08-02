import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const slugRegex = /^[a-zA-Z0-9_-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ available: false });
    }

    if (slug.length < 3) {
      return NextResponse.json({ available: false });
    }

    const existingHub = await prisma.linkHub.findFirst({
      where: { slug: slug.toLowerCase() },
    });

    return NextResponse.json({ available: !existingHub });
  } catch (error) {
    console.error("Failed to check slug availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
