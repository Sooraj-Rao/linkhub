"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomLinkHubCard from "@/components/dashboard/custom-linkhub-card";
import CreateCustomLinkHubForm from "@/components/dashboard/create-custom-linkhub-form";
import type { LinkHub } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch custom LinkHubs");
  }
  return response.json();
};

export default function CustomLinkHubsPage() {
  const {
    data: customLinkHubs,
    error,
    isLoading,
    mutate,
  } = useSWR<LinkHub[]>("/api/linkhubs/custom", fetcher);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuccess = async () => {
    setIsCreateModalOpen(false);
    await mutate(); 
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3 rounded"></Skeleton>
          <Skeleton className="h-8 w-36 rounded"></Skeleton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              className="glass rounded-2xl p-6 h-40 border-muted/80 shadow-lg"
            ></Skeleton>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <h3 className="text-lg font-medium mb-2">
          Error Loading Custom LinkHubs
        </h3>
        <p className="text-gray-600 mb-6">
          Failed to load custom LinkHubs. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Custom LinkHubs</h1>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Custom LinkHub
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom LinkHub</DialogTitle>
            </DialogHeader>
            <CreateCustomLinkHubForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {customLinkHubs && customLinkHubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customLinkHubs.map((linkHub) => (
            <CustomLinkHubCard
              key={linkHub.id}
              linkHub={linkHub}
              onUpdate={mutate}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <h3 className="text-lg font-medium mb-2">No Custom LinkHubs Yet</h3>
          <p className="text-gray-600 mb-6">
            Create specialized LinkHubs for different topics, projects, or
            audiences
          </p>
        </div>
      )}
    </div>
  );
}
