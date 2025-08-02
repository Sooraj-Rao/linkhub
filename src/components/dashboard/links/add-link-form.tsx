"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddLinkFormProps {
  linkHubId: string;
  onSuccess: () => void;
}

const linkTypes = [
  { value: "website", label: "Website", icon: "🌐" },
  { value: "social", label: "Social Media", icon: "📱" },
  { value: "video", label: "Video", icon: "🎥" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "store", label: "Store", icon: "🛍️" },
  { value: "other", label: "Other", icon: "🔗" },
];

export default function AddLinkForm({
  linkHubId,
  onSuccess,
}: AddLinkFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    type: "",
    icon: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/linkhubs/${linkHubId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Your new link has been added to your LinkHub.");
        onSuccess();
        setFormData({
          title: "",
          url: "",
          description: "",
          type: "",
          icon: "",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to add link");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="My awesome website"
          required
        />
      </div>

      <div>
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of your link"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select link type" />
          </SelectTrigger>
          <SelectContent>
            {linkTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center">
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="icon">Icon URL (Optional)</Label>
        <Input
          id="icon"
          type="url"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="https://example.com/icon.png"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Link"}
        </Button>
      </div>
    </form>
  );
}
