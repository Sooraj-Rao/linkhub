import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const personalHub = await prisma.linkHub.findFirst({
      where: {
        userId: user.id,
        isPersonal: true,
      },
      include: {
        links: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!personalHub) {
      return NextResponse.json(
        { error: "Personal LinkHub not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(personalHub);
  } catch (error) {
    console.error("Failed to fetch personal LinkHub:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
