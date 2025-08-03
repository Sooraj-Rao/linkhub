"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import LinkHubManager from "@/components/dashboard/linkhub-manager";
import PublicProfile from "@/components/public/public-profile";
import { LinkHub } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-8 w-1/3  rounded "></Skeleton>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6s space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12  rounded-full "></Skeleton>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40  rounded "></Skeleton>
                    <Skeleton className="h-4 w-60  rounded "></Skeleton>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-24  rounded "></Skeleton>
                  <Skeleton className="h-8 w-24  rounded "></Skeleton>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl pt-16 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32  rounded "></Skeleton>
                <Skeleton className="h-8 w-24  rounded "></Skeleton>
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="flex items-center h-20 p-4 "
                  >
                  </Skeleton>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 rounded-md overflow-hidden">
            <div className="glass rounded-2xl p-6 space-y-4">
              <Skeleton className="w-full h-32  rounded "></Skeleton>
              <Skeleton className="h-6 w-40 mx-auto  rounded "></Skeleton>
              <Skeleton className="h-4 w-64 mx-auto  rounded "></Skeleton>
              <div className="space-y-2">
                {[...Array(2)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-10 w-full  rounded "
                  ></Skeleton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Personal LinkHub</h1>
      </div>

      {personalLinkHub ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <LinkHubManager
              onupdate={fetchPersonalLinkHub}
              linkHub={personalLinkHub}
              isPersonal={true}
            />
          </div>
          <div className="lg:fixed lg:top-2 max-h-[calc(100vh-20px)] lg:right-8 w-[25%]  rounded-md overflow-scroll hideScrollBar">
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
          <button onClick={fetchPersonalLinkHub}>
            Create Personal LinkHub
          </button>
        </div>
      )}
    </div>
  );
}
