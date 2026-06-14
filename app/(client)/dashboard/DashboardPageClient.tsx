"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClientSidebar } from "@/components/client/dashboard/ClientSidebar";
import { BookingHistory } from "@/components/client/dashboard/BookingHistory";
import { FavoritesList } from "@/components/client/dashboard/FavoritesList";
import { ProfileForm } from "@/components/client/dashboard/ProfileForm";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPageClient() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "bookings";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-72">
        <div className="md:hidden fixed top-16 left-0 right-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="container mx-auto max-w-5xl px-4 py-6 mt-12 md:mt-8">
          {activeTab === "bookings" && <BookingHistory />}
          {activeTab === "favorites" && <FavoritesList />}
          {activeTab === "profile" && <ProfileForm />}
        </div>
      </main>
    </div>
  );
}
