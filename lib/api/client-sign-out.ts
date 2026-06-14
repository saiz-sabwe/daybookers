"use client";

import { signoutApi } from "@/app/actions/auth/signout-api";
import { clearApiSession } from "@/lib/api/auth-storage";

export async function clientSignOut(redirectTo = "/"): Promise<void> {
  clearApiSession();
  await signoutApi();
  window.location.href = redirectTo;
}
