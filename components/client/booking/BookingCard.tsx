"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Users, MapPin, CheckCircle, XCircle, Clock as ClockIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, Hotel } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ReviewDialog } from "./ReviewDialog";
import { authClient } from "@/lib/better-auth-client";

interface BookingCardProps {
  booking: Booking;
  hotel: Hotel;
  showActions?: boolean;
  onCancel?: (bookingId: string) => void;
  onReviewSuccess?: () => void;
}

export function BookingCard({ booking, hotel, showActions = true, onCancel, onReviewSuccess }: BookingCardProps) {
  const { data: session } = authClient.useSession();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const statusConfig = {
    confirmed: { label: "Confirmée", color: "bg-green-100 text-green-800", icon: CheckCircle },
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: ClockIcon },
    cancelled: { label: "Annulée", color: "bg-red-100 text-red-800", icon: XCircle },
    completed: { label: "Terminée", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  };

  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Hotel Image */}
          {hotel.images && hotel.images[0] && (
            <div className="relative w-full md:w-32 h-48 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={hotel.images[0]}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-3 right-3">
                <Badge className={cn("flex items-center gap-1 shadow-md", status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </Badge>
              </div>
            </div>
          )}

          {/* Booking Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-1.5">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{hotel.city}, {hotel.country}</span>
                </div>
              </div>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
                  <Calendar className="w-5 h-5 text-client-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                  {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
                  <Clock className="w-5 h-5 text-client-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Créneau</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
                  <Users className="w-5 h-5 text-client-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Invités</p>
                  <p className="text-sm font-semibold text-gray-900">
                  {booking.guestCount.adults} {booking.guestCount.adults > 1 ? "adultes" : "adulte"}
                  {booking.guestCount.children > 0 && `, ${booking.guestCount.children} ${booking.guestCount.children > 1 ? "enfants" : "enfant"}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
                  <span className="text-lg font-bold text-client-primary-600">$</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Prix total</p>
                  <p className="text-lg font-bold text-gray-900">
                  {booking.currency === "USD" ? "$" : booking.currency} {booking.totalPrice}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking ID */}
            <div className="mb-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Réservation n° <span className="font-mono font-semibold text-gray-700">{booking.id}</span>
              </p>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="bg-client-primary-600 hover:bg-client-primary-700"
                >
                  <Link href={`/booking/confirm/${booking.id}`}>
                    Détails de la réservation
                  </Link>
                </Button>
                {(booking.status === "confirmed" || booking.status === "pending") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel?.(booking.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                  >
                    Annuler
                  </Button>
                )}
                {booking.status === "completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewDialogOpen(true)}
                    className="text-client-primary-600 hover:text-client-primary-700 hover:border-client-primary-300 hover:bg-client-primary-50"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Laisser un avis
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link href={`/hotels/${hotel.id}`}>
                    Voir l'hôtel
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {session?.user?.id && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          bookingId={booking.id}
          hotelId={hotel.id}
          userId={session.user.id}
          onSuccess={onReviewSuccess}
        />
      )}
    </div>
  );
}

