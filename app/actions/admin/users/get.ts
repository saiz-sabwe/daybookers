"use server";

import {
  mapAdminUser,
} from "@/lib/api/admin/mappers";
import {
  fetchPartnerPage,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";
import { DjangoAdminProfileRecord } from "@/lib/api/django-client";

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

    const { results, total, totalPages } = await fetchPartnerPage<DjangoAdminProfileRecord>(
      token,
      "/api/accounts/profiles/",
      {
        admin_scope: true,
        ...(params.search ? { search: params.search } : {}),
        page,
        pageSize,
      },
    );

    let users = results.map(mapAdminUser);

    return { users, total, totalPages };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { users: [], total: 0, totalPages: 0 };
  }
}
