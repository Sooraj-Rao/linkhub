import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
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
    const { links } = body;

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { error: "Invalid links data" },
        { status: 400 }
      );
    }

    const linkHub = await prisma.linkHub.findFirst({
      where: { id, userId: user.id },
    });

    if (!linkHub) {
      return NextResponse.json({ error: "LinkHub not found" }, { status: 404 });
    }

    await prisma.$transaction(
      links.map((link: { id: string; order: number }) =>
        prisma.link.update({
          where: {
            id: link.id,
            linkHubId: id,
          },
          data: { order: link.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
