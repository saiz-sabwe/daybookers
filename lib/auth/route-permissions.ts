import { djangoPerm } from "@/lib/auth/django-perm";
import {
  DashboardAccessContext,
  isGroupManagerScope,
} from "@/lib/auth/permissions";
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
  /** Visible uniquement pour les group managers (ProfileOrganization). */
  groupManagerOnly?: boolean;
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
    requiredPermissions: [djangoPerm("hotels", "booking")],
  },
  {
    href: "/dashboard?tab=favorites",
    label: "Mes favoris",
    icon: Heart,
    requiredPermissions: [djangoPerm("hotels", "favorite")],
  },
  {
    href: "/dashboard?tab=profile",
    label: "Mon profil",
    icon: User,
    requiredPermissions: [djangoPerm("profils", "profile")],
  },
];

export const PARTNER_NAV_ITEMS: NavItemWithPermissions[] = [
  {
    href: "/partner/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    requiredPermissions: [djangoPerm("hotels", "hotel")],
  },
  {
    href: "/partner/hotels",
    label: "Mes hôtels",
    icon: Building2,
    requiredPermissions: [djangoPerm("hotels", "hotel")],
    groupManagerOnly: true,
  },
  {
    href: "/partner/hotel-groups",
    label: "Groupes d'hôtels",
    icon: FolderTree,
    requiredPermissions: [djangoPerm("profils", "organization")],
  },
  {
    href: "/partner/checkin-checkout",
    label: "Check-in / Check-out",
    icon: ClipboardCheck,
    requiredPermissions: [djangoPerm("hotels", "booking")],
  },
  {
    href: "/partner/complaints",
    label: "Plaintes",
    icon: AlertTriangle,
    requiredPermissions: [djangoPerm("hotels", "complaint")],
  },
  {
    href: "/partner/availability",
    label: "Disponibilités",
    icon: Calendar,
    requiredPermissions: [djangoPerm("hotels", "availability")],
  },
  {
    href: "/partner/pricing",
    label: "Tarification",
    icon: DollarSign,
    requiredPermissions: [djangoPerm("hotels", "pricingrule")],
  },
  {
    href: "/partner/bookings",
    label: "Réservations",
    icon: FileText,
    requiredPermissions: [djangoPerm("hotels", "booking")],
  },
  {
    href: "/partner/payments",
    label: "Paiements",
    icon: CreditCard,
    requiredPermissions: [djangoPerm("hotels", "booking")],
  },
  {
    href: "/partner/earnings",
    label: "Revenus",
    icon: BarChart3,
    requiredPermissions: [djangoPerm("hotels", "booking")],
  },
  {
    href: "/partner/reviews",
    label: "Avis clients",
    icon: Star,
    requiredPermissions: [djangoPerm("hotels", "review")],
  },
  {
    href: "/partner/settings",
    label: "Paramètres",
    icon: Settings,
    requiredPermissions: [djangoPerm("profils", "profile")],
  },
];

export const SADMIN_NAV_ITEMS: NavItemWithPermissions[] = [
  {
    href: "/admin/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    requiredPermissions: [djangoPerm("hotels", "hotel")],
  },
  {
    href: "/admin/hotels",
    label: "Hôtels",
    icon: Building2,
    requiredPermissions: [djangoPerm("hotels", "hotel")],
  },
  {
    href: "/admin/users",
    label: "Utilisateurs",
    icon: Users,
    requiredPermissions: [djangoPerm("profils", "profile")],
  },
  {
    href: "/admin/commissions",
    label: "Commissions",
    icon: DollarSign,
    requiredPermissions: [djangoPerm("profils", "organization")],
  },
  {
    href: "/admin/settings",
    label: "Paramètres",
    icon: Settings,
    requiredPermissions: [djangoPerm("profils", "profile")],
  },
];

export function filterNavByPermissions(
  items: NavItemWithPermissions[],
  canAny: (permissions: Permission[]) => boolean,
  context?: DashboardAccessContext,
): NavItemWithPermissions[] {
  const isGroupManager = isGroupManagerScope(context);
  return items.filter((item) => {
    if (item.groupManagerOnly && !isGroupManager) {
      return false;
    }
    return !item.requiredPermissions?.length || canAny(item.requiredPermissions);
  });
}
