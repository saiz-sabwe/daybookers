"use client";

import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="theme-admin min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 md:ml-64 pt-16">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

