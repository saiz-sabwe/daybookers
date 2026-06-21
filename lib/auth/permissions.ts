import type { ApiOrganization } from "@/lib/api/user-profile";
import { DashboardScope, Permission } from "@/types/auth";

export const PERMISSIONS_ENFORCEMENT_ENABLED = true;

export interface DashboardAccessContext {
  organizations?: ApiOrganization[];
  permissionCatalog?: Permission[];
}

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
  if (required.length === 0) {
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

export function isPartnerStaff(
  organizations: ApiOrganization[] | undefined,
): boolean {
  return (organizations?.length ?? 0) > 0;
}

export function isGlobalAdmin(
  userPermissions: Permission[],
  catalog: Permission[],
): boolean {
  if (catalog.length === 0) {
    return false;
  }
  const userSet = new Set(userPermissions);
  return catalog.every((permission) => userSet.has(permission));
}

export function canAccessDashboard(
  permissions: Permission[],
  scope: DashboardScope,
  context?: DashboardAccessContext,
): boolean {
  if (scope === "client") {
    return true;
  }

  if (!isPermissionsEnforced(permissions)) {
    return true;
  }

  if (scope === "partner") {
    return isPartnerStaff(context?.organizations);
  }

  if (scope === "sadmin") {
    return isGlobalAdmin(permissions, context?.permissionCatalog ?? []);
  }

  return false;
}

export function parsePermissions(raw: unknown): Permission[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((item): item is Permission => typeof item === "string");
}
