import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardTheme, getDashboardTheme } from "@/lib/dashboard/themes";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  theme?: DashboardTheme;
  className?: string;
  children?: React.ReactNode;
}

const HEADER_THEMES: Record<
  DashboardTheme,
  {
    border: string;
    gradient: string;
    blur: string;
    iconBg: string;
    iconShadow: string;
  }
> = {
  client: {
    border: "border-gray-100",
    gradient: "from-client-primary-50/80 via-white to-white",
    blur: "bg-client-primary-100/60",
    iconBg: "bg-client-primary-500",
    iconShadow: "shadow-client-primary-500/25",
  },
  partner: {
    border: "border-gray-100",
    gradient: "from-partner-primary-50/80 via-white to-white",
    blur: "bg-partner-primary-100/60",
    iconBg: "bg-partner-primary-500",
    iconShadow: "shadow-partner-primary-500/25",
  },
  sadmin: {
    border: "border-gray-100",
    gradient: "from-admin-primary-50/80 via-white to-white",
    blur: "bg-admin-primary-100/60",
    iconBg: "bg-admin-primary-500",
    iconShadow: "shadow-admin-primary-500/25",
  },
};

export function DashboardPageHeader({
  title,
  description,
  icon: Icon,
  theme = "client",
  className,
  children,
}: DashboardPageHeaderProps) {
  const styles = HEADER_THEMES[theme];
  getDashboardTheme(theme);

  return (
    <div
      className={cn(
        "relative mb-8 overflow-hidden rounded-2xl border bg-white p-6 shadow-sm md:p-8",
        styles.border,
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          styles.gradient,
        )}
      />
      <div
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl",
          styles.blur,
        )}
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md",
                styles.iconBg,
                styles.iconShadow,
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gray-600 md:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
