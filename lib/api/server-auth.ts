import { cookies } from "next/headers";

export const API_TOKEN_COOKIE = "daybooker_api_token";

export async function getServerApiToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(API_TOKEN_COOKIE)?.value;
}

export async function setServerApiToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(API_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearServerApiToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(API_TOKEN_COOKIE);
}
