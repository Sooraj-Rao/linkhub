import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customHubs = await prisma.linkHub.findMany({
      where: {
        userId: user.id,
        isPersonal: false,
      },
      include: {
        _count: {
          select: { links: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customHubs);
  } catch (error) {
    console.error("Failed to fetch custom LinkHubs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, bio, theme = "default" } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const existingHub = await prisma.linkHub.findUnique({
      where: { slug },
    });

    if (existingHub) {
      return NextResponse.json(
        { error: "Slug already taken" },
        { status: 400 }
      );
    }

    const linkHub = await prisma.linkHub.create({
      data: {
        userId: user.id,
        name,
        slug,
        bio: bio || null,
        theme,
        isPersonal: false,
        isActive: true,
      },
    });

    return NextResponse.json(linkHub);
  } catch (error) {
    console.error("Failed to create custom LinkHub:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
