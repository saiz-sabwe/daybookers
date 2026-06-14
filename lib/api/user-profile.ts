export interface ApiUserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  pseudo: string | null;
  email: string | null;
  phone?: string | null;
}

export interface StoredUserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  pseudo: string | null;
  email: string | null;
  phone: string | null;
}

export function mapApiUserProfile(
  profile: ApiUserProfile | Record<string, unknown>,
): StoredUserProfile {
  return {
    id: String(profile.id ?? ""),
    firstName:
      typeof profile.first_name === "string" ? profile.first_name : null,
    lastName: typeof profile.last_name === "string" ? profile.last_name : null,
    pseudo: typeof profile.pseudo === "string" ? profile.pseudo : null,
    email: typeof profile.email === "string" ? profile.email : null,
    phone: typeof profile.phone === "string" ? profile.phone : null,
  };
}

export function getUserDisplayName(
  profile: StoredUserProfile | null | undefined,
  fallbackEmail?: string | null,
): string {
  if (profile) {
    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fullName) {
      return fullName;
    }
    if (profile.pseudo?.trim()) {
      return profile.pseudo.trim();
    }
    if (profile.email?.split("@")[0]) {
      return profile.email.split("@")[0];
    }
  }

  if (fallbackEmail?.split("@")[0]) {
    return fallbackEmail.split("@")[0];
  }

  return "Utilisateur";
}
