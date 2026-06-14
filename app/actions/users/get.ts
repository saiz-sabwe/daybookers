"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export async function getUserById(_userId: string): Promise<AppUser | null> {
  return pendingDjango(null, "users.getUserById");
}

export async function hasRole(
  _userId: string,
  _role: string,
): Promise<boolean> {
  return false;
}

export async function hasAnyPartnerRole(_userId: string): Promise<boolean> {
  return false;
}

export async function hasAdminRole(_userId: string): Promise<boolean> {
  return false;
}
