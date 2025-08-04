"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkHub } from "@/lib/types";

export default function PublicProfile({
  linkHub,
  track = true,
}: {
  linkHub: LinkHub;
  track?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick = async (linkId: string) => {
    if (!track) return;
    await fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId }),
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${linkHub.name} - LinkHub`,
          text: linkHub.bio || `Check out ${linkHub.name}'s links`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!mounted) {
    return null;
  }

  const getBackgroundStyle = () => {
    const {
      backgroundType,
      backgroundColor,
      backgroundGradient,
      backgroundImage,
    } = linkHub;

    switch (backgroundType) {
      case "gradient":
        return {
          background:
            backgroundGradient ||
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        };
      case "image":
        return {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      default:
        return { backgroundColor: backgroundColor || "#ffffff" };
    }
  };
  const getButtonStyle = () => {
    const { buttonColor, buttonTextColor, buttonStyle } = linkHub;
    const style: React.CSSProperties = {
      backgroundColor: buttonColor || "#000000",
      color: buttonTextColor || "#ffffff",
      borderRadius: `${buttonStyle}`,
    };

    return style;
  };
  const backgroundStyle = getBackgroundStyle();
  const buttonStyleObj = getButtonStyle();
  const textColor = linkHub.textColor || "#000000";
  return (
    <div className="min-h-screen relative" style={backgroundStyle}>
      {linkHub.backgroundType === "image" && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        <div className="flex justify-end mb-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              style={{ color: textColor, borderColor: `${textColor}40` }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="backdrop-blur-sm  flex   items-center   bg-white/10 rounded-3xl p-8 text-center mb-6 border border-white/20">
          <div className="relative mb-6 sm:w-24 sm:h-24 h-16 w-16 rounded-full flex-shrink-0">
            {linkHub.avatar ? (
              <img
                src={linkHub.avatar || "/placeholder.svg"}
                alt={linkHub.name}
                className=" h-full w-full rounded-full  mx-auto border-4 border-white/20 object-cover"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold border-4 border-white/20"
                style={{
                  backgroundColor: linkHub.buttonColor || "#000000",
                  color: linkHub.buttonTextColor || "#ffffff",
                }}
              >
                {linkHub.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className=" text-start ml-4">
            <h1
              className="text-2xl font-bold mb-2 "
              style={{ color: textColor }}
            >
              {linkHub.name}
            </h1>

            {linkHub.bio && (
              <h4
                className="mb-4  text-sm  opacity-90"
                style={{ color: textColor }}
              >
                {linkHub.bio}
              </h4>
            )}
          </div>
        </div>

        <div className=" mb-8">
          {(linkHub?.links ?? [])
            ?.filter((link) => link.isActive)
            ?.sort((a, b) => a.order - b.order)
            ?.map((link) => (
              <a
                key={link.id}
                target="_blank"
                href={link.url}
                onClick={() => handleLinkClick(link.id)}
              >
                <button
                  className="w-full p-4 my-2 text-left hover:scale-105 transition-all duration-200 group backdrop-blur-sm border border-white/10"
                  style={{
                    ...buttonStyleObj,
                  }}
                >
                  <div className="flex items-center">
                    {link.icon && (
                      <img
                        src={link.icon || "/placeholder.svg"}
                        alt={linkHub.name}
                        className="w-10 h-10 mr-2 rounded-full mx-auto   object-cover"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold group-hover:opacity-90 transition-opacity truncate"
                        style={{ color: linkHub.buttonTextColor || "#ffffff" }}
                      >
                        {link.title}
                      </h3>
                      {link.description && (
                        <p
                          className="text-sm  transition-opacity  truncate opacity-60"
                          style={{
                            color: linkHub.buttonTextColor || "#ffffff",
                          }}
                        >
                          {link.description}
                        </p>
                      )}
                    </div>

                    <ExternalLink
                      className="w-5 h-5 ml-2 opacity-60 group-hover:opacity-80 transition-opacity"
                      style={{ color: linkHub.buttonTextColor || "#ffffff" }}
                    />
                  </div>
                </button>
              </a>
            ))}
        </div>

        {(linkHub.links ?? []).filter((link) => link.isActive).length === 0 && (
          <div className="text-center py-12">
            <p className="opacity-60" style={{ color: textColor }}>
              No links available yet
            </p>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs opacity-60 " style={{ color: textColor }}>
            Created with{" "}
            <a
              href="/"
              className="hover:opacity-80 underline font-semibold transition-opacity opacity-80"
              style={{ color: textColor }}
            >
              LinkHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
