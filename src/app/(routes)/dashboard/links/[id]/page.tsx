"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkHubManager from "@/components/dashboard/linkhub-manager";
import type { LinkHub } from "@/lib/types";
import { toast } from "sonner";
import PublicProfile from "@/components/public/public-profile";
import { LinkhubSkeleton } from "@/components/dashboard/links/link-skeleton";

export default function LinkHubLinksPage() {
  const params = useParams();
  const router = useRouter();
  const [linkHub, setLinkHub] = useState<LinkHub | null>(null);
  const [loading, setLoading] = useState(true);

  const linkHubId = params.id as string;

  useEffect(() => {
    if (linkHubId) {
      fetchLinkHub();
    }
  }, [linkHubId]);

  const fetchLinkHub = async () => {
    try {
      const response = await fetch(`/api/linkhubs/${linkHubId}`);
      if (response.ok) {
        const data = await response.json();
        setLinkHub(data);
      } else {
        toast.error("LinkHub not found");
        router.push("/dashboard/custom");
      }
    } catch (error) {
      console.error("Failed to fetch LinkHub:", error);
      toast.error("Failed to load LinkHub");
      router.push("/dashboard/custom");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinkhubSkeleton />;
  }

  if (!linkHub) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          LinkHub not found
        </h2>
        <p className="text-gray-600 mb-4">
          The LinkHub youre looking for doesnt exist or you dont have access to
          it.
        </p>
        <Button onClick={() => router.push("/dashboard/custom")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Custom LinkHubs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:p-5">
      <div className="flex items-center gap-4 mt-6 sm:mt-0">
        <div>
          <h1 className="text-2xl font-bold ">{linkHub.name} - Links</h1>
        </div>
      </div>

      <div className="flex flex-col 2xl:flex-row justify-center xl:justify-normal gap-8">
        <div className=" xl:w-[65%] ">
          <LinkHubManager
            onupdate={fetchLinkHub}
            linkHub={linkHub}
            isPersonal={linkHub.isPersonal}
          />
        </div>
        <div className="xl:fixed lg:top-2 max-h-[calc(100vh-20px)] lg:right-8 xl:w-[25%]  rounded-md overflow-scroll hideScrollBar">
          <PublicProfile linkHub={linkHub} />
        </div>
      </div>
    </div>
  );
}
