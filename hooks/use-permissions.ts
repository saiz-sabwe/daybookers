"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  canAccessDashboard,
  hasAnyPermission,
  hasPermission,
  isPermissionsEnforced,
} from "@/lib/auth/permissions";
import { getPagePermissions } from "@/lib/auth/page-permissions";
import { useClientAuth } from "@/hooks/use-client-auth";
import { DashboardScope, Permission } from "@/types/auth";

export function usePermissions() {
  const { permissions, userProfile, permissionCatalog } = useClientAuth();

  const dashboardContext = useMemo(
    () => ({
      organizations: userProfile?.organizations,
      hotels: userProfile?.hotels,
      permissionCatalog,
    }),
    [userProfile?.organizations, userProfile?.hotels, permissionCatalog],
  );

  return useMemo(
    () => ({
      permissions,
      can: (permission: Permission) => hasPermission(permissions, permission),
      canAny: (required: Permission[]) =>
        hasAnyPermission(permissions, required),
      canAccessDashboard: (scope: DashboardScope) =>
        canAccessDashboard(permissions, scope, dashboardContext),
      isEnforced: isPermissionsEnforced(permissions),
    }),
    [permissions, dashboardContext],
  );
}

export function usePagePermission(pathname?: string) {
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const resolvedPath = pathname ?? currentPath;

  return useMemo(
    () => getPagePermissions(resolvedPath, searchParams),
    [resolvedPath, searchParams],
  );
}
