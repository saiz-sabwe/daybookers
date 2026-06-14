"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Star,
  ArrowRight,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booking, Hotel } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ReviewDialog } from "./ReviewDialog";
import { useClientAuth } from "@/hooks/use-client-auth";
import {
  formatBookingRef,
  formatTimeLabel,
} from "@/lib/bookings/format-booking-ref";
import { resolveHotelImage } from "@/lib/images/hotel-image";

interface BookingCardProps {
  booking: Booking;
  hotel: Hotel;
  showActions?: boolean;
  onCancel?: (bookingId: string) => void;
  onReviewSuccess?: () => void;
}

const statusConfig: Record<
  string,
  {
    label: string;
    badge: string;
    ring: string;
    icon: typeof CheckCircle;
  }
> = {
  CONFIRMED: {
    label: "Confirmée",
    badge: "bg-emerald-500/90 text-white",
    ring: "ring-emerald-500/20",
    icon: CheckCircle,
  },
  PENDING: {
    label: "En attente",
    badge: "bg-amber-500/90 text-white",
    ring: "ring-amber-500/20",
    icon: ClockIcon,
  },
  CANCELLED: {
    label: "Annulée",
    badge: "bg-red-500/90 text-white",
    ring: "ring-red-500/20",
    icon: XCircle,
  },
  COMPLETED: {
    label: "Terminée",
    badge: "bg-gray-700/90 text-white",
    ring: "ring-gray-500/20",
    icon: CheckCircle,
  },
  REFUNDED: {
    label: "Remboursée",
    badge: "bg-purple-500/90 text-white",
    ring: "ring-purple-500/20",
    icon: XCircle,
  },
};

export function BookingCard({
  booking,
  hotel,
  showActions = true,
  onCancel,
  onReviewSuccess,
}: BookingCardProps) {
  const { isAuthenticated } = useClientAuth();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const status = statusConfig[booking.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;
  const imageSrc = hotel.images?.[0]
    ? resolveHotelImage(hotel.images[0])
    : null;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl",
        status.ring,
        "ring-1 ring-transparent",
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-52 md:w-56">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={hotel.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 224px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-client-primary-100 to-client-primary-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/50 sm:via-black/10 sm:to-transparent" />

          <div className="absolute left-3 top-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-lg backdrop-blur-sm",
                status.badge,
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 sm:hidden">
            <h3 className="truncate text-lg font-bold text-white drop-shadow-md">
              {hotel.name}
            </h3>
            <p className="flex items-center gap-1 text-xs text-white/90">
              <MapPin className="h-3 w-3" />
              {hotel.city}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0 hidden sm:block">
              <h3 className="truncate text-xl font-bold text-gray-900 group-hover:text-client-primary-600 transition-colors">
                {hotel.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {hotel.city}, {hotel.country}
                </span>
              </p>
            </div>
            <div className="ml-auto shrink-0 text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Total
              </p>
              <p className="text-2xl font-bold text-client-primary-600">
                {booking.currency === "USD" ? "$" : booking.currency}{" "}
                {booking.totalPrice}
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700">
              <Calendar className="h-3.5 w-3.5 text-client-primary-500" />
              {format(new Date(booking.date), "EEE d MMM yyyy", {
                locale: fr,
              })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700">
              <Clock className="h-3.5 w-3.5 text-client-primary-500" />
              {formatTimeLabel(booking.timeSlot.startTime)} –{" "}
              {formatTimeLabel(booking.timeSlot.endTime)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700">
              <Users className="h-3.5 w-3.5 text-client-primary-500" />
              {booking.guestCount.adults}{" "}
              {booking.guestCount.adults > 1 ? "adultes" : "adulte"}
              {booking.guestCount.children > 0 &&
                `, ${booking.guestCount.children} enfant${booking.guestCount.children > 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
            <Hash className="h-3.5 w-3.5" />
            <span>Réf. {formatBookingRef(booking.id)}</span>
          </div>

          {showActions && (
            <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              <Button
                asChild
                size="sm"
                className="bg-client-primary-600 hover:bg-client-primary-700 shadow-sm"
              >
                <Link href={`/booking/confirm/${booking.id}`}>
                  Détails
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>

              {(booking.status === "CONFIRMED" ||
                booking.status === "PENDING") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel?.(booking.id)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Annuler
                </Button>
              )}

              {booking.status === "COMPLETED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewDialogOpen(true)}
                  className="border-client-primary-200 text-client-primary-600 hover:bg-client-primary-50"
                >
                  <Star className="mr-1 h-3.5 w-3.5" />
                  Avis
                </Button>
              )}

              <Button asChild variant="ghost" size="sm" className="text-gray-600">
                <Link href={`/hotels/${hotel.id}`}>Voir l&apos;hôtel</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          bookingId={booking.id}
          hotelId={hotel.id}
          onSuccess={onReviewSuccess}
        />
      )}
    </article>
  );
}
