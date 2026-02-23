"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, Home, User, Loader2 } from "lucide-react";
import { authClient } from "@/lib/better-auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ClientNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "bookings";
  const { data: session } = authClient.useSession();
  const user = session?.user;
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & User Profile */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-client-primary-600">DayBooker</span>
              <span className="text-sm text-gray-500">Client</span>
            </Link>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-client-primary-100">
                    <User className="h-4 w-4 text-client-primary-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name || "Utilisateur"}</p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="cursor-pointer text-red-600"
                >
                  {isSigningOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

