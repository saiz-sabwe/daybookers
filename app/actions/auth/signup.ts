"use server";

import { getApiBaseUrl } from "@/lib/api/config";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface SignupProfile {
  id: number;
  user: number;
  kind: string;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  pseudo: string | null;
  email: string | null;
  address: string | null;
}

export interface SignupResult {
  success: boolean;
  profile?: SignupProfile;
  error?: string;
}

function splitFullName(fullName: string): {
  first_name: string;
  last_name: string | null;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { first_name: "", last_name: null };
  }

  if (parts.length === 1) {
    return { first_name: parts[0], last_name: null };
  }

  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
}

function parseSignupError(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Une erreur est survenue lors de la création du compte.";
  }

  const data = payload as Record<string, unknown>;

  if (typeof data.detail === "string") {
    return data.detail;
  }

  const messages: string[] = [];

  for (const value of Object.values(data)) {
    if (typeof value === "string") {
      messages.push(value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          messages.push(item);
        }
      }
    }
  }

  return messages.length > 0
    ? messages.join(" ")
    : "Une erreur est survenue lors de la création du compte.";
}

export async function signup(input: SignupInput): Promise<SignupResult> {
  const { first_name, last_name } = splitFullName(input.name);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/accounts/auth/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: input.email,
        password: input.password,
        email: input.email,
        first_name,
        last_name,
        phone: input.phone || null,
      }),
      cache: "no-store",
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: parseSignupError(payload),
      };
    }

    return {
      success: true,
      profile: payload as SignupProfile,
    };
  } catch (error) {
    console.error("Erreur signup Django:", error);
    return {
      success: false,
      error: "Impossible de contacter le serveur. Vérifiez que l'API Django est démarrée.",
    };
  }
}
