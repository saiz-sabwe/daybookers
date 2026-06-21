import { Permission } from "@/types/auth";

export type DjangoCrudAction = "view" | "add" | "change" | "delete";

/**
 * Builds a Django permission codename following the default format:
 * `{app_label}.{action}_{model_name}` (model name lowercased).
 *
 * No central registry — reference app + model only where a check is needed.
 */
export function djangoPerm(
  appLabel: string,
  modelName: string,
  action: DjangoCrudAction = "view",
): Permission {
  return `${appLabel}.${action}_${modelName.toLowerCase()}`;
}
