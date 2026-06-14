"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { DashboardTheme, getDashboardTheme } from "@/lib/dashboard/themes";
import { cn } from "@/lib/utils";

interface DashboardNavbarProps {
  theme: DashboardTheme;
}

export function DashboardNavbar({ theme }: DashboardNavbarProps) {
  const config = getDashboardTheme(theme);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={config.logoHref} className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold", config.primary[600])}>
              DayBooker
            </span>
            <span className="hidden text-sm text-gray-500 sm:inline">
              {config.scopeLabel}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
