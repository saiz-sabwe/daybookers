"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LucideIcon, LogOut, Home, X, Sparkles, User, Building2, Shield, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClientAuth } from "@/hooks/use-client-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { clientSignOut } from "@/lib/api/client-sign-out";
import { isGroupManagerScope } from "@/lib/auth/permissions";
import { DashboardTheme, getDashboardTheme } from "@/lib/dashboard/themes";
import { Permission } from "@/types/auth";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  requiredPermissions?: Permission[];
  groupManagerOnly?: boolean;
}

interface DashboardSidebarProps {
  theme: DashboardTheme;
  items: DashboardNavItem[];
  isOpen?: boolean;
  onClose?: () => void;
  filterByPermissions?: boolean;
}

const SIDEBAR_THEMES: Record<
  DashboardTheme,
  {
    gradient: string;
    badgeText: string;
    activeBg: string;
    activeText: string;
    activeBar: string;
    activeIcon: string;
    profileRing: string;
  }
> = {
  client: {
    gradient: "from-client-primary-500 to-client-primary-700",
    badgeText: "text-client-primary-100",
    activeBg: "bg-client-primary-50",
    activeText: "text-client-primary-700",
    activeBar: "bg-client-primary-500",
    activeIcon: "text-client-primary-600",
    profileRing: "ring-white/30",
  },
  partner: {
    gradient: "from-partner-primary-500 to-partner-primary-700",
    badgeText: "text-partner-primary-100",
    activeBg: "bg-partner-primary-50",
    activeText: "text-partner-primary-700",
    activeBar: "bg-partner-primary-500",
    activeIcon: "text-partner-primary-600",
    profileRing: "ring-white/30",
  },
  sadmin: {
    gradient: "from-admin-primary-500 to-admin-primary-700",
    badgeText: "text-admin-primary-100",
    activeBg: "bg-admin-primary-50",
    activeText: "text-admin-primary-700",
    activeBar: "bg-admin-primary-500",
    activeIcon: "text-admin-primary-600",
    profileRing: "ring-white/30",
  },
};

function isNavItemActive(
  pathname: string,
  searchParams: URLSearchParams,
  href: string,
): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  const [path, query] = href.split("?");

  if (pathname !== path) {
    return path !== "/" && (pathname?.startsWith(path + "/") ?? false);
  }

  if (query) {
    const params = new URLSearchParams(query);
    const tab = params.get("tab");
    return searchParams.get("tab") === tab;
  }

  if (path === "/dashboard") {
    const tab = searchParams.get("tab");
    return !tab || tab === "bookings";
  }

  return pathname === href;
}

export function DashboardSidebar({
  theme,
  items,
  isOpen = true,
  onClose,
  filterByPermissions = true,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, userEmail, userName, userProfile } = useClientAuth();
  const { canAny, canAccessDashboard } = usePermissions();
  const config = getDashboardTheme(theme);
  const styles = SIDEBAR_THEMES[theme];
  const partnerScope = {
    organizations: userProfile?.organizations,
    hotels: userProfile?.hotels,
  };
  const isGroupManager = isGroupManagerScope(partnerScope);
  const spaceLabel =
    theme === "partner" && !isGroupManager
      ? "Espace hôtel"
      : config.spaceLabel;

  const visibleItems = filterByPermissions
    ? items.filter((item) => {
        if (item.groupManagerOnly && !isGroupManager) {
          return false;
        }
        return (
          !item.requiredPermissions?.length ||
          canAny(item.requiredPermissions)
        );
      })
    : items;

  const showClientLink =
    theme !== "client" && isAuthenticated && canAccessDashboard("client");
  const showPartnerLink =
    theme !== "partner" && isAuthenticated && canAccessDashboard("partner");
  const showSadminLink =
    theme !== "sadmin" && isAuthenticated && canAccessDashboard("sadmin");

  const handleSignOut = async () => {
    await clientSignOut("/");
  };

  const handleLinkClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  const displayName = userName;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-gray-200/80 bg-white shadow-xl shadow-gray-200/50 transition-transform duration-300 lg:shadow-none",
          "transform -translate-x-full lg:translate-x-0",
          isOpen && "translate-x-0",
        )}
      >
        <div className="flex h-12 items-center justify-end border-b border-gray-100 px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {isAuthenticated && userEmail && (
          <div className="relative overflow-hidden border-b border-gray-100 p-5">
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                styles.gradient,
              )}
            />
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white ring-2 backdrop-blur-sm",
                  styles.profileRing,
                )}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className={cn("truncate text-xs", styles.badgeText)}>
                  {userEmail}
                </p>
              </div>
            </div>
            <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              {spaceLabel}
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          {visibleItems.map((item) => {
            const isActive = isNavItemActive(
              pathname,
              searchParams,
              item.href,
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? cn(styles.activeBg, styles.activeText, "shadow-sm")
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                {isActive && (
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full",
                      styles.activeBar,
                    )}
                  />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? styles.activeIcon
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-gray-100 p-4">
          {theme === "client" ? (
            <Link
              href="/hotels"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Compass className="h-5 w-5 text-gray-400" />
              Explorer les hôtels
            </Link>
          ) : (
            <Link
              href="/"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Home className="h-5 w-5 text-gray-400" />
              Accueil
            </Link>
          )}

          {showClientLink && (
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <User className="h-5 w-5 text-gray-400" />
              Espace client
            </Link>
          )}

          {showPartnerLink && (
            <Link
              href="/partner/dashboard"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Building2 className="h-5 w-5 text-gray-400" />
              Espace Organisation
            </Link>
          )}

          {showSadminLink && (
            <Link
              href="/admin/dashboard"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Shield className="h-5 w-5 text-gray-400" />
              Super Admin
            </Link>
          )}

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="mt-1 w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
}
