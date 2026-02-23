"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, Home, Loader2 } from "lucide-react";
import { authClient } from "@/lib/better-auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function PartnerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/partner/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-partner-primary-600">DayBooker</span>
            <span className="text-sm text-gray-500">Partenaire</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/partner/dashboard"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/partner/dashboard"
                  ? "text-partner-primary-600"
                  : "text-gray-600 hover:text-partner-primary-600"
              )}
            >
              Tableau de bord
            </Link>
            <Link
              href="/partner/hotels"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/partner/hotels")
                  ? "text-partner-primary-600"
                  : "text-gray-600 hover:text-partner-primary-600"
              )}
            >
              Mes hôtels
            </Link>
            <Link
              href="/partner/availability"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/partner/availability")
                  ? "text-partner-primary-600"
                  : "text-gray-600 hover:text-partner-primary-600"
              )}
            >
              Disponibilités
            </Link>
            <Link
              href="/partner/pricing"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/partner/pricing")
                  ? "text-partner-primary-600"
                  : "text-gray-600 hover:text-partner-primary-600"
              )}
            >
              Tarification
            </Link>
            <Link
              href="/partner/bookings"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/partner/bookings")
                  ? "text-partner-primary-600"
                  : "text-gray-600 hover:text-partner-primary-600"
              )}
            >
              Réservations
            </Link>
            <Link
              href="/partner/earnings"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/partner/earnings")
                  ? "text-partner-primary-600"
                  : "text-gray-600 hover:text-partner-primary-600"
              )}
            >
              Revenus
            </Link>
            <Link
              href="/partner/reviews"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/partner/reviews")
                  ? "text-partner-primary-600"
                  : "text-gray-600 hover:text-partner-primary-600"
              )}
            >
              Avis clients
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
            <Button variant="ghost" size="icon" asChild>
              <Link href="/partner/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

