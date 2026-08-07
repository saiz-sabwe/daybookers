"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/shared/PageLoader";
import { hasAnyPermission } from "@/lib/auth/permissions";
import { resolveHomeDashboard } from "@/lib/auth/resolve-home-dashboard";
import { useClientAuth } from "@/hooks/use-client-auth";
import { usePermissions } from "@/hooks/use-permissions";
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
  const { isAuthenticated, isAuthPending, userProfile, permissionCatalog } =
    useClientAuth();
  const { permissions, canAccessDashboard, isEnforced } = usePermissions();

  const hasDashboardAccess = canAccessDashboard(dashboard);
  const hasRequiredPermissions =
    !requiredPermissions?.length ||
    hasAnyPermission(permissions, requiredPermissions);
  const isAllowed =
    isAuthenticated &&
    (!isEnforced || (hasDashboardAccess && hasRequiredPermissions));
  const isGateOpen = !isAuthPending && isAllowed;

  const deniedRedirect = useMemo(() => {
    if (!isAuthenticated) {
      return redirectTo;
    }
    return resolveHomeDashboard(
      userProfile,
      permissions,
      permissionCatalog,
    );
  }, [
    isAuthenticated,
    redirectTo,
    userProfile,
    permissions,
    permissionCatalog,
  ]);

  useEffect(() => {
    if (isAuthPending || isAllowed) {
      return;
    }

    router.replace(deniedRedirect);
  }, [isAuthPending, isAllowed, router, deniedRedirect]);

  if (!isGateOpen) {
    return (
      <PageLoader
        message={isAuthPending ? "Chargement..." : "Vérification des accès..."}
      />
    );
  }

  return <>{children}</>;
}
