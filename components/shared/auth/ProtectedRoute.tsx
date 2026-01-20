"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/better-auth-client";
import { hasAnyPartnerRole, hasAdminRole } from "@/app/actions/users/get";

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
  const { data: session, isPending } = authClient.useSession();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push(redirectTo);
    } else if (session?.user && requiredRole === "partner") {
      setIsCheckingRole(true);
      hasAnyPartnerRole(session.user.id)
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
    } else if (session?.user && requiredRole === "admin") {
      setIsCheckingRole(true);
      hasAdminRole(session.user.id)
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
    } else if (session?.user && requiredRole === "client") {
      // Pour "client", on accepte pour l'instant
      setHasAccess(true);
    } else if (session?.user) {
      setHasAccess(true);
    }
  }, [session, isPending, router, redirectTo, requiredRole]);

  if (isPending || isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-client-primary-500"></div>
      </div>
    );
  }

  if (!session?.user || (requiredRole === "partner" && hasAccess === false)) {
    return null;
  }

  return <>{children}</>;
}

