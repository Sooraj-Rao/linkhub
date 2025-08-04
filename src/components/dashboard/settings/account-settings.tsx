"use client";

import { Shield, Power, PowerOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";

interface AccountData {
  isActive: boolean;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch status");
  }
  return response.json();
};

export default function AccountSettings() {
  const { data, error, isLoading, mutate } = useSWR<AccountData>(
    "/api/user/account",
    fetcher
  );

  const handleAccountToggle = async (enabled: boolean) => {
    try {
      const response = await fetch("/api/user/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: enabled ? "enable" : "disable" }),
      });

      if (response.ok) {
        await mutate({ isActive: enabled }, false); // Optimistically update the cache
        toast.success(
          `Account ${enabled ? "enabled" : "disabled"} successfully`
        );
      } else {
        throw new Error("Failed to update account status");
      }
    } catch (error) {
      console.error("Failed to update account:", error);
      toast.error("Failed to update account status");
      await mutate(undefined, { revalidate: true }); // Revalidate on error
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Account Settings</h2>
      </div>
      {isLoading || !data ? (
        <Skeleton className="h-20" />
      ) : error ? (
        <div className="text-red-500">Failed to load account status</div>
      ) : (
        <div className="space-y-6 h-20">
          <div className="items-center flex justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {data.isActive ? (
                <Power className="w-5 h-5 text-green-600" />
              ) : (
                <PowerOff className="w-5 h-5 text-red-600" />
              )}
              <div>
                <Label className="text-base font-medium">Account Status</Label>
                <p className="text-sm text-gray-500">
                  {data.isActive
                    ? "Your account and all LinkHubs are active"
                    : "Your account is disabled. All LinkHubs are hidden."}
                </p>
              </div>
            </div>
            <Switch
              checked={data.isActive}
              onCheckedChange={handleAccountToggle}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
