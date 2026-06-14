"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, Home, Loader2 } from "lucide-react";
import { clientSignOut } from "@/lib/api/client-sign-out";
import { cn } from "@/lib/utils";

export function AdminNavbar() {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await clientSignOut("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-admin-primary-600">DayBooker</span>
            <span className="text-sm text-gray-500">Admin</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/admin/dashboard"
                  ? "text-admin-primary-600"
                  : "text-gray-600 hover:text-admin-primary-600"
              )}
            >
              Tableau de bord
            </Link>
            <Link
              href="/admin/hotels"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/admin/hotels")
                  ? "text-admin-primary-600"
                  : "text-gray-600 hover:text-admin-primary-600"
              )}
            >
              Hôtels
            </Link>
            <Link
              href="/admin/users"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/admin/users")
                  ? "text-admin-primary-600"
                  : "text-gray-600 hover:text-admin-primary-600"
              )}
            >
              Utilisateurs
            </Link>
            <Link
              href="/admin/commissions"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname?.startsWith("/admin/commissions")
                  ? "text-admin-primary-600"
                  : "text-gray-600 hover:text-admin-primary-600"
              )}
            >
              Commissions
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

