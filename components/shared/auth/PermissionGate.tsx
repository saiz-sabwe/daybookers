"use client";

import { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { Permission } from "@/types/auth";

interface PermissionGateProps {
  children: ReactNode;
  permissions: Permission[];
  fallback?: ReactNode;
}

export function PermissionGate({
  children,
  permissions: required,
  fallback = null,
}: PermissionGateProps) {
  const { canAny } = usePermissions();

  if (!canAny(required)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
