"use client";

import { useRouter } from "next/navigation";
import { ConfirmationCard } from "@/components/client/booking/ConfirmationCard";
import { Button } from "@/components/ui/button";
import { Booking, Hotel } from "@/types";

interface BookingConfirmationClientProps {
  booking: Booking;
  hotel: Hotel;
}

export function BookingConfirmationClient({
  booking,
  hotel,
}: BookingConfirmationClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Retour
          </Button>
        </div>

        <ConfirmationCard booking={booking} hotel={hotel} />
      </div>
    </div>
  );
}

