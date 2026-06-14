"use client";

import { useSearchParams } from "next/navigation";
import { BookingHistory } from "@/components/client/dashboard/BookingHistory";
import { FavoritesList } from "@/components/client/dashboard/FavoritesList";
import { ProfileForm } from "@/components/client/dashboard/ProfileForm";

export default function DashboardPageClient() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "bookings";

  return (
    <>
      {activeTab === "bookings" && <BookingHistory />}
      {activeTab === "favorites" && <FavoritesList />}
      {activeTab === "profile" && <ProfileForm />}
    </>
  );
}
