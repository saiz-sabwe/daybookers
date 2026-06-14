"use server";

import { getServerApiToken } from "@/lib/api/server-auth";

export async function hasServerSession(): Promise<boolean> {
  const token = await getServerApiToken();
  return Boolean(token);
}
