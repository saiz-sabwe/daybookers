"use client";

import { DashboardShell } from "@/components/shared/dashboard/DashboardShell";
import { CLIENT_NAV_ITEMS } from "@/lib/auth/route-permissions";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

const clientNavItems = CLIENT_NAV_ITEMS.map(
  ({ href, label, icon, requiredPermissions }) => ({
    href,
    label,
    icon,
    requiredPermissions,
  }),
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute dashboard="client">
      <DashboardShell theme="client" navItems={clientNavItems}>
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
