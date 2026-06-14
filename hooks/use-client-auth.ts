"use client";

import { useEffect, useState } from "react";
import { getCurrentProfile } from "@/app/actions/auth/get-current-profile";
import { hasServerSession } from "@/app/actions/auth/session";
import {
  getStoredApiUserEmail,
  getStoredUserProfile,
  hasApiSession,
  storeUserProfile,
} from "@/lib/api/auth-storage";
import {
  getUserDisplayName,
  StoredUserProfile,
} from "@/lib/api/user-profile";
import { Permission } from "@/types/auth";

export function useClientAuth() {
  const [apiSessionReady, setApiSessionReady] = useState(false);
  const [hasDjangoSession, setHasDjangoSession] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<StoredUserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveSession() {
      const localSession = hasApiSession();
      const storedProfile = getStoredUserProfile();

      if (localSession) {
        if (!cancelled) {
          setHasDjangoSession(true);
          setUserEmail(getStoredApiUserEmail());
          setUserProfile(storedProfile);
          setApiSessionReady(true);
        }
        return;
      }

      try {
        const serverSession = await hasServerSession();
        if (!serverSession) {
          if (!cancelled) {
            setHasDjangoSession(false);
            setUserEmail(null);
            setUserProfile(null);
            setApiSessionReady(true);
          }
          return;
        }

        const profile = storedProfile ?? (await getCurrentProfile());
        if (profile) {
          storeUserProfile(profile);
        }

        if (!cancelled) {
          setHasDjangoSession(true);
          setUserEmail(profile?.email ?? getStoredApiUserEmail());
          setUserProfile(profile);
          setApiSessionReady(true);
        }
      } catch {
        if (!cancelled) {
          setHasDjangoSession(false);
          setUserEmail(null);
          setUserProfile(null);
          setApiSessionReady(true);
        }
      }
    }

    resolveSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const userName = getUserDisplayName(userProfile, userEmail);
  const permissions: Permission[] = userProfile?.permissions ?? [];

  return {
    isAuthenticated: hasDjangoSession,
    isAuthPending: !apiSessionReady,
    userEmail,
    userProfile,
    userName,
    permissions,
  };
}
