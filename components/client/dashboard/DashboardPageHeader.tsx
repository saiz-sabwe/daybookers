import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  icon: Icon,
  className,
  children,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        "relative mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-client-primary-50/80 via-white to-white" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-client-primary-100/60 blur-2xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-client-primary-500 text-white shadow-md shadow-client-primary-500/25">
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
