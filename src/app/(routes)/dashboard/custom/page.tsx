"use client";

import { useState, useEffect } from "react";
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

export default function CustomLinkHubsPage() {
  const [customLinkHubs, setCustomLinkHubs] = useState<LinkHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomLinkHubs();
  }, []);

  const fetchCustomLinkHubs = async () => {
    try {
      const response = await fetch("/api/linkhubs/custom");
      if (response.ok) {
        const data = await response.json();
        setCustomLinkHubs(data);
      }
    } catch (error) {
      console.error("Failed to fetch custom LinkHubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchCustomLinkHubs();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold ">Custom LinkHubs</h1>
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

      {customLinkHubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customLinkHubs.map((linkHub) => (
            <CustomLinkHubCard
              key={linkHub.id}
              linkHub={linkHub}
              onUpdate={fetchCustomLinkHubs}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <h3 className="text-lg font-medium  mb-2">No Custom LinkHubs Yet</h3>
          <p className="text-gray-600 mb-6">
            Create specialized LinkHubs for different topics, projects, or
            audiences
          </p>
        </div>
      )}
    </div>
  );
}
