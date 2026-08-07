"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageLoader } from "@/components/shared/PageLoader";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";
import { useClientAuth } from "@/hooks/use-client-auth";
import { isPartnerRouteAllowedForScope } from "@/lib/auth/page-permissions";

export function PartnerPageGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile, isAuthPending } = useClientAuth();

  const scopeAllowed = isPartnerRouteAllowedForScope(pathname, {
    organizations: userProfile?.organizations,
    hotels: userProfile?.hotels,
  });

  useEffect(() => {
    if (isAuthPending || scopeAllowed) {
      return;
    }
    router.replace("/partner/dashboard");
  }, [isAuthPending, scopeAllowed, router]);

  if (isAuthPending || !scopeAllowed) {
    return <PageLoader message="Vérification des accès..." />;
  }

  return (
    <RequirePagePermission redirectTo="/partner/dashboard">
      {children}
    </RequirePagePermission>
  );
}
