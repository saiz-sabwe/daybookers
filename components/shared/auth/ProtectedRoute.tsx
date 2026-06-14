"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasAnyPartnerRole, hasAdminRole } from "@/app/actions/users/get";
import { useClientAuth } from "@/hooks/use-client-auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "client" | "partner" | "admin";
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (requiredRole === "partner") {
      setIsCheckingRole(true);
      hasAnyPartnerRole("")
        .then((hasRole) => {
          if (!hasRole) {
            router.push(redirectTo);
          } else {
            setHasAccess(true);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la vérification du rôle:", error);
          router.push(redirectTo);
        })
        .finally(() => {
          setIsCheckingRole(false);
        });
    } else if (requiredRole === "admin") {
      setIsCheckingRole(true);
      hasAdminRole("")
        .then((hasRole) => {
          if (!hasRole) {
            router.push(redirectTo);
          } else {
            setHasAccess(true);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la vérification du rôle admin:", error);
          router.push(redirectTo);
        })
        .finally(() => {
          setIsCheckingRole(false);
        });
    } else {
      setHasAccess(true);
    }
  }, [isAuthenticated, isAuthPending, router, redirectTo, requiredRole]);

  if (isAuthPending || isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-client-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole === "partner" && hasAccess === false)) {
    return null;
  }

  return <>{children}</>;
}
