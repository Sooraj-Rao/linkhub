"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkHubManager from "@/components/dashboard/linkhub-manager";
import type { LinkHub } from "@/lib/types";
import { toast } from "sonner";
import PublicProfile from "@/components/public/public-profile";
import { LinkhubSkeleton } from "@/components/dashboard/links/link-skeleton";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("LinkHub not found");
  }
  return response.json();
};

export default function LinkHubLinksPage() {
  const params = useParams();
  const router = useRouter();
  const linkHubId = params.id as string;

  const {
    data: linkHub,
    error,
    isLoading,
    mutate,
  } = useSWR<LinkHub>(linkHubId ? `/api/linkhubs/${linkHubId}` : null, fetcher);

  const handleUpdate = async () => {
    await mutate(); // Trigger revalidation of the data
  };

  if (isLoading) {
    return <LinkhubSkeleton />;
  }

  if (error || !linkHub) {
    if (error) {
      console.error("Failed to fetch LinkHub:", error);
      toast.error("Failed to load LinkHub");
    }
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          LinkHub not found
        </h2>
        <p className="text-gray-600 mb-4">
          The LinkHub you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <Button onClick={() => router.push("/dashboard/custom")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Custom LinkHubs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(
              linkHub.isPersonal ? "/dashboard/links" : "/dashboard/custom"
            )
          }
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold ">{linkHub.name} - Links</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className=" col-span-2 ">
          <LinkHubManager
            onupdate={handleUpdate}
            linkHub={linkHub}
            isPersonal={linkHub.isPersonal}
          />
        </div>
        <div className="lg:sticky lg:top-8 rounded-md  overflow-hidden">
          <PublicProfile linkHub={linkHub} />
        </div>
      </div>
    </div>
  );
}
