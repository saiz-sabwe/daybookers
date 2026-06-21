"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  useEffect(() => {
    if (isAuthPending || isAllowed) {
      return;
    }
    router.push(redirectTo);
  }, [isAuthPending, isAllowed, router, redirectTo]);

  if (isAuthPending) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-client-primary-500" />
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
