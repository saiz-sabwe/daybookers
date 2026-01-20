"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Calendar, 
  Heart, 
  User, 
  LogOut, 
  Home,
  X,
  Building2,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/better-auth-client";
import { hasAnyPartnerRole, hasAdminRole } from "@/app/actions/users/get";

const navigation = [
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
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "bookings";
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isPartner, setIsPartner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.id) {
      hasAnyPartnerRole(user.id).then(setIsPartner);
      hasAdminRole(user.id).then(setIsAdmin);
    }
  }, [user?.id]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const handleLinkClick = () => {
    // Fermer le sidebar sur mobile quand on clique sur un lien
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white transition-transform duration-300",
          // Sur mobile: masqué par défaut, visible si isOpen
          "transform -translate-x-full lg:translate-x-0",
          isOpen && "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
        {/* Bouton fermer sur mobile */}
        <div className="flex h-12 items-center justify-end border-b border-gray-200 px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 pt-4">
          {navigation.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-client-primary-50 text-client-primary-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-client-primary-600"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
          
          {/* Lien vers le dashboard partenaire (si l'utilisateur a un rôle partenaire) */}
          {isPartner && (
            <Link
              href="/partner/dashboard"
              onClick={handleLinkClick}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-200 mt-4 pt-4"
            >
              <Building2 className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Dashboard Partenaire
            </Link>
          )}

          {/* Lien vers le dashboard admin (si l'utilisateur a un rôle admin) */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={handleLinkClick}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-200 mt-4 pt-4"
            >
              <Shield className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Dashboard Admin
            </Link>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-client-primary-100">
              <User className="h-5 w-5 text-client-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Home className="h-5 w-5 text-gray-400" />
            Retour à l'accueil
          </Link>

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="mt-2 w-full justify-start gap-3 text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            Déconnexion
          </Button>
        </div>
      </div>
      </aside>
    </>
  );
}

