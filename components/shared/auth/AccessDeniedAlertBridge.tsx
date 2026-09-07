"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { consumeAccessDeniedMessage } from "@/lib/auth/access-denied";

/** Affiche le message d'accès refusé après redirection (sessionStorage). */
export function AccessDeniedAlertBridge() {
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const payload = consumeAccessDeniedMessage();
    if (!payload) {
      return;
    }
    toast({
      title: payload.title,
      description: payload.description,
      variant: "destructive",
      duration: 8000,
    });
  }, [pathname, toast]);

  return null;
}
