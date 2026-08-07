"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";
import { useClientAuth } from "@/hooks/use-client-auth";
import { resolveHomeDashboard } from "@/lib/auth/resolve-home-dashboard";

export function ClientPageGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { userProfile, permissions, permissionCatalog } = useClientAuth();
  const homeDashboard = resolveHomeDashboard(
    userProfile,
    permissions,
    permissionCatalog,
  );
  const redirectTo =
    homeDashboard === pathname ? "/" : homeDashboard;

  return (
    <RequirePagePermission redirectTo={redirectTo}>
      {children}
    </RequirePagePermission>
  );
}
