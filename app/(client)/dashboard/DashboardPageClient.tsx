"use client";

import { useSearchParams } from "next/navigation";
import { BookingHistory } from "@/components/client/dashboard/BookingHistory";
import { FavoritesList } from "@/components/client/dashboard/FavoritesList";
import { ProfileForm } from "@/components/client/dashboard/ProfileForm";
import { ClientPageGuard } from "@/components/shared/auth/ClientPageGuard";

export default function DashboardPageClient() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "bookings";

  return (
    <ClientPageGuard>
      {activeTab === "bookings" && <BookingHistory />}
      {activeTab === "favorites" && <FavoritesList />}
      {activeTab === "profile" && <ProfileForm />}
    </ClientPageGuard>
  );
}
