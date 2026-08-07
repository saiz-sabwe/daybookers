"use client";

import { Suspense } from "react";
import { DashboardShell } from "@/components/shared/dashboard/DashboardShell";
import { PageLoader } from "@/components/shared/PageLoader";
import { CLIENT_NAV_ITEMS } from "@/lib/auth/route-permissions";
import { ClientPageGuard } from "@/components/shared/auth/ClientPageGuard";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

const clientNavItems = CLIENT_NAV_ITEMS.map(
  ({ href, label, icon, requiredPermissions }) => ({
    href,
    label,
    icon,
    requiredPermissions,
  }),
);

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientPageGuard>
      <DashboardShell theme="client" navItems={clientNavItems}>
        {children}
      </DashboardShell>
    </ClientPageGuard>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute dashboard="client">
      <Suspense
        fallback={
          <PageLoader message="Chargement du tableau de bord..." />
        }
      >
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </Suspense>
    </ProtectedRoute>
  );
}
