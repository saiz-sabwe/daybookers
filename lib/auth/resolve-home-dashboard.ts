import {
  isGlobalAdmin,
  isPartnerStaff,
} from "@/lib/auth/permissions";
import { StoredUserProfile } from "@/lib/api/user-profile";
import { Permission } from "@/types/auth";

export function resolveHomeDashboard(
  profile: StoredUserProfile | null | undefined,
  permissions: Permission[],
  permissionCatalog: Permission[] = [],
): string {
  if (isGlobalAdmin(permissions, permissionCatalog)) {
    return "/admin/dashboard";
  }

  if (isPartnerStaff(profile?.organizations, profile?.hotels)) {
    return "/partner/dashboard";
  }

  return "/dashboard";
}
