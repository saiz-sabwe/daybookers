"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClientSidebar } from "@/components/client/dashboard/ClientSidebar";
import { BookingHistory } from "@/components/client/dashboard/BookingHistory";
import { FavoritesList } from "@/components/client/dashboard/FavoritesList";
import { ProfileForm } from "@/components/client/dashboard/ProfileForm";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "bookings";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16">
        {/* Bouton hamburger pour mobile */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="container mx-auto px-4 py-6 mt-12 md:mt-0">
          {activeTab === "bookings" && <BookingHistory />}
          {activeTab === "favorites" && <FavoritesList />}
          {activeTab === "profile" && <ProfileForm />}
        </div>
      </main>
    </div>
  );
}
