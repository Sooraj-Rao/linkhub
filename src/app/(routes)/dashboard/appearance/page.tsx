"use client";

import { useState, useEffect } from "react";
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

export default function AppearancePage() {
  const [linkHubs, setLinkHubs] = useState<LinkHub[]>([]);
  const [selectedLinkHub, setSelectedLinkHub] = useState<LinkHub | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkHubs();
  }, []);

  const fetchLinkHubs = async () => {
    try {
      const response = await fetch("/api/linkhubs");
      if (response.ok) {
        const data = await response.json();
        setLinkHubs(data);
        if (data.length > 0) {
          await fetchLinkHubDetails(data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch LinkHubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkHubDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/linkhubs/${id}/appearance`);
      if (response.ok) {
        const detailedData = await response.json();
        setSelectedLinkHub(detailedData);
      }
    } catch (error) {
      console.error("Failed to fetch LinkHub details:", error);
    }
  };

  const handleLinkHubChange = async (value: string) => {
    const linkHub = linkHubs.find((lh) => lh.id === value);
    if (linkHub) {
      setSelectedLinkHub(null);
      await fetchLinkHubDetails(linkHub.id);
    }
  };

  const handleLinkHubUpdate = (updatedLinkHub: LinkHub) => {
    setSelectedLinkHub(updatedLinkHub);
    setLinkHubs(
      linkHubs.map((lh) => (lh.id === updatedLinkHub.id ? updatedLinkHub : lh))
    );
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="glass rounded-2xl ">
          <Skeleton className="h-4  rounded-2xl   w-48 mb-4" />
          <Skeleton className="h-10 w-full max-w-md  rounded-2xl   " />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 col-span-2">
            <Skeleton className="h-64 w-full rounded-2xl " />
            <Skeleton className="h-96 w-full rounded-2xl " />
          </div>
          <Skeleton className="h-[600px] w-full rounded-2xl " />
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
        <h2 className="text-lg font-semibold  mb-4">
          Select LinkHub to Customize
        </h2>
        <Select
          value={selectedLinkHub?.id || ""}
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
                    <span className=" text-primary">(Personal)</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLinkHub ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className=" col-span-2 ">
            <AppearanceCustomizer
              linkHub={selectedLinkHub}
              onUpdate={handleLinkHubUpdate}
            />
          </div>
          <div className="lg:fixed lg:top-2 max-h-[calc(100vh-20px)] lg:right-8 w-[25%]  rounded-md overflow-scroll hideScrollBar">
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
