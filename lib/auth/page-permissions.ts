import { djangoPerm } from "@/lib/auth/django-perm";
import {
  CLIENT_NAV_ITEMS,
  NavItemWithPermissions,
  PARTNER_NAV_ITEMS,
  SADMIN_NAV_ITEMS,
} from "@/lib/auth/route-permissions";
import { Permission } from "@/types/auth";

interface RoutePattern {
  pattern: RegExp;
  permissions: Permission[];
}

function navItemsToExactMap(
  items: NavItemWithPermissions[],
): Map<string, Permission[]> {
  const map = new Map<string, Permission[]>();
  for (const item of items) {
    const [path] = item.href.split("?");
    if (item.requiredPermissions?.length) {
      map.set(path, item.requiredPermissions);
    }
  }
  return map;
}

const EXACT_ROUTE_PERMISSIONS = new Map<string, Permission[]>([
  ...navItemsToExactMap(PARTNER_NAV_ITEMS),
  ...navItemsToExactMap(SADMIN_NAV_ITEMS),
  ...navItemsToExactMap(CLIENT_NAV_ITEMS),
  ["/admin/hotels/create", [djangoPerm("hotels", "hotel", "add")]],
  ["/booking", [djangoPerm("hotels", "booking", "add")]],
  ["/reviews", [djangoPerm("hotels", "review", "add")]],
]);

const PREFIX_ROUTE_PERMISSIONS: RoutePattern[] = [
  {
    pattern: /^\/partner\/hotels\/[^/]+$/,
    permissions: [djangoPerm("hotels", "hotel")],
  },
];

const CLIENT_TAB_PERMISSIONS: Record<string, Permission[]> = {
  favorites: [djangoPerm("hotels", "favorite")],
  profile: [djangoPerm("profils", "profile")],
};

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function getClientTabPermissions(tab: string | null): Permission[] | null {
  if (!tab || tab === "bookings") {
    return [djangoPerm("hotels", "booking")];
  }
  return CLIENT_TAB_PERMISSIONS[tab] ?? null;
}

export function getPagePermissions(
  pathname: string,
  searchParams?: URLSearchParams | { get: (key: string) => string | null },
): Permission[] | null {
  const normalized = normalizePathname(pathname);

  if (normalized === "/dashboard") {
    const tab = searchParams?.get("tab") ?? null;
    return getClientTabPermissions(tab);
  }

  const exact = EXACT_ROUTE_PERMISSIONS.get(normalized);
  if (exact) {
    return exact;
  }

  for (const { pattern, permissions } of PREFIX_ROUTE_PERMISSIONS) {
    if (pattern.test(normalized)) {
      return permissions;
    }
  }

  return null;
}
