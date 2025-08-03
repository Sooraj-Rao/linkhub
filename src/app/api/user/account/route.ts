import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    cookies().delete("auth-token");

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        isActive: true,
      },
    });

    return NextResponse.json({ isActive: data.isActive }, { status: 200 });
  } catch (error) {
    console.error("Failed to update account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action !== "enable" && action !== "disable") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const userUpdate = prisma.user.update({
      where: { id: user.id },
      data: { isActive: action === "enable" },
    });

    const linkHubUpdate = prisma.linkHub.updateMany({
      where: { userId: user.id },
      data: { isActive: action === "enable" },
    });

    await Promise.all([userUpdate, linkHubUpdate]);

    return NextResponse.json({
      message: `Account ${action === "enable" ? "enabled" : "disabled"} successfully`,
    });
  } catch (error) {
    console.error("Failed to update account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}