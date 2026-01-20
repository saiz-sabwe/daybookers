"use client";

import { ClientNavbar } from "@/components/client/layout/ClientNavbar";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="client">
      <div className="theme-client min-h-screen bg-gray-50">
        <ClientNavbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}

