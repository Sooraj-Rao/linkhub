import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
    const {
      name,
      bio,
      avatar,
      theme,
      backgroundType,
      backgroundColor,
      backgroundGradient,
      backgroundImage,
      textColor,
      buttonStyle,
      buttonColor,
      buttonTextColor,
      borderRadius,
      shadowStyle,
    } = body;

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
        ...(avatar !== undefined && { avatar }),
        ...(theme !== undefined && { theme }),
        ...(backgroundType !== undefined && { backgroundType }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(backgroundGradient !== undefined && { backgroundGradient }),
        ...(backgroundImage !== undefined && { backgroundImage }),
        ...(textColor !== undefined && { textColor }),
        ...(buttonStyle !== undefined && { buttonStyle }),
        ...(buttonColor !== undefined && { buttonColor }),
        ...(buttonTextColor !== undefined && { buttonTextColor }),
        ...(borderRadius !== undefined && { borderRadius }),
        ...(shadowStyle !== undefined && { shadowStyle }),
        updatedAt: new Date(),
      },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(updatedHub);
  } catch (error) {
    console.error("Failed to update LinkHub appearance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      where: { id, userId: user.id },
      include: {
        links: {
          where: { isActive: true },
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
