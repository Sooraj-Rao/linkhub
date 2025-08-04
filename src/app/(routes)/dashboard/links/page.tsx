"use client";

import { useAuth } from "@/components/providers/auth-provider";
import LinkHubManager from "@/components/dashboard/linkhub-manager";
import PublicProfile from "@/components/public/public-profile";
import { LinkHub } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LinkhubSkeleton } from "@/components/dashboard/links/link-skeleton";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch personal LinkHub");
  }
  return response.json();
};

export default function PersonalLinksPage() {
  const { user } = useAuth();
  const {
    data: personalLinkHub,
    error,
    isLoading,
    mutate,
  } = useSWR<LinkHub>(user ? "/api/linkhubs/personal" : null, fetcher);

  const handleUpdate = async () => {
    await mutate(); // Trigger revalidation of the data
  };

  if (isLoading) {
    return <LinkhubSkeleton />;
  }

  if (error) {
    console.error("Failed to fetch personal LinkHub:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Personal LinkHub</h1>
      </div>

      {personalLinkHub ? (
        <div className="flex flex-col 2xl:flex-row justify-center xl:justify-normal gap-8">
          <div className=" xl:w-[65%] ">
            <LinkHubManager
              onupdate={handleUpdate}
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
          <Button onClick={handleUpdate}>Create Personal LinkHub</Button>
        </div>
      )}
    </div>
  );
}
