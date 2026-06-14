import { Permission } from "@/types/auth";
import { LucideIcon } from "lucide-react";
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
  Users,
  Home,
  Heart,
  User,
} from "lucide-react";

export interface NavItemWithPermissions {
  href: string;
  label: string;
  icon: LucideIcon;
  requiredPermissions?: Permission[];
}

export const CLIENT_NAV_ITEMS: NavItemWithPermissions[] = [
  {
    href: "/",
    label: "Accueil",
    icon: Home,
    requiredPermissions: [],
  },
  {
    href: "/dashboard",
    label: "Mes réservations",
    icon: Calendar,
    requiredPermissions: [],
  },
  {
    href: "/dashboard?tab=favorites",
    label: "Mes favoris",
    icon: Heart,
    requiredPermissions: [],
  },
  {
    href: "/dashboard?tab=profile",
    label: "Mon profil",
    icon: User,
    requiredPermissions: [],
  },
];

export const PARTNER_NAV_ITEMS: NavItemWithPermissions[] = [
  {
    href: "/partner/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    requiredPermissions: ["partner.dashboard.view"],
  },
  {
    href: "/partner/hotels",
    label: "Mes hôtels",
    icon: Building2,
    requiredPermissions: ["partner.hotels.view"],
  },
  {
    href: "/partner/hotel-groups",
    label: "Groupes d'hôtels",
    icon: FolderTree,
    requiredPermissions: ["partner.hotel_groups.view"],
  },
  {
    href: "/partner/checkin-checkout",
    label: "Check-in / Check-out",
    icon: ClipboardCheck,
    requiredPermissions: ["partner.checkin.manage"],
  },
  {
    href: "/partner/complaints",
    label: "Plaintes",
    icon: AlertTriangle,
    requiredPermissions: ["partner.complaints.view"],
  },
  {
    href: "/partner/availability",
    label: "Disponibilités",
    icon: Calendar,
    requiredPermissions: ["partner.availability.manage"],
  },
  {
    href: "/partner/pricing",
    label: "Tarification",
    icon: DollarSign,
    requiredPermissions: ["partner.pricing.manage"],
  },
  {
    href: "/partner/bookings",
    label: "Réservations",
    icon: FileText,
    requiredPermissions: ["partner.bookings.view"],
  },
  {
    href: "/partner/payments",
    label: "Paiements",
    icon: CreditCard,
    requiredPermissions: ["partner.payments.view"],
  },
  {
    href: "/partner/earnings",
    label: "Revenus",
    icon: BarChart3,
    requiredPermissions: ["partner.earnings.view"],
  },
  {
    href: "/partner/reviews",
    label: "Avis clients",
    icon: Star,
    requiredPermissions: ["partner.reviews.view"],
  },
  {
    href: "/partner/settings",
    label: "Paramètres",
    icon: Settings,
    requiredPermissions: ["partner.settings.view"],
  },
];

export const SADMIN_NAV_ITEMS: NavItemWithPermissions[] = [
  {
    href: "/admin/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    requiredPermissions: ["sadmin.dashboard.view"],
  },
  {
    href: "/admin/hotels",
    label: "Hôtels",
    icon: Building2,
    requiredPermissions: ["sadmin.hotels.view"],
  },
  {
    href: "/admin/users",
    label: "Utilisateurs",
    icon: Users,
    requiredPermissions: ["sadmin.users.view"],
  },
  {
    href: "/admin/commissions",
    label: "Commissions",
    icon: DollarSign,
    requiredPermissions: ["sadmin.commissions.view"],
  },
  {
    href: "/admin/settings",
    label: "Paramètres",
    icon: Settings,
    requiredPermissions: ["sadmin.settings.view"],
  },
];

export function filterNavByPermissions(
  items: NavItemWithPermissions[],
  canAny: (permissions: Permission[]) => boolean,
): NavItemWithPermissions[] {
  return items.filter((item) => canAny(item.requiredPermissions));
}
