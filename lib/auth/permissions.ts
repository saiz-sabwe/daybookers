import {
  DashboardScope,
  PARTNER_DASHBOARD_PERMISSIONS,
  Permission,
  SADMIN_DASHBOARD_PERMISSIONS,
} from "@/types/auth";

/**
 * Phase 1: enforcement disabled — all permission checks pass.
 * Phase 2: set to true when the official permission list is wired from /me.
 */
export const PERMISSIONS_ENFORCEMENT_ENABLED = false;

export function isPermissionsEnforced(_permissions: Permission[]): boolean {
  return PERMISSIONS_ENFORCEMENT_ENABLED;
}

export function hasPermission(
  permissions: Permission[],
  required: Permission,
): boolean {
  if (!isPermissionsEnforced(permissions)) {
    return true;
  }
  return permissions.includes(required);
}

export function hasAnyPermission(
  permissions: Permission[],
  required: Permission[],
): boolean {
  if (!isPermissionsEnforced(permissions)) {
    return true;
  }
  return required.some((p) => permissions.includes(p));
}

export function hasAllPermissions(
  permissions: Permission[],
  required: Permission[],
): boolean {
  if (!isPermissionsEnforced(permissions)) {
    return true;
  }
  return required.every((p) => permissions.includes(p));
}

const DASHBOARD_ACCESS_PERMISSIONS: Record<
  Exclude<DashboardScope, "client">,
  Permission[]
> = {
  partner: PARTNER_DASHBOARD_PERMISSIONS,
  sadmin: SADMIN_DASHBOARD_PERMISSIONS,
};

export function canAccessDashboard(
  permissions: Permission[],
  scope: DashboardScope,
): boolean {
  if (scope === "client") {
    return true;
  }

  if (!isPermissionsEnforced(permissions)) {
    return true;
  }

  const required = DASHBOARD_ACCESS_PERMISSIONS[scope];
  return hasAnyPermission(permissions, required);
}

export function parsePermissions(raw: unknown): Permission[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((item): item is Permission => typeof item === "string");
}
