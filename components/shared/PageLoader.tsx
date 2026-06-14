"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  fullscreen?: boolean;
  message?: string;
  className?: string;
}

export function PageLoader({
  fullscreen = true,
  message = "Chargement...",
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullscreen && "fixed inset-0 z-[90] bg-white/70 backdrop-blur-[2px]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-10 w-10 animate-spin text-client-primary-600" />
      {message ? (
        <p className="text-sm font-medium text-gray-600">{message}</p>
      ) : null}
    </div>
  );
}
