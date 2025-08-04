"use client";

import { useState } from "react";
import {
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { LinkHub } from "@/lib/types";

interface CustomLinkHubCardProps {
  linkHub: LinkHub & { _count?: { links: number } };
  onUpdate: () => void;
}

export default function CustomLinkHubCard({
  linkHub,
  onUpdate,
}: CustomLinkHubCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/linkhubs/${linkHub.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("LinkHub deleted successfully");
        onUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete LinkHub");
      }
    } catch (error) {
      console.error("Failed to delete LinkHub:", error);
      toast.error("Failed to delete LinkHub");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleStatus = async () => {
    try {
      const response = await fetch(`/api/linkhubs/${linkHub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !linkHub.isActive }),
      });

      if (response.ok) {
        toast.success(
          `LinkHub ${!linkHub.isActive ? "activated" : "deactivated"}`
        );
        onUpdate();
      } else {
        toast.error("Failed to update LinkHub status");
      }
    } catch (error) {
      console.error("Failed to update LinkHub status:", error);
      toast.error("Failed to update LinkHub status");
    }
  };

  const linkCount = linkHub._count?.links || 0;

  return (
    <Card className=" bg-muted/20 dark:border-muted/40 border-muted   shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {linkHub.avatar && (
              <img
                src={linkHub.avatar || "/placeholder.svg"}
                alt={linkHub.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold  truncate">{linkHub.name}</h3>
              <a
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${linkHub.slug}`}
              >
                <code className="text-xs cursor-pointer text-primary hover:underline ">
                  {process.env.NEXT_PUBLIC_APP_URL}/{linkHub.slug}
                </code>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center  space-x-2">
            <Badge
              variant={linkHub.isActive ? "default" : "secondary"}
              className="text-xs  "
            >
              {linkHub.isActive ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleStatus}>
                  {linkHub.isActive ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`/${linkHub.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </a>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete LinkHub</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {linkHub.name}? This
                        will permanently delete the LinkHub and all its links.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {linkHub.bio && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {linkHub.bio}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>
              {linkCount} {linkCount === 1 ? "link" : "links"}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => router.push(`/dashboard/links/${linkHub.id}`)}
          >
            <Settings className="w-4 h-4 mr-1" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
