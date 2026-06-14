"use client";

import { DashboardShell } from "@/components/shared/dashboard/DashboardShell";
import { PARTNER_NAV_ITEMS } from "@/lib/auth/route-permissions";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

const partnerNavItems = PARTNER_NAV_ITEMS.map(
  ({ href, label, icon, requiredPermissions }) => ({
    href,
    label,
    icon,
    requiredPermissions,
  }),
);

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute dashboard="partner">
      <DashboardShell
        theme="partner"
        navItems={partnerNavItems}
        maxWidth="wide"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
