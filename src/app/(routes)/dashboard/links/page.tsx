"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import LinkHubManager from "@/components/dashboard/linkhub-manager";
import PublicProfile from "@/components/public/public-profile";
import { LinkHub } from "@/lib/types";

export default function PersonalLinksPage() {
  const { user } = useAuth();
  const [personalLinkHub, setPersonalLinkHub] = useState<LinkHub | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPersonalLinkHub();
    }
  }, [user]);

  const fetchPersonalLinkHub = async () => {
    try {
      const response = await fetch("/api/linkhubs/personal");
      if (response.ok) {
        const data = await response.json();
        setPersonalLinkHub(data);
      }
    } catch (error) {
      console.error("Failed to fetch personal LinkHub:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div>Loading your personal LinkHub...</div>;
  }

  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-xl font-bold ">Personal LinkHub</h1>
      </div>

      {personalLinkHub ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className=" col-span-2 ">
            <LinkHubManager
              onupdate={fetchPersonalLinkHub}
              linkHub={personalLinkHub}
              isPersonal={true}
            />
          </div>
          <div className="lg:sticky lg:top-8 rounded-md  overflow-hidden">
            <PublicProfile linkHub={personalLinkHub} />
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <h3 className="text-lg font-medium  mb-2">
            Create Your Personal LinkHub
          </h3>
          <p className=" mb-4">
            Get started by creating your main LinkHub profile
          </p>
          <button
            onClick={fetchPersonalLinkHub}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg"
          >
            Create Personal LinkHub
          </button>
        </div>
      )}
    </div>
  );
}
