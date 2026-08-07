"use server";

import { mapAdminUser } from "@/lib/api/admin/mappers";
import { loadAllProfiles } from "@/lib/api/admin/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";
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
