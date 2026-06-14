"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useClientAuth } from "@/hooks/use-client-auth";
import { getUserById } from "@/app/actions/users/get";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  DollarSign,
  Star,
  Settings,
  FileText,
  BarChart3,
  ClipboardCheck,
  AlertTriangle,
  CreditCard,
  FolderTree,
} from "lucide-react";

const menuItems = [
  { href: "/partner/dashboard", label: "Tableau de bord", icon: LayoutDashboard, allowedRoles: ["all"] },
  { href: "/partner/hotels", label: "Mes hôtels", icon: Building2, allowedRoles: ["ROLE_HOTEL_MANAGER", "ROLE_HOTEL_GROUP_MANAGER"] },
  { href: "/partner/hotel-groups", label: "Groupes d'hôtels", icon: FolderTree, allowedRoles: ["ROLE_HOTEL_GROUP_MANAGER"] },
  { href: "/partner/checkin-checkout", label: "Check-in / Check-out", icon: ClipboardCheck, allowedRoles: ["all"] },
  { href: "/partner/complaints", label: "Plaintes", icon: AlertTriangle, allowedRoles: ["all"] },
  { href: "/partner/availability", label: "Disponibilités", icon: Calendar, allowedRoles: ["ROLE_HOTEL_MANAGER", "ROLE_HOTEL_GROUP_MANAGER"] },
  { href: "/partner/pricing", label: "Tarification", icon: DollarSign, allowedRoles: ["ROLE_HOTEL_MANAGER", "ROLE_HOTEL_GROUP_MANAGER"] },
  { href: "/partner/bookings", label: "Réservations", icon: FileText, allowedRoles: ["all"] },
  { href: "/partner/payments", label: "Paiements", icon: CreditCard, allowedRoles: ["all"] },
  { href: "/partner/earnings", label: "Revenus", icon: BarChart3, allowedRoles: ["ROLE_HOTEL_MANAGER", "ROLE_HOTEL_GROUP_MANAGER"] },
  { href: "/partner/reviews", label: "Avis clients", icon: Star, allowedRoles: ["all"] },
  { href: "/partner/settings", label: "Paramètres", icon: Settings, allowedRoles: ["all"] },
];

export function PartnerSidebar() {
  const pathname = usePathname();
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthPending || !isAuthenticated) {
      return;
    }

    getUserById("").then((user) => {
      if (user) {
        setUserRoles(user.roles);
      }
    });
  }, [isAuthenticated, isAuthPending]);

  const isReceptionist = userRoles.includes("ROLE_HOTEL_RECEPTIONIST") && 
                        !userRoles.includes("ROLE_HOTEL_MANAGER") && 
                        !userRoles.includes("ROLE_HOTEL_GROUP_MANAGER");

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.allowedRoles.includes("all")) return true;
    if (isReceptionist) return false; // Réceptionniste ne voit que les items "all"
    return item.allowedRoles.some((role) => userRoles.includes(role));
  });

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-partner-primary-50 text-partner-primary-700 border-l-4 border-partner-primary-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-partner-primary-600"
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

