import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const links = await prisma.link.findMany({
      where: { linkHubId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, url, description, icon, type } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const linkHub = await prisma.linkHub.findFirst({
      where: { id, userId: user.id },
    });

    if (!linkHub) {
      return NextResponse.json({ error: "LinkHub not found" }, { status: 404 });
    }

    const lastLink = await prisma.link.findFirst({
      where: { linkHubId: id },
      orderBy: { order: "desc" },
    });

    const newOrder = lastLink ? lastLink.order + 1 : 0;

    const link = await prisma.link.create({
      data: {
        linkHubId: id,
        title,
        url,
        description: description || null,
        icon: icon || null,
        type: type || "other",
        order: newOrder,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Failed to create link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
