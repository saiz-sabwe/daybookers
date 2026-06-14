"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Calendar,
  Heart,
  User,
  LogOut,
  Home,
  X,
  Building2,
  Shield,
  Sparkles,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClientAuth } from "@/hooks/use-client-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { clientSignOut } from "@/lib/api/client-sign-out";

const navigation = [
  {
    name: "Accueil",
    href: "/",
    icon: Home,
    key: "home",
  },
  {
    name: "Mes réservations",
    href: "/dashboard",
    icon: Calendar,
    key: "bookings",
  },
  {
    name: "Mes favoris",
    href: "/dashboard?tab=favorites",
    icon: Heart,
    key: "favorites",
  },
  {
    name: "Mon profil",
    href: "/dashboard?tab=profile",
    icon: User,
    key: "profile",
  },
];

interface ClientSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ClientSidebar({ isOpen = true, onClose }: ClientSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "bookings";
  const { isAuthenticated, userEmail, userName } = useClientAuth();
  const { canAccessDashboard } = usePermissions();
  const showPartnerLink = isAuthenticated && canAccessDashboard("partner");
  const showSadminLink = isAuthenticated && canAccessDashboard("sadmin");

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
            <div className="absolute inset-0 bg-gradient-to-br from-client-primary-500 to-client-primary-700" />
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white ring-2 ring-white/30 backdrop-blur-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-client-primary-100">
                  {userEmail}
                </p>
              </div>
            </div>
            <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Espace client
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          {navigation.map((item) => {
            const isActive =
              item.key === "home"
                ? pathname === "/"
                : activeTab === item.key;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-client-primary-50 text-client-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-client-primary-500" />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-client-primary-600"
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-gray-100 p-4">
          <Link
            href="/hotels"
            onClick={handleLinkClick}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Compass className="h-5 w-5 text-gray-400" />
            Explorer les hôtels
          </Link>

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
