import type { ApiHotel, ApiOrganization } from "@/lib/api/user-profile";
import { djangoPerm } from "@/lib/auth/django-perm";
import { DashboardScope, Permission } from "@/types/auth";

export const PERMISSIONS_ENFORCEMENT_ENABLED = true;

export interface DashboardAccessContext {
  organizations?: ApiOrganization[];
  hotels?: ApiHotel[];
  permissionCatalog?: Permission[];
  /** Permissions Django de l'utilisateur connecté (ex: "hotels.add_roomtype"). */
  userPermissions?: Permission[];
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
  hotels: ApiHotel[] | undefined = undefined,
): boolean {
  return (organizations?.length ?? 0) > 0 || (hotels?.length ?? 0) > 0;
}

export function isGroupManager(permissions: Permission[]): boolean {
  return hasPermission(permissions, djangoPerm("profils", "organization"));
}

/**
 * Scope "manager de groupe" : seul le rôle GroupManager (et l'admin) possède
 * la permission profils.view_organization. Repli sur le nombre
 * d'organisations si les permissions ne sont pas fournies.
 */
export function isGroupManagerScope(context?: DashboardAccessContext): boolean {
  if (context?.userPermissions) {
    return hasPermission(
      context.userPermissions,
      djangoPerm("profils", "organization"),
    );
  }
  return (context?.organizations?.length ?? 0) > 0;
}

/**
 * Scope "manager" (HotelManager OU GroupManager) : peut gérer des chambres
 * (hotels.add_roomtype) ou des enseignes (profils.view_organization).
 * Le réceptionniste n'a aucune de ces permissions.
 */
export function isPartnerManagerScope(
  context?: DashboardAccessContext,
): boolean {
  if (context?.userPermissions) {
    return hasAnyPermission(context.userPermissions, [
      djangoPerm("hotels", "roomtype", "add"),
      djangoPerm("profils", "organization"),
    ]);
  }
  return (context?.organizations?.length ?? 0) > 0;
}

export function isHotelStaffScope(context?: DashboardAccessContext): boolean {
  return (
    (context?.hotels?.length ?? 0) > 0 &&
    (context?.organizations?.length ?? 0) === 0
  );
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
    if (!isPermissionsEnforced(permissions)) {
      return true;
    }
    if (isGlobalAdmin(permissions, context?.permissionCatalog ?? [])) {
      return false;
    }
    if (isPartnerStaff(context?.organizations, context?.hotels)) {
      return false;
    }
    return true;
  }

  if (!isPermissionsEnforced(permissions)) {
    return true;
  }

  if (scope === "partner") {
    return isPartnerStaff(context?.organizations, context?.hotels);
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
