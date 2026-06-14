"use client";

import { useAppAlert, type AppAlertVariant } from "@/components/shared/AppAlertProvider";

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

function mapVariant(variant: ToastVariant): AppAlertVariant {
  switch (variant) {
    case "success":
      return "success";
    case "destructive":
      return "error";
    case "warning":
    case "info":
    case "default":
    default:
      return "info";
  }
}

export function useToast() {
  const { showAlert } = useAppAlert();

  const toast = ({ title, description, variant = "default", duration = 4000 }: ToastOptions) => {
    showAlert({
      variant: mapVariant(variant),
      title: title || (variant === "destructive" ? "Erreur" : "Information"),
      description,
      duration,
    });
  };

  return { toast };
}
