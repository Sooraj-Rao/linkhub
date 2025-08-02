import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [linkHubsCount, totalLinks, totalClicks, recentActivity] =
      await Promise.all([
        prisma.linkHub.count({
          where: { userId: user.id },
        }),

        prisma.link.count({
          where: {
            linkHub: {
              userId: user.id,
            },
          },
        }),

        prisma.link.aggregate({
          where: {
            linkHub: {
              userId: user.id,
            },
          },
          _sum: {
            clicks: true,
          },
        }),

        prisma.analytics.count({
          where: {
            userId: user.id,
            clickedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
      ]);

    const linkHubStats = await prisma.linkHub.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        slug: true,
        isPersonal: true,
        _count: {
          select: {
            links: true,
          },
        },
        links: {
          select: {
            clicks: true,
          },
        },
      },
    });

    const linkHubsWithStats = linkHubStats.map((hub) => ({
      ...hub,
      totalClicks: hub.links.reduce((sum, link) => sum + link.clicks, 0),
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      stats: {
        linkHubsCount,
        totalLinks,
        totalClicks: totalClicks._sum.clicks || 0,
        recentActivity,
        linkHubs: linkHubsWithStats,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
