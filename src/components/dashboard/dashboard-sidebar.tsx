"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Palette,
  Settings,
  X,
  Plus,
  Moon,
  Sun,
  SkipBackIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { toast } from "sonner";

const navigation = [
  { name: "Personal LinkHub", href: "/dashboard/links", icon: Home },
  { name: "Custom LinkHubs", href: "/dashboard/custom", icon: Plus },
  { name: "Appearance", href: "/dashboard/appearance", icon: Palette },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const res = await response.json();
      if (!res.success) {
        toast.error("Failed to logout");
        return;
      }
      window.location.href = "/";
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 h-screen shadow-lg transform transition-transform duration-300 ease-in-out bg-background lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6">
          <Logo />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-secondary"
                        : "hover:bg-secondary/30 text-muted-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-primary" : "text-gray-400"
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-6">
          <ThemeToggle>
            <div className="flex items-center text-muted-foreground justify-center gap-2 px-4 py-3 text-sm">
              {theme !== "light" ? <Sun size={16} /> : <Moon size={16} />}
              Change Theme
            </div>
          </ThemeToggle>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="absolute bottom-4 left-[50%] -translate-x-[50%]"
        >
          <SkipBackIcon size={14} />
          Logout
        </Button>
      </div>
    </>
  );
}

export const Logo = () => (
  <h1 className="text-xl text-center font-bold flex items-center gap-x-2">
    <img className=" h-6 w-6" src="../../../logo.png" alt="" />
    Linkhub</h1>
);
