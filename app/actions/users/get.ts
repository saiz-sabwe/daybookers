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
