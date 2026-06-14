"use server";

import { getApiBaseUrl } from "@/lib/api/config";

export interface SigninInput {
  email: string;
  password: string;
}

export interface SigninResult {
  success: boolean;
  token?: string;
  error?: string;
}

function parseSigninError(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Email ou mot de passe incorrect.";
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

  return messages.length > 0 ? messages.join(" ") : "Email ou mot de passe incorrect.";
}

export async function signin(input: SigninInput): Promise<SigninResult> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/accounts/auth/signin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: input.email,
        password: input.password,
      }),
      cache: "no-store",
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: parseSigninError(payload),
      };
    }

    const token =
      payload && typeof payload === "object" && typeof (payload as { token?: unknown }).token === "string"
        ? (payload as { token: string }).token
        : null;

    if (!token) {
      return {
        success: false,
        error: "Réponse de connexion invalide (token manquant).",
      };
    }

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error("Erreur signin Django:", error);
    return {
      success: false,
      error: "Impossible de contacter le serveur. Vérifiez que l'API Django est démarrée.",
    };
  }
}
