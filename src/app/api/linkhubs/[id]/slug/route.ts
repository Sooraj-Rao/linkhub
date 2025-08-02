import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { slug } = body

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const slugRegex = /^[a-zA-Z0-9_-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          error: "Slug can only contain letters, numbers, hyphens, and underscores",
        },
        { status: 400 },
      )
    }

    if (slug.length < 3) {
      return NextResponse.json({ error: "Slug must be at least 3 characters long" }, { status: 400 })
    }

    if (slug.length > 50) {
      return NextResponse.json({ error: "Slug must be less than 50 characters" }, { status: 400 })
    }

    const existingHub = await prisma.linkHub.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingHub) {
      return NextResponse.json({ error: "LinkHub not found" }, { status: 404 })
    }

    const slugExists = await prisma.linkHub.findFirst({
      where: {
        slug: slug.toLowerCase(),
        id: { not: id }, 
      },
    })

    if (slugExists) {
      return NextResponse.json({ error: "This URL is already taken" }, { status: 409 })
    }

    const updatedHub = await prisma.linkHub.update({
      where: { id },
      data: {
        slug: slug.toLowerCase(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedHub)
  } catch (error) {
    console.error("Failed to update LinkHub slug:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
