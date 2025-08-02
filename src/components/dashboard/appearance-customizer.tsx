"use client";

import type React from "react";
import { useState } from "react";
import { Palette, User, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LinkHub } from "@/lib/types";
import { toast } from "sonner";

interface AppearanceCustomizerProps {
  linkHub: LinkHub;
  onUpdate: (linkHub: LinkHub) => void;
}

const gradientPresets = [
  {
    name: "Purple Dream",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Ocean Blue",
    value: "linear-gradient(135deg, #667db6 0%, #0082c8 100%)",
  },
  {
    name: "Sunset",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    name: "Forest",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  { name: "Fire", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { name: "Night", value: "linear-gradient(135deg, #434343 0%, #000000 100%)" },
];

const buttonStyles = [
  { id: "10px", name: "Rounded", preview: "rounded-lg" },
  { id: "0px", name: "Square", preview: "rounded-none" },
  { id: "999px", name: "Pill", preview: "rounded-full" },
];

export default function AppearanceCustomizer({
  linkHub,
  onUpdate,
}: AppearanceCustomizerProps) {
  const [formData, setFormData] = useState({
    name: linkHub.name || "",
    bio: linkHub.bio || "",
    avatar: linkHub.avatar || "",
    theme: linkHub.theme || "modern",
    backgroundType: linkHub.backgroundType || "solid",
    backgroundColor: linkHub.backgroundColor || "#ffffff",
    backgroundGradient: linkHub.backgroundGradient || gradientPresets[0].value,
    backgroundImage: linkHub.backgroundImage || "",
    textColor: linkHub.textColor || "#1f2937",
    buttonStyle: linkHub.buttonStyle || "rounded",
    buttonColor: linkHub.buttonColor || "#8b5cf6",
    buttonTextColor: linkHub.buttonTextColor || "#ffffff",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/linkhubs/${linkHub.id}/appearance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedLinkHub = await response.json();
        onUpdate(updatedLinkHub);
        toast.success("Your LinkHub appearance has been saved.");
      } else {
        throw new Error("Failed to update appearance");
      }
    } catch {
      toast.error("Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold ">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name or brand"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell people about yourself..."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="avatar">Avatar URL</Label>
            <div className="flex space-x-2">
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
                placeholder="https://example.com/avatar.jpg"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold ">Design & Colors</h2>
        </div>

        <Tabs defaultValue="background" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="space-y-6 mt-6">
            <div>
              <Label className="text-sm font-medium  mb-3 block">
                Background Type
              </Label>
              <RadioGroup
                value={formData.backgroundType}
                onValueChange={(value) =>
                  setFormData({ ...formData, backgroundType: value })
                }
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <RadioGroupItem
                      value="solid"
                      id="solid"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="solid"
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.backgroundType === "solid"
                          ? " bg-muted/40 border-primary"
                          : " border-transparent "
                      }`}
                    >
                      <div className="w-full h-12 rounded-lg mb-2 bg-blue-500" />
                      <div className="text-sm font-medium text-center">
                        Solid Color
                      </div>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem
                      value="gradient"
                      id="gradient"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="gradient"
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.backgroundType === "gradient"
                          ? " bg-muted/40 border-primary"
                          : " border-transparent "
                      }`}
                    >
                      <div className="w-full h-12 rounded-lg mb-2 bg-gradient-to-r from-purple-400 to-pink-400" />
                      <div className="text-sm font-medium text-center">
                        Gradient
                      </div>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem
                      value="image"
                      id="image"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="image"
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.backgroundType === "image"
                          ? " bg-muted/40 border-primary"
                          : " border-transparent "
                      }`}
                    >
                      <div className="w-full h-12 rounded-lg mb-2 bg-gray-300 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-sm font-medium text-center">
                        Image
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {formData.backgroundType === "solid" && (
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.backgroundColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backgroundColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {formData.backgroundType === "gradient" && (
              <div className="space-y-4">
                <Label className="text-sm font-medium  block">
                  Gradient Presets
                </Label>
                <div className="grid grid-cols-6 gap-3">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          backgroundGradient: preset.value,
                        })
                      }
                      className={`w-full h-16 rounded-lg  text-sm text-white border-2  transition-all ${
                        formData.backgroundGradient === preset.value
                          ? " bg-primray border-primary border-b-6   "
                          : " border-transparent opacity-70 "
                      }`}
                      style={{ background: preset.value }}
                    >
                      {formData.backgroundGradient === preset.value &&
                        preset.name}
                    </button>
                  ))}
                </div>
                <div>
                  <Label htmlFor="customGradient">Custom Gradient CSS</Label>
                  <Input
                    id="customGradient"
                    value={formData.backgroundGradient}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backgroundGradient: e.target.value,
                      })
                    }
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  />
                </div>
              </div>
            )}

            {formData.backgroundType === "image" && (
              <div>
                <Label htmlFor="backgroundImage">Background Image URL</Label>
                <Input
                  id="backgroundImage"
                  value={formData.backgroundImage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      backgroundImage: e.target.value,
                    })
                  }
                  placeholder="https://example.com/background.jpg"
                />
              </div>
            )}

            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="textColor"
                  type="color"
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  placeholder="#1f2937"
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-6 mt-6">
            <div>
              <Label className="text-sm font-medium  mb-3 block">
                Button Style
              </Label>
              <RadioGroup
                value={formData.buttonStyle}
                onValueChange={(value) =>
                  setFormData({ ...formData, buttonStyle: value })
                }
              >
                <div className="grid grid-cols-3 gap-3">
                  {buttonStyles.map((style) => (
                    <div key={style.id} className="relative">
                      <RadioGroupItem
                        value={style.id}
                        id={style.id}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={style.id}
                        className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.buttonStyle === style.id
                            ? " bg-muted/40 border-primary"
                            : " border-transparent "
                        }`}
                      >
                        <div
                          className={`w-full h-8 bg-purple-500 mb-2 ${style.preview}`}
                        />
                        <div className="text-xs font-medium text-center">
                          {style.name}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonColor">Button Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="buttonColor"
                    type="color"
                    value={formData.buttonColor}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonColor: e.target.value })
                    }
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.buttonColor}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonColor: e.target.value })
                    }
                    placeholder="#8b5cf6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="buttonTextColor">Button Text Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="buttonTextColor"
                    type="color"
                    value={formData.buttonTextColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        buttonTextColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.buttonTextColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        buttonTextColor: e.target.value,
                      })
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Appearance"}
      </Button>
    </div>
  );
}
