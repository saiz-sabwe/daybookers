"use client";

import { Suspense } from "react";
import { DashboardShell } from "@/components/shared/dashboard/DashboardShell";
import { PageLoader } from "@/components/shared/PageLoader";
import { SADMIN_NAV_ITEMS } from "@/lib/auth/route-permissions";
import { AdminPageGuard } from "@/components/shared/auth/AdminPageGuard";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

const sadminNavItems = SADMIN_NAV_ITEMS.map(
  ({ href, label, icon, requiredPermissions }) => ({
    href,
    label,
    icon,
    requiredPermissions,
  }),
);

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPageGuard>
      <DashboardShell
        theme="sadmin"
        navItems={sadminNavItems}
        maxWidth="wide"
      >
        {children}
      </DashboardShell>
    </AdminPageGuard>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute dashboard="sadmin">
      <Suspense fallback={<PageLoader message="Chargement..." />}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </Suspense>
    </ProtectedRoute>
  );
}
