"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CreateCustomLinkHubFormProps {
  onSuccess: () => void;
}

export default function CreateCustomLinkHubForm({
  onSuccess,
}: CreateCustomLinkHubFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    bio: "",
    theme: "default",
  });
  const [loading, setLoading] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/linkhubs/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Custom LinkHub created successfully!");
        onSuccess();
        setFormData({ name: "", slug: "", bio: "", theme: "default" });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create LinkHub");
      }
    } catch (error) {
      console.error("Failed to create LinkHub:", error);
      toast.error("Failed to create LinkHub");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="My Tech Blog"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug *</Label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">linkhub.io/</span>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                slug: generateSlug(e.target.value),
              }))
            }
            placeholder="my-tech-blog"
            required
          />
        </div>
        <p className="text-xs text-gray-500">
          Only lowercase letters, numbers, and hyphens allowed
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Description</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
          placeholder="A brief description of this LinkHub"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creating..." : "Create LinkHub"}
        </Button>
      </div>
    </form>
  );
}
