"use client";

import { Suspense } from "react";
import { DashboardShell } from "@/components/shared/dashboard/DashboardShell";
import { PageLoader } from "@/components/shared/PageLoader";
import { PARTNER_NAV_ITEMS } from "@/lib/auth/route-permissions";
import { PartnerPageGuard } from "@/components/shared/auth/PartnerPageGuard";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

const partnerNavItems = PARTNER_NAV_ITEMS.map(
  ({ href, label, icon, requiredPermissions, groupManagerOnly }) => ({
    href,
    label,
    icon,
    requiredPermissions,
    groupManagerOnly,
  }),
);

function PartnerLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PartnerPageGuard>
      <DashboardShell
        theme="partner"
        navItems={partnerNavItems}
        maxWidth="wide"
      >
        {children}
      </DashboardShell>
    </PartnerPageGuard>
  );
}

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute dashboard="partner">
      <Suspense fallback={<PageLoader message="Chargement..." />}>
        <PartnerLayoutContent>{children}</PartnerLayoutContent>
      </Suspense>
    </ProtectedRoute>
  );
}
