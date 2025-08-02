"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";
import type { LinkHub } from "@/lib/types";

interface EditLinkHubFormProps {
  linkHub: LinkHub;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditLinkHubForm({
  linkHub,
  onSuccess,
  onCancel,
}: EditLinkHubFormProps) {
  const [formData, setFormData] = useState({
    name: linkHub.name,
    bio: linkHub.bio || "",
    slug: linkHub.slug,
  });
  const [loading, setLoading] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "slug") {
      setSlugAvailable(null);
    }
  };

  const checkSlugAvailability = async () => {
    if (!formData.slug || formData.slug === linkHub.slug) {
      setSlugAvailable(null);
      return;
    }

    if (formData.slug.length < 3) {
      setSlugAvailable(false);
      return;
    }

    setSlugChecking(true);
    try {
      const response = await fetch(
        `/api/linkhubs/check-slug?slug=${encodeURIComponent(formData.slug)}`
      );
      const data = await response.json();
      setSlugAvailable(data.available);
    } catch (error) {
      console.error("Failed to check slug:", error);
      setSlugAvailable(false);
    } finally {
      setSlugChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/linkhubs/${linkHub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update LinkHub");
      }

      if (formData.slug !== linkHub.slug) {
        const slugResponse = await fetch(`/api/linkhubs/${linkHub.id}/slug`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: formData.slug }),
        });

        if (!slugResponse.ok) {
          const errorData = await slugResponse.json();
          throw new Error(errorData.error || "Failed to update URL");
        }
      }

      toast.success("LinkHub updated successfully!");
      onSuccess();
    } catch (error) {
      console.error("Failed to update LinkHub:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update LinkHub"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSlugFromName = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    setFormData((prev) => ({ ...prev, slug }));
    setSlugAvailable(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">LinkHub Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="My Awesome LinkHub"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (Optional)</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Tell people about this LinkHub..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="slug">LinkHub URL</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={generateSlugFromName}
            className="text-xs"
          >
            Generate from name
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {process.env.NEXT_PUBLIC_APP_URL}/
          </span>
          <div className="flex-1 relative">
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              onBlur={checkSlugAvailability}
              placeholder="my-linkhub"
              pattern="[a-zA-Z0-9_-]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
              required
              className="pr-8"
            />
            {slugChecking && (
              <Loader2 className="absolute right-2 top-3  w-4 h-4 animate-spin text-gray-400" />
            )}
            {!slugChecking && slugAvailable === true && (
              <Check className="absolute right-2 top-3  w-4 h-4 text-green-500" />
            )}
            {!slugChecking && slugAvailable === false && (
              <X className="absolute right-2 top-3  w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
        {slugAvailable === false && (
          <p className="text-sm text-red-600">
            This URL is already taken or invalid
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            loading ||
            (formData.slug !== linkHub.slug && slugAvailable !== true)
          }
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update LinkHub"
          )}
        </Button>
      </div>
    </form>
  );
}
