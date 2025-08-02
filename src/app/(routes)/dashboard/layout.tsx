import type React from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex ">
      <DashboardSidebar />
      <div className=" w-full">
        <main className="py-8 px-4 sm:px-6 lg:px-8 ">{children}</main>
      </div>
    </div>
  )
}
