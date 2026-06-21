"use client";

import { ReactNode } from "react";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";

export function ClientPageGuard({ children }: { children: ReactNode }) {
  return (
    <RequirePagePermission redirectTo="/">
      {children}
    </RequirePagePermission>
  );
}
