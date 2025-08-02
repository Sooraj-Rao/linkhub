import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const links = await prisma.link.findMany({
      where: {
        linkHub: { userId: user.id },
      },
      include: {
        linkHub: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error("Failed to fetch links:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { linkHubId, title, url, description, icon, type } = body

    if (!linkHubId || !title || !url) {
      return NextResponse.json({ error: "LinkHub ID, title, and URL are required" }, { status: 400 })
    }

    const linkHub = await prisma.linkHub.findFirst({
      where: { id: linkHubId, userId: user.id },
    })

    if (!linkHub) {
      return NextResponse.json({ error: "LinkHub not found" }, { status: 404 })
    }

    const lastLink = await prisma.link.findFirst({
      where: { linkHubId },
      orderBy: { order: "desc" },
    })

    const newOrder = lastLink ? lastLink.order + 1 : 0

    const link = await prisma.link.create({
      data: {
        linkHubId,
        title,
        url,
        description: description || null,
        icon: icon || null,
        type: type || "other",
        order: newOrder,
      },
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error("Failed to create link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
