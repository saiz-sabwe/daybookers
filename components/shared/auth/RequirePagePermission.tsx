"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageLoader } from "@/components/shared/PageLoader";
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
    router.replace(resolvedRedirect);
  }, [isAuthPending, isAllowed, router, resolvedRedirect]);

  if (!isGateOpen) {
    return <PageLoader message="Vérification des accès..." />;
  }

  return <>{children}</>;
}
