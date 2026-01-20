"use client";

import Image from "next/image";
import { Clock, Calendar, Shield, Star } from "lucide-react";
import { Hotel, TimeSlot } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingSummaryProps {
  hotel: Hotel;
  date: Date;
  timeSlot: TimeSlot | null;
  guestCount: { adults: number; children: number };
  price: number;
  currency?: string;
}

export function BookingSummary({
  hotel,
  date,
  timeSlot,
  guestCount,
  price,
  currency = "USD",
}: BookingSummaryProps) {
  const totalGuests = guestCount.adults + guestCount.children;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>

      <div className="flex gap-4 mb-6">
        {hotel.images && hotel.images[0] && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={hotel.images[0]}
              alt={hotel.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h4 className="font-bold text-sm">{hotel.name}</h4>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{hotel.stars} étoiles</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-sm border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-gray-500">
              {format(date, "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>

        {timeSlot && (
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium">Créneau</p>
              <p className="text-gray-500">
                {timeSlot.startTime} - {timeSlot.endTime}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 text-gray-400 flex items-center justify-center">
            <span className="text-xs">👥</span>
          </div>
          <div>
            <p className="font-medium">Personnes</p>
            <p className="text-gray-500">
              {totalGuests} {totalGuests > 1 ? "personnes" : "personne"}
              {guestCount.children > 0 && ` (${guestCount.children} ${guestCount.children > 1 ? "enfants" : "enfant"})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-green-500" />
          <div>
            <p className="font-medium text-green-600">Annulation Gratuite</p>
            <p className="text-gray-500 text-xs">Jusqu'à 10:00 le jour J</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-6 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Prix de la chambre</span>
          <span className="font-medium">
            {currency === "USD" ? "$" : currency} {price}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Taxes et frais</span>
          <span className="font-medium">Inclus</span>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <span className="font-bold text-lg">Total à payer</span>
          <span className="font-bold text-2xl text-client-primary-600">
            {currency === "USD" ? "$" : currency} {price}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">
          Payez à l'hôtel
        </p>
      </div>
    </div>
  );
}

