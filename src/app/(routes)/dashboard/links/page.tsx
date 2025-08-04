"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import LinkHubManager from "@/components/dashboard/linkhub-manager";
import PublicProfile from "@/components/public/public-profile";
import { LinkHub } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LinkhubSkeleton } from "@/components/dashboard/links/link-skeleton";

export default function PersonalLinksPage() {
  const { user } = useAuth();
  const [personalLinkHub, setPersonalLinkHub] = useState<LinkHub | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPersonalLinkHub();
    }
  }, [user]);

  const fetchPersonalLinkHub = async () => {
    try {
      const response = await fetch("/api/linkhubs/personal");
      if (response.ok) {
        const data = await response.json();
        setPersonalLinkHub(data);
      }
      console.log("data fetched");
    } catch (error) {
      console.error("Failed to fetch personal LinkHub:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinkhubSkeleton />;
  }

  return (
    <div className="space-y-8 md:p-5">
      <div>
        <h1 className="text-xl font-bold">Personal LinkHub</h1>
      </div>

      {personalLinkHub ? (
        <div className="flex flex-col 2xl:flex-row justify-center xl:justify-normal gap-8">
          <div className=" xl:w-[65%] ">
            <LinkHubManager
              onupdate={fetchPersonalLinkHub}
              linkHub={personalLinkHub}
              isPersonal={true}
            />
          </div>
          <div className="xl:fixed lg:top-2 max-h-[calc(100vh-20px)] lg:right-8 xl:w-[25%]  rounded-md overflow-scroll hideScrollBar">
            <PublicProfile linkHub={personalLinkHub} />
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <h3 className="text-lg font-medium mb-2">
            Create Your Personal LinkHub
          </h3>
          <p className="mb-4">
            Get started by creating your main LinkHub profile
          </p>
          <Button onClick={fetchPersonalLinkHub}>
            Create Personal LinkHub
          </Button>
        </div>
      )}
    </div>
  );
}
