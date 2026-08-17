import { getApiBaseUrl } from "@/lib/api/config";
import {
  djangoFetch,
  DjangoApiError,
  DjangoPaginatedResponse,
  unwrapListPayload,
} from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";

export type PartnerQueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

function buildQuery(path: string, params?: PartnerQueryParams): string {
  if (!params) {
    return path;
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  if (!query.size) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${query.toString()}`;
}

function resolveNextPath(next: string | null): string | null {
  if (!next) {
    return null;
  }

  const base = getApiBaseUrl();
  if (next.startsWith(base)) {
    return next.slice(base.length);
  }

  try {
    const url = new URL(next);
    return `${url.pathname}${url.search}`;
  } catch {
    return next.startsWith("/") ? next : null;
  }
}

export async function requirePartnerToken(): Promise<string | null> {
  try {
    return (await getServerApiToken()) ?? null;
  } catch {
    return null;
  }
}

export async function fetchPartnerAll<T>(
  token: string,
  path: string,
  params?: PartnerQueryParams,
): Promise<T[]> {
  const results: T[] = [];
  let nextPath: string | null = buildQuery(path, params);

  while (nextPath) {
    const payload: unknown = await djangoFetch<unknown>(nextPath, token);

    const pageResults = unwrapListPayload<T>(payload);
    if (Array.isArray(payload)) {
      return pageResults;
    }

    results.push(...pageResults);
    nextPath =
      payload && typeof payload === "object" && "next" in payload
        ? resolveNextPath((payload as DjangoPaginatedResponse<T>).next)
        : null;
  }

  return results;
}

export async function fetchPartnerPage<T>(
  token: string,
  path: string,
  params?: PartnerQueryParams & { page?: number; pageSize?: number },
): Promise<{ results: T[]; total: number; totalPages: number }> {
  const pageSize = params?.pageSize ?? 10;
  const queryParams: PartnerQueryParams = { ...params };
  if (params?.page) {
    queryParams.page = params.page;
  }
  if (params?.pageSize) {
    queryParams.page_size = params.pageSize;
  }

  const payload = await djangoFetch<DjangoPaginatedResponse<T>>(
    buildQuery(path, queryParams),
    token,
  );

  const results = unwrapListPayload<T>(payload);
  const total =
    payload && typeof payload === "object" && "count" in payload
      ? Number((payload as DjangoPaginatedResponse<T>).count)
      : results.length;

  return {
    results,
    total,
    totalPages: Math.ceil(total / pageSize) || 0,
  };
}

export async function partnerMutate<T>(
  token: string,
  path: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body?: Record<string, unknown>,
): Promise<T> {
  return djangoFetch<T>(path, token, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

export function parsePartnerError(error: unknown): string {
  if (error instanceof DjangoApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur est survenue.";
}

export function formatDateParam(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function slugifyHotelName(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "hotel"}-${Date.now().toString(36)}`;
}
