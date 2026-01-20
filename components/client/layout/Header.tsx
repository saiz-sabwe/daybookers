"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, User, Globe, Phone, LogOut, LayoutDashboard, Heart } from "lucide-react";
import { authClient } from "@/lib/better-auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-black tracking-tight">
            daybooker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="hidden lg:inline">Contact</span>
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden lg:inline">FR</span>
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          
          {isPending ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated ? (
            // Utilisateur connecté - Menu déroulant
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-client-primary-100">
                      <User className="h-4 w-4 text-client-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 hidden lg:inline">
                      {user?.name || user?.email?.split("@")[0] || "Utilisateur"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || "Utilisateur"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    Mon tableau de bord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=favorites" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    Mes favoris
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Visiteur - Bouton de connexion
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Connexion</span>
            </Link>
          )}
          
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6" asChild>
            <Link href="/hotels">Réserver</Link>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          {isPending ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || "Utilisateur"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    Mon tableau de bord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=favorites" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    Mes favoris
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="text-gray-600">
              <User className="w-5 h-5" />
            </Link>
          )}
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
