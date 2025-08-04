"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppearanceCustomizer from "@/components/dashboard/appearance-customizer";
import type { LinkHub } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import PublicProfile from "@/components/public/public-profile";
import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch LinkHubs");
  }
  return response.json();
};

export default function AppearancePage() {
  const {
    data: linkHubs,
    error,
    isLoading,
  } = useSWR<LinkHub[]>("/api/linkhubs", fetcher);
  const [selectedLinkHubId, setSelectedLinkHubId] = useState<string | null>(
    null
  );

  if (linkHubs && linkHubs.length > 0 && !selectedLinkHubId) {
    setSelectedLinkHubId(linkHubs[0].id);
  }

  const selectedLinkHub =
    linkHubs?.find((lh) => lh.id === selectedLinkHubId) || null;

  const handleLinkHubChange = (value: string) => {
    setSelectedLinkHubId(value);
  };

  const handleLinkHubUpdate = async (updatedLinkHub: LinkHub) => {
    await mutate(
      "/api/linkhubs",
      (current: LinkHub[] | undefined) =>
        current?.map((lh) =>
          lh.id === updatedLinkHub.id ? updatedLinkHub : lh
        ),
      { revalidate: false }
    );
    setSelectedLinkHubId(updatedLinkHub.id);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="glass rounded-2xl">
          <Skeleton className="h-4 rounded-2xl w-48 mb-4" />
          <Skeleton className="h-10 w-full max-w-md rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 col-span-2">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !linkHubs) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-bold">Appearance</h1>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-gray-500">Failed to load LinkHubs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Appearance</h1>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Select LinkHub to Customize
        </h2>
        <Select
          value={selectedLinkHubId || ""}
          onValueChange={handleLinkHubChange}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Choose a LinkHub to customize" />
          </SelectTrigger>
          <SelectContent>
            {linkHubs.map((linkHub) => (
              <SelectItem key={linkHub.id} value={linkHub.id}>
                <div className="flex items-center space-x-2">
                  {linkHub.avatar && (
                    <img
                      src={linkHub.avatar || "/placeholder.svg"}
                      alt=""
                      className="w-4 h-4 rounded-full"
                    />
                  )}
                  <span>{linkHub.name}</span>
                  {linkHub.isPersonal && (
                    <span className="text-primary">(Personal)</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLinkHub ? (
        <div className="flex flex-col 2xl:flex-row justify-center xl:justify-normal gap-8">
          <div className="xl:w-[65%]">
            <AppearanceCustomizer
              linkHub={selectedLinkHub}
              onUpdate={handleLinkHubUpdate}
            />
          </div>
          <div className="xl:fixed lg:top-2 max-h-[calc(100vh-20px)] lg:right-8 xl:w-[25%] rounded-md overflow-scroll hideScrollBar">
            <PublicProfile linkHub={selectedLinkHub} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[800px] w-full rounded-2xl" />
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      )}
    </div>
  );
}
