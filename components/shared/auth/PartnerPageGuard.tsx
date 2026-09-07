"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageLoader } from "@/components/shared/PageLoader";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/hooks/use-client-auth";
import { isPartnerRouteAllowedForScope } from "@/lib/auth/page-permissions";

export function PartnerPageGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const notifiedRef = useRef(false);
  const { userProfile, isAuthPending } = useClientAuth();

  const scopeAllowed = isPartnerRouteAllowedForScope(pathname, {
    organizations: userProfile?.organizations,
    hotels: userProfile?.hotels,
  });

  useEffect(() => {
    if (isAuthPending || scopeAllowed) {
      return;
    }
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      console.warn("[DayBooker] Accès refusé (périmètre partenaire)", {
        path: pathname,
      });
      toast({
        title: "Erreur de permission",
        description: "Vous n'avez pas l'autorisation d'accéder à cette page.",
        variant: "destructive",
        duration: 5000,
      });
    }
    router.replace("/partner/dashboard");
  }, [isAuthPending, scopeAllowed, router, toast]);

  if (isAuthPending || !scopeAllowed) {
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

  return (
    <RequirePagePermission redirectTo="/partner/dashboard">
      {children}
    </RequirePagePermission>
  );
}
