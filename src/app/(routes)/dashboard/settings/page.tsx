import { Suspense } from "react";
import AccountSettings from "@/components/dashboard/settings/account-settings";
import AnalyticsOverview from "@/components/dashboard/settings/analytics-overview";
import DangerZone from "@/components/dashboard/settings/danger-zone";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 ">
          <Suspense
            fallback={<div className="glass rounded-2xl p-6">Loading...</div>}
          >
            {/* <ProfileSettings /> */}
            <AccountSettings />
            <DangerZone />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense
            fallback={<div className="glass rounded-2xl p-6">Loading...</div>}
          >
            <AnalyticsOverview />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
