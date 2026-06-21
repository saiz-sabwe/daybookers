export type DashboardScope = "client" | "partner" | "sadmin";

/** Django permission codename as returned by the backend (app_label.codename). */
export type Permission = string;

export interface UserAuthContext {
  permissions: Permission[];
}
