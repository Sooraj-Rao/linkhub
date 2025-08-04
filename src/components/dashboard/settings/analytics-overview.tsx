"use client";

import { BarChart3, ExternalLink, Users, MousePointer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";

interface UserStats {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  stats: {
    linkHubsCount: number;
    totalLinks: number;
    totalClicks: number;
    recentActivity: number;
    linkHubs: Array<{
      id: string;
      name: string;
      slug: string;
      isPersonal: boolean;
      totalClicks: number;
      _count: {
        links: number;
      };
    }>;
  };
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
};

export default function AnalyticsOverview() {
  const {
    data: stats,
    error,
    isLoading,
  } = useSWR<UserStats>("/api/user/stats", fetcher);

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="h-40 w-full bg-gray-300 rounded-xl animate-pulse dark:bg-muted space-y-4"></div>
        <div className="mt-12 space-y-3">
          <p className="h-6 bg-gray-300 rounded-lg animate-pulse dark:bg-muted"></p>
          <div className="h-20 w-full bg-gray-300 rounded-xl animate-pulse dark:bg-muted space-y-4"></div>
          <div className="h-20 w-full bg-gray-300 rounded-xl animate-pulse dark:bg-muted space-y-4"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="glass rounded-2xl p-6">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Quick Stats</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              LinkHubs
            </span>
            <span className="font-medium">{stats.stats.linkHubsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Total Links
            </span>
            <span className="font-medium">{stats.stats.totalLinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center">
              <MousePointer className="w-4 h-4 mr-2" />
              Total Clicks
            </span>
            <span className="font-medium">{stats.stats.totalClicks}</span>
          </div>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4">LinkHub Performance</h3>
        <div className="space-y-3">
          {stats.stats.linkHubs.map((hub) => (
            <div
              key={hub.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium truncate">{hub.name}</h4>
                  {hub.isPersonal && (
                    <Badge variant="secondary" className="text-xs">
                      Personal
                    </Badge>
                  )}
                </div>
                <a
                  target="_blank"
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/${hub.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  view
                </a>
              </div>
              <div className="text-right">
                <p className="font-medium">{hub.totalClicks} clicks</p>
                <p className="text-sm text-muted-foreground">
                  {hub._count.links} links
                </p>
              </div>
            </div>
          ))}
          {stats.stats.linkHubs.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No LinkHubs created yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
