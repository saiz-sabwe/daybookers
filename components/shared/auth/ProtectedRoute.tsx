"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageLoader } from "@/components/shared/PageLoader";
import { useToast } from "@/hooks/use-toast";
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

function dashboardLabel(dashboard: DashboardScope): string {
  switch (dashboard) {
    case "sadmin":
      return "administration";
    case "partner":
      return "partenaire";
    case "client":
    default:
      return "client";
  }
}

export function ProtectedRoute({
  children,
  dashboard,
  requiredPermissions,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const notifiedRef = useRef(false);
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
    const home = resolveHomeDashboard(
      userProfile,
      permissions,
      permissionCatalog,
    );
    if (home === pathname) {
      return "/";
    }
    return home;
  }, [
    isAuthenticated,
    redirectTo,
    userProfile,
    permissions,
    permissionCatalog,
    pathname,
  ]);

  useEffect(() => {
    if (isAuthPending || isAllowed) {
      return;
    }

    if (!notifiedRef.current) {
      notifiedRef.current = true;
      if (!isAuthenticated) {
        toast({
          title: "Connexion requise",
          description: "Connectez-vous pour continuer.",
          variant: "warning",
          duration: 5000,
        });
      } else {
        console.warn("[DayBooker] Accès refusé au tableau de bord", {
          dashboard: dashboardLabel(dashboard),
          path: pathname,
          requiredPermissions: requiredPermissions ?? [],
          userPermissions: permissions,
        });
        toast({
          title: "Erreur de permission",
          description: "Vous n'avez pas l'autorisation d'accéder à cette page.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }

    router.replace(deniedRedirect);
  }, [
    isAuthPending,
    isAllowed,
    isAuthenticated,
    router,
    deniedRedirect,
    toast,
    dashboard,
  ]);

  if (!isGateOpen) {
    return (
      <PageLoader
        message={
          isAuthPending
            ? "Chargement..."
            : isAuthenticated
              ? "Accès refusé — redirection..."
              : "Connexion requise..."
        }
      />
    );
  }

  return <>{children}</>;
}
