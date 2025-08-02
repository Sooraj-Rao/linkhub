import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicProfile from "@/components/public/public-profile";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const linkHub = await prisma.linkHub.findUnique({
    where: { slug, isActive: true },
    include: { user: true },
  });

  if (!linkHub) {
    return {
      title: "LinkHub Not Found",
    };
  }

  return {
    title: `${linkHub.name} - LinkHub`,
    description: linkHub.bio || `Check out ${linkHub.name}'s links on LinkHub`,
    openGraph: {
      title: `${linkHub.name} - LinkHub`,
      description:
        linkHub.bio || `Check out ${linkHub.name}'s links on LinkHub`,
      images: linkHub.avatar ? [linkHub.avatar] : [],
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;

  const linkHub = await prisma.linkHub.findUnique({
    where: { slug, isActive: true },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!linkHub) {
    notFound();
  }

  return <PublicProfile linkHub={linkHub} />;
}
