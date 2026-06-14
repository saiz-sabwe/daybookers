"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppAlertVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  variant: AppAlertVariant;
  title: string;
  description?: string;
  duration: number;
}

interface ShowAlertOptions {
  variant?: AppAlertVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface AppAlertContextValue {
  showAlert: (options: ShowAlertOptions) => void;
}

const AppAlertContext = createContext<AppAlertContextValue | null>(null);

const variantStyles: Record<
  AppAlertVariant,
  {
    icon: typeof CheckCircle2;
    container: string;
    iconWrap: string;
    iconClass: string;
    titleClass: string;
    descriptionClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    container:
      "border-l-4 border-l-green-500 border border-green-200 bg-green-50 shadow-xl shadow-green-900/15 ring-1 ring-green-100",
    iconWrap: "bg-green-100 ring-1 ring-green-200",
    iconClass: "text-green-700",
    titleClass: "text-green-950",
    descriptionClass: "text-green-800",
  },
  error: {
    icon: XCircle,
    container:
      "border-l-4 border-l-red-500 border border-red-200 bg-red-50 shadow-xl shadow-red-900/15 ring-1 ring-red-100",
    iconWrap: "bg-red-100 ring-1 ring-red-200",
    iconClass: "text-red-700",
    titleClass: "text-red-950",
    descriptionClass: "text-red-800",
  },
  info: {
    icon: Info,
    container:
      "border-l-4 border-l-blue-500 border border-blue-200 bg-blue-50 shadow-xl shadow-blue-900/15 ring-1 ring-blue-100",
    iconWrap: "bg-blue-100 ring-1 ring-blue-200",
    iconClass: "text-blue-700",
    titleClass: "text-blue-950",
    descriptionClass: "text-blue-800",
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const styles = variantStyles[toast.variant];
  const Icon = styles.icon;

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(timer);
  }, [toast.duration, toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-xl p-4 animate-in slide-in-from-right-full fade-in duration-300",
        styles.container,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            styles.iconWrap,
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconClass)} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className={cn("text-sm font-semibold leading-snug", styles.titleClass)}>
            {toast.title}
          </p>
          {toast.description ? (
            <p className={cn("mt-1 text-sm leading-relaxed", styles.descriptionClass)}>
              {toast.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={cn(
            "shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100",
            styles.iconClass,
          )}
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AppAlertProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showAlert = useCallback(
    ({ variant = "info", title, description, duration = 4000 }: ShowAlertOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [
        ...current.slice(-2),
        { id, variant, title, description, duration },
      ]);
    },
    [],
  );

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AppAlertContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-20 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </AppAlertContext.Provider>
  );
}

export function useAppAlert() {
  const context = useContext(AppAlertContext);
  if (!context) {
    throw new Error("useAppAlert must be used within AppAlertProvider");
  }
  return context;
}
