"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  canAccessDashboard,
  hasAnyPermission,
  isPermissionsEnforced,
} from "@/lib/auth/permissions";
import { useClientAuth } from "@/hooks/use-client-auth";
import { DashboardScope, Permission } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  dashboard: DashboardScope;
  requiredPermissions?: Permission[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  dashboard,
  requiredPermissions,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthPending, permissions } = useClientAuth();

  const enforced = isPermissionsEnforced(permissions);
  const hasDashboardAccess = canAccessDashboard(permissions, dashboard);
  const hasRequiredPermissions =
    !requiredPermissions?.length ||
    hasAnyPermission(permissions, requiredPermissions);
  const isAllowed =
    isAuthenticated &&
    (!enforced || (hasDashboardAccess && hasRequiredPermissions));

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    if (!isAuthenticated || !isAllowed) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isAuthPending, isAllowed, router, redirectTo]);

  if (isAuthPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-client-primary-500"></div>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
