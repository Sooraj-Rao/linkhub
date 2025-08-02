"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkHubManager from "@/components/dashboard/linkhub-manager";
import type { LinkHub } from "@/lib/types";
import { toast } from "sonner";
import PublicProfile from "@/components/public/public-profile";

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
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="glass rounded-2xl p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!linkHub) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          LinkHub not found
        </h2>
        <p className="text-gray-600 mb-4">
          The LinkHub youre looking for doesnt exist or you dont have access
          to it.
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
            onupdate={fetchLinkHub}
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
