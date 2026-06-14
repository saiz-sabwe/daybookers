"use server";

import { clearServerApiToken } from "@/lib/api/server-auth";

export async function signoutApi(): Promise<void> {
  await clearServerApiToken();
}
