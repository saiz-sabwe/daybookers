"use server";

import { mapAdminUser } from "@/lib/api/admin/mappers";
import { loadAllProfiles } from "@/lib/api/admin/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";
import { djangoFetch } from "@/lib/api/django-client";

export interface GetAllUsersParams {
  role?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  roles: string[];
  role: string;
  createdAt: Date;
  emailVerified: boolean;
}

export async function getAllUsers(
  _userId: string,
  params: GetAllUsersParams = {},
): Promise<{
  users: UserListItem[];
  total: number;
  totalPages: number;
}> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { users: [], total: 0, totalPages: 0 };
    }

    const pageSize = params.pageSize ?? 10;
    const page = params.page ?? 1;

    const records = await loadAllProfiles(token);
    const searchTerm = params.search?.trim().toLowerCase();

    let allUsers = records.map(mapAdminUser);
    if (searchTerm) {
      allUsers = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm),
      );
    }

    const total = allUsers.length;
    const totalPages = Math.ceil(total / pageSize) || 0;
    const start = (page - 1) * pageSize;
    const users = allUsers.slice(start, start + pageSize);

    return { users, total, totalPages };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { users: [], total: 0, totalPages: 0 };
  }
}

export interface AdminUserOrganization {
  uuid: string;
  name: string;
}

export interface AdminUserDetail {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  email: string;
  phone: string;
  address: string;
  kind: string;
  isStaff: boolean;
  isSuperuser: boolean;
  isActive: boolean;
  hasOrganization: boolean;
  role: string;
  organizations: AdminUserOrganization[];
  createdAt: string | null;
}

interface DjangoAdminProfileDetailRecord {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  pseudo?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  kind?: string | null;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
  has_organization?: boolean;
  role?: string | null;
  organizations?: AdminUserOrganization[];
  create?: string | null;
}

export async function getAdminUserById(
  profileId: string,
): Promise<AdminUserDetail | null> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return null;
    }

    const record = await djangoFetch<DjangoAdminProfileDetailRecord>(
      `/api/accounts/profiles/${profileId}/`,
      token,
    );

    return {
      id: String(record.id),
      username: record.username ?? "",
      firstName: record.first_name ?? "",
      lastName: record.last_name ?? "",
      pseudo: record.pseudo ?? "",
      email: record.email ?? "",
      phone: record.phone ?? "",
      address: record.address ?? "",
      kind: record.kind ?? "",
      isStaff: Boolean(record.is_staff),
      isSuperuser: Boolean(record.is_superuser),
      isActive: record.is_active ?? true,
      hasOrganization: Boolean(record.has_organization),
      role: record.role ?? "",
      organizations: record.organizations ?? [],
      createdAt: record.create ?? null,
    };
  } catch (error) {
    console.error("Error fetching admin user detail:", error);
    return null;
  }
}
