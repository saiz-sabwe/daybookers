"use client";

import { PartnerNavbar } from "@/components/partner/layout/PartnerNavbar";
import { PartnerSidebar } from "@/components/partner/layout/PartnerSidebar";
import { ProtectedRoute } from "@/components/shared/auth/ProtectedRoute";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="partner">
      <div className="theme-partner min-h-screen bg-gray-50">
        <PartnerNavbar />
        <div className="flex">
          <PartnerSidebar />
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

