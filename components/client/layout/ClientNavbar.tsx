"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, Home } from "lucide-react";
import { authClient } from "@/lib/better-auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ClientNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "bookings";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-client-primary-600">DayBooker</span>
            <span className="text-sm text-gray-500">Client</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/dashboard" && activeTab === "bookings"
                  ? "text-client-primary-600"
                  : "text-gray-600 hover:text-client-primary-600"
              )}
            >
              Mes réservations
            </Link>
            <Link
              href="/dashboard?tab=favorites"
              className={cn(
                "text-sm font-medium transition-colors",
                activeTab === "favorites"
                  ? "text-client-primary-600"
                  : "text-gray-600 hover:text-client-primary-600"
              )}
            >
              Mes favoris
            </Link>
            <Link
              href="/dashboard?tab=profile"
              className={cn(
                "text-sm font-medium transition-colors",
                activeTab === "profile"
                  ? "text-client-primary-600"
                  : "text-gray-600 hover:text-client-primary-600"
              )}
            >
              Mon profil
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

