export const PENDING_DJANGO_MESSAGE =
  "Fonctionnalité en cours de migration vers l'API Django.";

export function pendingDjango<T>(fallback: T, feature: string): T {
  console.warn(`[Django pending] ${feature}`);
  return fallback;
}

export function pendingMutation(feature: string): {
  success: false;
  error: string;
} {
  pendingDjango(null, feature);
  return { success: false, error: PENDING_DJANGO_MESSAGE };
}
