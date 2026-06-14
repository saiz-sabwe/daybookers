"use client";

import { useState, ReactNode, Suspense } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNavbar } from "@/components/shared/dashboard/DashboardNavbar";
import {
  DashboardNavItem,
  DashboardSidebar,
} from "@/components/shared/dashboard/DashboardSidebar";
import { DashboardTheme, getDashboardTheme } from "@/lib/dashboard/themes";

interface DashboardShellProps {
  theme: DashboardTheme;
  navItems: DashboardNavItem[];
  children: ReactNode;
  maxWidth?: "default" | "wide";
}

export function DashboardShell({
  theme,
  navItems,
  children,
  maxWidth = "default",
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = getDashboardTheme(theme);

  return (
    <div className={cnShell(config.themeClass)}>
      <DashboardNavbar theme={theme} />
      <Suspense fallback={null}>
        <DashboardSidebar
          theme={theme}
          items={navItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Suspense>

      <main className="flex-1 md:ml-72 pt-16">
        <div className="fixed left-0 right-0 top-16 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div
          className={
            maxWidth === "wide"
              ? "container mx-auto px-4 pb-6 pt-6 mt-12 md:mt-0"
              : "container mx-auto max-w-5xl px-4 pb-6 pt-6 mt-12 md:mt-0"
          }
        >
          {children}
        </div>
      </main>
    </div>
  );
}

function cnShell(themeClass: string) {
  return `min-h-screen bg-gray-100 ${themeClass}`;
}
