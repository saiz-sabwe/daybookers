"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageLoader } from "@/components/shared/PageLoader";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/hooks/use-client-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { getPagePermissions } from "@/lib/auth/page-permissions";
import { Permission } from "@/types/auth";

interface RequirePagePermissionProps {
  children: ReactNode;
  permissions?: Permission[];
  redirectTo?: string;
}

export function RequirePagePermission({
  children,
  permissions,
  redirectTo = "/dashboard",
}: RequirePagePermissionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const notifiedRef = useRef(false);
  const { isAuthPending } = useClientAuth();
  const { canAny, isEnforced } = usePermissions();

  const required =
    permissions ?? getPagePermissions(pathname, searchParams) ?? [];
  const isAllowed = !isEnforced || !required.length || canAny(required);
  const isGateOpen = !isAuthPending && isAllowed;

  const currentPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const resolvedRedirect =
    redirectTo === currentPath || redirectTo === pathname ? "/" : redirectTo;

  useEffect(() => {
    if (isAuthPending || isAllowed) {
      return;
    }

    if (!notifiedRef.current) {
      notifiedRef.current = true;
      console.warn("[DayBooker] Accès refusé", {
        path: currentPath,
        requiredPermissions: required,
      });
      toast({
        title: "Erreur de permission",
        description: "Vous n'avez pas l'autorisation d'accéder à cette page.",
        variant: "destructive",
        duration: 5000,
      });
    }

    router.replace(resolvedRedirect);
  }, [
    isAuthPending,
    isAllowed,
    router,
    resolvedRedirect,
    toast,
    required,
  ]);

  if (!isGateOpen) {
    return (
      <PageLoader
        message={
          isAuthPending
            ? "Vérification des accès..."
            : "Accès refusé — redirection..."
        }
      />
    );
  }

  return <>{children}</>;
}
