"use client";

import { ReactNode } from "react";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";

export function AdminPageGuard({ children }: { children: ReactNode }) {
  return (
    <RequirePagePermission redirectTo="/admin/dashboard">
      {children}
    </RequirePagePermission>
  );
}
