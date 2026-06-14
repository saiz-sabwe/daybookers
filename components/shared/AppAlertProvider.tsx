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
  { icon: typeof CheckCircle2; border: string; iconClass: string; titleClass: string }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-green-200",
    iconClass: "text-green-600",
    titleClass: "text-green-900",
  },
  error: {
    icon: XCircle,
    border: "border-red-200",
    iconClass: "text-red-600",
    titleClass: "text-red-900",
  },
  info: {
    icon: Info,
    border: "border-blue-200",
    iconClass: "text-blue-600",
    titleClass: "text-blue-900",
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
        "pointer-events-auto w-full max-w-sm rounded-lg border bg-white p-4 shadow-lg animate-in slide-in-from-right-full fade-in duration-300",
        styles.border,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", styles.iconClass)} />
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", styles.titleClass)}>
            {toast.title}
          </p>
          {toast.description ? (
            <p className="mt-1 text-sm text-gray-600">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
