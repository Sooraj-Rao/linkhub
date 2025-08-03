import type React from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="py-8 px-4 sm:px-6 lg:px-8 lg:ml-60">{children}</main>
      </div>
    </div>
  );
}
