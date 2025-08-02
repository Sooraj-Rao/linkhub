import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const linkHub = await prisma.linkHub.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        links: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!linkHub) {
      return NextResponse.json({ error: "LinkHub not found" }, { status: 404 });
    }

    return NextResponse.json(linkHub);
  } catch (error) {
    console.error("Failed to fetch LinkHub:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { name, bio, theme, isActive } = body;

    const existingHub = await prisma.linkHub.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingHub) {
      return NextResponse.json({ error: "LinkHub not found" }, { status: 404 });
    }

    const updatedHub = await prisma.linkHub.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(theme !== undefined && { theme }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedHub);
  } catch (error) {
    console.error("Failed to update LinkHub:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const linkHub = await prisma.linkHub.findFirst({
      where: {
        id,
        userId: user.id,
        isPersonal: false, 
      },
    });

    if (!linkHub) {
      return NextResponse.json(
        { error: "LinkHub not found or cannot be deleted" },
        { status: 404 }
      );
    }

    await prisma.link.deleteMany({
      where: { linkHubId: id },
    });

    await prisma.linkHub.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete LinkHub:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
