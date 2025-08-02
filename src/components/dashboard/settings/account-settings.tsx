"use client";

import { useState } from "react";
import { Shield, Power, PowerOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AccountSettings() {
  const [isAccountActive, setIsAccountActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountToggle = async (enabled: boolean) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: enabled ? "enable" : "disable" }),
      });

      if (response.ok) {
        setIsAccountActive(enabled);
        toast.success(
          `Account ${enabled ? "enabled" : "disabled"} successfully`
        );
      } else {
        throw new Error("Failed to update account status");
      }
    } catch (error) {
      console.error("Failed to update account:", error);
      toast.error("Failed to update account status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold ">Account Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            {isAccountActive ? (
              <Power className="w-5 h-5 text-green-600" />
            ) : (
              <PowerOff className="w-5 h-5 text-red-600" />
            )}
            <div>
              <Label className="text-base font-medium">Account Status</Label>
              <p className="text-sm text-gray-500">
                {isAccountActive
                  ? "Your account and all LinkHubs are active"
                  : "Your account is disabled. All LinkHubs are hidden."}
              </p>
            </div>
          </div>
          <Switch
            checked={isAccountActive}
            onCheckedChange={handleAccountToggle}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
