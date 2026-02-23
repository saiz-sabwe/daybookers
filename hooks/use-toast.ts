"use client";

import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  /** Durée d'affichage en ms (ex: 1500 = 1,5 s). Par défaut celle du Toaster. */
  duration?: number;
}

export function useToast() {
  const toast = ({ title, description, variant = "default", duration }: ToastOptions) => {
    const message = title && description ? `${title}: ${description}` : title || description || "";
    const options = duration !== undefined ? { duration } : undefined;

    switch (variant) {
      case "success":
        sonnerToast.success(message, options);
        break;
      case "destructive":
        sonnerToast.error(message, options);
        break;
      case "warning":
        sonnerToast.warning(message, options);
        break;
      case "info":
        sonnerToast.info(message, options);
        break;
      default:
        sonnerToast(message, options);
    }
  };

  return { toast };
}

