"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import type { Link } from "@/lib/types";

interface EditLinkFormProps {
  link: Link;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditLinkForm({
  link,
  onSuccess,
  onCancel,
}: EditLinkFormProps) {
  const [formData, setFormData] = useState({
    title: link.title,
    url: link.url,
    description: link.description || "",
    icon: link.icon || "",
    type: link.type,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (formData.title.length > 20) {
      toast.error("Title is too long.(max 20 char)");
      return;
    }
    if (formData.description.length > 35) {
      toast.error("Description is too long.(max 35 char)");
      return;
    }
        setLoading(true);
    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Link updated successfully!");
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update link");
      }
    } catch (error) {
      console.error("Failed to update link:", error);
      toast.error("Failed to update link");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter link title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => handleInputChange("url", e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon URL</Label>
        <Input
          id="icon"
          type="url"
          value={formData.icon}
          onChange={(e) => handleInputChange("icon", e.target.value)}
          placeholder="https://example.com/icon.png"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Updating..." : "Update Link"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
