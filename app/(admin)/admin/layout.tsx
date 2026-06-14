"use client";

import { DashboardShell } from "@/components/shared/dashboard/DashboardShell";
import { SADMIN_NAV_ITEMS } from "@/lib/auth/route-permissions";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

const sadminNavItems = SADMIN_NAV_ITEMS.map(
  ({ href, label, icon, requiredPermissions }) => ({
    href,
    label,
    icon,
    requiredPermissions,
  }),
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute dashboard="sadmin">
      <DashboardShell
        theme="sadmin"
        navItems={sadminNavItems}
        maxWidth="wide"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
