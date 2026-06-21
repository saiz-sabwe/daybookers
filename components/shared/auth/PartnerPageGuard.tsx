"use client";

import { ReactNode } from "react";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";

export function PartnerPageGuard({ children }: { children: ReactNode }) {
  return (
    <RequirePagePermission redirectTo="/partner/dashboard">
      {children}
    </RequirePagePermission>
  );
}
