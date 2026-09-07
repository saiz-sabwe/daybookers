const ACCESS_DENIED_KEY = "daybooker_access_denied";

export interface AccessDeniedPayload {
  title: string;
  description: string;
}

export function setAccessDeniedMessage(payload: AccessDeniedPayload): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(ACCESS_DENIED_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode errors
  }
}

export function consumeAccessDeniedMessage(): AccessDeniedPayload | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(ACCESS_DENIED_KEY);
    if (!raw) {
      return null;
    }
    sessionStorage.removeItem(ACCESS_DENIED_KEY);
    const parsed = JSON.parse(raw) as AccessDeniedPayload;
    if (!parsed?.title || !parsed?.description) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
