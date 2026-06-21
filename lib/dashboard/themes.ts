export type DashboardScope = "client" | "partner" | "sadmin";

export type DashboardTheme = DashboardScope;

export interface DashboardThemeConfig {
  scopeLabel: string;
  spaceLabel: string;
  logoHref: string;
  themeClass: string;
  primary: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
}

export const DASHBOARD_THEMES: Record<DashboardTheme, DashboardThemeConfig> = {
  client: {
    scopeLabel: "Client",
    spaceLabel: "Espace client",
    logoHref: "/",
    themeClass: "theme-client",
    primary: {
      50: "bg-client-primary-50",
      100: "bg-client-primary-100",
      500: "bg-client-primary-500",
      600: "text-client-primary-600",
      700: "text-client-primary-700",
    },
  },
  partner: {
    scopeLabel: "Organisation",
    spaceLabel: "Espace organisation",
    logoHref: "/partner/dashboard",
    themeClass: "theme-partner",
    primary: {
      50: "bg-partner-primary-50",
      100: "bg-partner-primary-100",
      500: "bg-partner-primary-500",
      600: "text-partner-primary-600",
      700: "text-partner-primary-700",
    },
  },
  sadmin: {
    scopeLabel: "Super Admin",
    spaceLabel: "Super Admin",
    logoHref: "/admin/dashboard",
    themeClass: "theme-admin",
    primary: {
      50: "bg-admin-primary-50",
      100: "bg-admin-primary-100",
      500: "bg-admin-primary-500",
      600: "text-admin-primary-600",
      700: "text-admin-primary-700",
    },
  },
};

export function getDashboardTheme(theme: DashboardTheme): DashboardThemeConfig {
  return DASHBOARD_THEMES[theme];
}
