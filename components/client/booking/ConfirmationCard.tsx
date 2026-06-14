"use client";

import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Calendar, Clock, MapPin, Users, FileText, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booking, Hotel } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface ConfirmationCardProps {
  booking: Booking;
  hotel: Hotel;
  compact?: boolean;
  showActions?: boolean;
  showImportantNote?: boolean;
}

export function ConfirmationCard({
  booking,
  hotel,
  compact = false,
  showActions = true,
  showImportantNote = true,
}: ConfirmationCardProps) {
  const qrCodeValue = JSON.stringify({
    bookingId: booking.id,
    hotelId: hotel.id,
    date: booking.date,
    timeSlot: booking.timeSlot.id,
  });

  const isConfirmed =
    booking.status === "CONFIRMED" || booking.status === "COMPLETED";
  const HeaderIcon = isConfirmed ? CheckCircle : Hourglass;
  const headerTitle = isConfirmed
    ? "Réservation confirmée !"
    : "Récapitulatif de votre réservation";
  const headerDescription = isConfirmed
    ? "Présentez le QR code à l'hôtel lors de votre arrivée."
    : compact
      ? "Vérifiez vos informations avant de payer."
      : "Vérifiez les détails ci-dessous, puis choisissez votre mode de paiement.";

  const detailItemClass = compact
    ? "flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg"
    : "flex items-start gap-3 p-3 bg-gray-50 rounded-lg";

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      <div
        className={`text-white shrink-0 ${
          compact ? "p-4" : "p-6"
        } ${
          isConfirmed
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : "bg-gradient-to-r from-amber-500 to-orange-500"
        }`}
      >
        <div className="flex items-center gap-3">
          <HeaderIcon className={compact ? "w-6 h-6" : "w-8 h-8"} />
          <div>
            <h2 className={`font-bold ${compact ? "text-lg" : "text-2xl"}`}>
              {headerTitle}
            </h2>
            <p
              className={`mt-0.5 text-sm ${isConfirmed ? "text-green-100" : "text-amber-50"}`}
            >
              {headerDescription}
            </p>
          </div>
        </div>
      </div>

      <div className={`flex-1 ${compact ? "p-4" : "p-6"}`}>
        <div
          className={
            isConfirmed
              ? "lg:grid lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-6 lg:items-start"
              : undefined
          }
        >
          {isConfirmed && (
            <div className="mb-6 lg:mb-0">
              <div className="flex justify-center p-3 bg-gray-50 rounded-lg">
                <QRCodeSVG
                  value={qrCodeValue}
                  size={compact ? 160 : 180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              {!compact && (
                <p className="text-center text-sm text-gray-600 mt-3">
                  Code QR de check-in
                </p>
              )}
            </div>
          )}

          <div>
            <div
              className={`mb-4 ${
                compact
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-2"
                  : "space-y-4 mb-6"
              }`}
            >
          <div className={detailItemClass}>
            <MapPin className="w-4 h-4 text-client-primary-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{hotel.name}</p>
              <p className="text-xs text-gray-600 truncate">{hotel.address}</p>
              <p className="text-xs text-gray-600">{hotel.city}, {hotel.country}</p>
            </div>
          </div>

          <div className={detailItemClass}>
            <Calendar className="w-4 h-4 text-client-primary-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Date</p>
              <p className="text-xs text-gray-600">
                {format(new Date(booking.date), compact ? "EEE d MMM yyyy" : "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>

          <div className={detailItemClass}>
            <Clock className="w-4 h-4 text-client-primary-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Créneau</p>
              <p className="text-xs text-gray-600">
                {booking.timeSlot.label} ({booking.timeSlot.startTime} - {booking.timeSlot.endTime})
              </p>
            </div>
          </div>

          <div className={detailItemClass}>
            <Users className="w-4 h-4 text-client-primary-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Personnes</p>
              <p className="text-xs text-gray-600">
                {booking.guestCount.adults} {booking.guestCount.adults > 1 ? "adultes" : "adulte"}
                {booking.guestCount.children > 0 && `, ${booking.guestCount.children} ${booking.guestCount.children > 1 ? "enfants" : "enfant"}`}
              </p>
            </div>
          </div>

          <div className={`${detailItemClass} ${compact ? "sm:col-span-2" : ""}`}>
            <FileText className="w-4 h-4 text-client-primary-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">N° réservation</p>
              <p className="text-xs text-gray-600 font-mono truncate" title={booking.id}>
                {booking.id}
              </p>
            </div>
          </div>
            </div>

            <div className={`border-t border-gray-200 pt-3 ${showActions ? "mb-4" : ""}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isConfirmed ? "Total payé" : "Montant total"}
                </span>
                <span className="font-bold text-lg text-client-primary-600">
                  {booking.currency === "USD" ? "$" : booking.currency}{" "}
                  {booking.totalPrice}
                </span>
              </div>
              {isConfirmed && (
                <p className="text-xs text-gray-500 text-right mt-0.5">Payé</p>
              )}
            </div>

            {showActions && (
              <div className={`${compact ? "grid grid-cols-2 gap-2" : "space-y-3"}`}>
                <Button
                  asChild
                  className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
                  size={compact ? "sm" : "default"}
                >
                  <Link href="/dashboard">Mes réservations</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size={compact ? "sm" : "default"}
                >
                  <Link href={`/hotels/${hotel.id}`}>Voir l'hôtel</Link>
                </Button>
              </div>
            )}

            {showImportantNote && (
              <div className={`${showActions ? "mt-4" : "mt-3"} p-3 bg-yellow-50 border border-yellow-200 rounded-lg`}>
                <p className="text-xs text-yellow-800">
                  <strong>Important :</strong> Arrivez à l&apos;heure. Annulation possible jusqu&apos;à 24h avant.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

