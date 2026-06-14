"use client";

import { API_TOKEN_KEY, API_USER_EMAIL_KEY, API_USER_PROFILE_KEY } from "@/lib/api/constants";
import {
  mapApiUserProfile,
  StoredUserProfile,
} from "@/lib/api/user-profile";

export function getStoredApiToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(API_TOKEN_KEY);
}

export function getStoredApiUserEmail(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(API_USER_EMAIL_KEY);
}

export function getStoredUserProfile(): StoredUserProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(API_USER_PROFILE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredUserProfile;
    if (!parsed || typeof parsed !== "object" || !parsed.id) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function storeApiSession(
  token: string,
  profile: StoredUserProfile,
): void {
  localStorage.setItem(API_TOKEN_KEY, token);
  localStorage.setItem(
    API_USER_EMAIL_KEY,
    profile.email ?? "",
  );
  localStorage.setItem(API_USER_PROFILE_KEY, JSON.stringify(profile));
}

export function storeUserProfile(profile: StoredUserProfile): void {
  localStorage.setItem(API_USER_PROFILE_KEY, JSON.stringify(profile));
  if (profile.email) {
    localStorage.setItem(API_USER_EMAIL_KEY, profile.email);
  }
}

export function clearApiSession(): void {
  localStorage.removeItem(API_TOKEN_KEY);
  localStorage.removeItem(API_USER_EMAIL_KEY);
  localStorage.removeItem(API_USER_PROFILE_KEY);
}

export function hasApiSession(): boolean {
  return Boolean(getStoredApiToken());
}

export { mapApiUserProfile };
