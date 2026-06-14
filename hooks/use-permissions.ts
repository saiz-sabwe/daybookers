"use client";

import { useMemo } from "react";
import {
  canAccessDashboard,
  hasAnyPermission,
  hasPermission,
  isPermissionsEnforced,
} from "@/lib/auth/permissions";
import { useClientAuth } from "@/hooks/use-client-auth";
import { DashboardScope, Permission } from "@/types/auth";

export function usePermissions() {
  const { permissions } = useClientAuth();

  return useMemo(
    () => ({
      permissions,
      can: (permission: Permission) => hasPermission(permissions, permission),
      canAny: (required: Permission[]) =>
        hasAnyPermission(permissions, required),
      canAccessDashboard: (scope: DashboardScope) =>
        canAccessDashboard(permissions, scope),
      isEnforced: isPermissionsEnforced(permissions),
    }),
    [permissions],
  );
}
