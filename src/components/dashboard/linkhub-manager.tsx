/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import type { LinkHub, Link } from "@/lib/types";
import AddLinkForm from "./links/add-link-form";
import EditLinkForm from "./links/edit-link-form";
import EditLinkHubForm from "./edit-linkhub-form";

interface LinkHubManagerProps {
  linkHub: LinkHub;
  isPersonal?: boolean;
  onupdate?: () => void;
}

export default function LinkHubManager({
  linkHub: initialLinkHub,
  isPersonal = false,
  onupdate,
}: LinkHubManagerProps) {
  const [linkHub, setLinkHub] = useState<LinkHub>(initialLinkHub);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editingLinkHub, setEditingLinkHub] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, [linkHub.id]);

  const fetchLinks = async () => {
    try {
      const response = await fetch(`/api/linkhubs/${linkHub.id}/links`);
      if (response.ok) {
        if (onupdate) onupdate();
        const data = await response.json();
        setLinks(data);
      } else {
        toast.error("Failed to fetch links");
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
      toast.error("Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };

  const refreshLinkHub = async () => {
    try {
      const response = await fetch(`/api/linkhubs/${linkHub.id}`);
      if (response.ok) {
        const data = await response.json();
        setLinkHub(data);
        if (onupdate) onupdate();
      }
    } catch (error) {
      console.error("Failed to refresh LinkHub:", error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLinks(items);

    try {
      const response = await fetch(
        `/api/linkhubs/${linkHub.id}/links/reorder`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            links: items.map((link, index) => ({ id: link.id, order: index })),
          }),
        }
      );

      if (!response.ok) {
        fetchLinks();
        toast.error("Failed to update link order");
      } else {
        if (onupdate) {
          onupdate();
        }
        toast.success("Link order updated!");
      }
    } catch (error) {
      console.error("Failed to update link order:", error);
      fetchLinks();
      toast.error("Failed to update link order");
    }
  };

  const toggleLinkStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setLinks(
          links.map((link) => (link.id === id ? { ...link, isActive } : link))
        );
        if (onupdate) onupdate();
        toast.success(`Link ${isActive ? "enabled" : "disabled"}`);
      } else {
        toast.error("Failed to update link status");
      }
    } catch (error) {
      console.error("Failed to update link status:", error);
      toast.error("Failed to update link status");
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, { method: "DELETE" });

      if (response.ok) {
        setLinks(links.filter((link) => link.id !== id));
        if (onupdate) onupdate();
        toast.success("Link deleted successfully");
      } else {
        toast.error("Failed to delete link");
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
      toast.error("Failed to delete link");
    }
  };

  const handleLinkAdded = () => {
    setIsAddingLink(false);
    fetchLinks();
  };

  const handleLinkEdited = () => {
    setEditingLink(null);
    fetchLinks();
  };

  const handleLinkHubEdited = () => {
    setEditingLinkHub(false);
    refreshLinkHub();
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {linkHub.avatar && (
              <img
                src={linkHub.avatar || "/placeholder.svg"}
                alt={linkHub.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold ">{linkHub.name}</h2>
              {/* {linkHub.bio && <p className="">{linkHub.bio}</p>} */}
              <div className=" flex gap-4 items-center">
                <a href={`${process.env.NEXT_PUBLIC_APP_URL}/${linkHub.slug}`}>
                  <code className="text-sm text-primary hover:underline font-medium">
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : "linkhub.io"}
                    /{linkHub.slug}
                  </code>
                </a>
                <Button
                  variant="outline"
                  size="icon"
                  className=" scale-90"
                  onClick={() => {
                    window.navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_APP_URL}/${linkHub.slug}`
                    );
                    toast.success("Link copied!");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingLinkHub(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit LinkHub
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/${linkHub.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold ">Links ({links.length})</h3>
          <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
              </DialogHeader>
              <AddLinkForm linkHubId={linkHub.id} onSuccess={handleLinkAdded} />
            </DialogContent>
          </Dialog>
        </div>

        {links.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="links">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {links.map((link, index) => (
                    <Draggable
                      key={link.id}
                      draggableId={link.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center group p-4 rounded-lg border transition-all ${
                            link.isActive ? " " : " opacity-60"
                          } ${
                            snapshot.isDragging ? "shadow-lg scale-105" : ""
                          }`}
                        >
                          <div {...provided.dragHandleProps} className="mr-3">
                            <GripVertical className="w-4 h-4 -400 cursor-grab" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-start space-x-2 mb-1">
                              {link.icon && (
                                <img
                                  src={link.icon || "/placeholder.svg"}
                                  alt={linkHub.name}
                                  className="w-10 h-10  rounded-full    object-cover"
                                />
                              )}
                              <h4 className="font-medium  truncate">
                                {link.title}
                              </h4>
                              {link.isActive ? (
                                <Eye className="w-4 h-4 text-green-500" />
                              ) : (
                                <EyeOff className="w-4 h-4 " />
                              )}
                            </div>
                            <a href={link.url} target="_blank">
                              <p className="text-sm text-primary hover:underline cursor-pointer  truncate mb-1">
                                {link.url}
                              </p>
                            </a>
                            {link.description && (
                              <p className="text-xs  truncate">
                                {link.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs flex items-center">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                {link.clicks} clicks
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={link.isActive}
                              onCheckedChange={(checked) =>
                                toggleLinkStatus(link.id, checked)
                              }
                            />

                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingLink(link)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
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
                                      <AlertDialogTitle>
                                        Delete Link
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete
                                        {link.title}? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteLink(link.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16  bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 " />
            </div>
            <h4 className="text-lg font-medium  mb-2">No links yet</h4>
            <p className="text-gray-500 mb-4">
              Start building your {isPersonal ? "personal" : "custom"} LinkHub
              by adding your first link.
            </p>
          </div>
        )}
      </div>

      <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          {editingLink && (
            <EditLinkForm
              link={editingLink}
              onSuccess={handleLinkEdited}
              onCancel={() => setEditingLink(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editingLinkHub} onOpenChange={setEditingLinkHub}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit LinkHub</DialogTitle>
          </DialogHeader>
          <EditLinkHubForm
            linkHub={linkHub}
            onSuccess={handleLinkHubEdited}
            onCancel={() => setEditingLinkHub(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
