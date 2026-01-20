"use client";

import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    const message = title && description ? `${title}: ${description}` : title || description || "";

    switch (variant) {
      case "success":
        sonnerToast.success(message);
        break;
      case "destructive":
        sonnerToast.error(message);
        break;
      case "warning":
        sonnerToast.warning(message);
        break;
      case "info":
        sonnerToast.info(message);
        break;
      default:
        sonnerToast(message);
    }
  };

  return { toast };
}

