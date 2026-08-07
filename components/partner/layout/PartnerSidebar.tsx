"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { filterNavByPermissions, PARTNER_NAV_ITEMS } from "@/lib/auth/route-permissions";
import { useClientAuth } from "@/hooks/use-client-auth";
import { usePermissions } from "@/hooks/use-permissions";

export function PartnerSidebar() {
  const pathname = usePathname();
  const { canAny } = usePermissions();
  const { userProfile } = useClientAuth();

  const visibleItems = filterNavByPermissions(PARTNER_NAV_ITEMS, canAny, {
    organizations: userProfile?.organizations,
    hotels: userProfile?.hotels,
  });

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-partner-primary-50 text-partner-primary-700 border-l-4 border-partner-primary-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-partner-primary-600",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
