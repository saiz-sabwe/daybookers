"use server";

import { pendingDjango } from "@/lib/api/pending-django";

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
  userId: string,
  params: GetAllUsersParams = {}
): Promise<{
  users: UserListItem[];
  total: number;
  totalPages: number;
}> {
  return pendingDjango({ users: [], total: 0, totalPages: 0 }, "admin.users.getAll");
}
