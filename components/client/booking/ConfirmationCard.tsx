"use client";

import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booking, Hotel } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface ConfirmationCardProps {
  booking: Booking;
  hotel: Hotel;
}

export function ConfirmationCard({ booking, hotel }: ConfirmationCardProps) {
  const qrCodeValue = JSON.stringify({
    bookingId: booking.id,
    hotelId: hotel.id,
    date: booking.date,
    timeSlot: booking.timeSlot.id,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Réservation confirmée !</h2>
            <p className="text-green-100 mt-1">Votre réservation a été enregistrée avec succès</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* QR Code */}
        <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
          <QRCodeSVG
            value={qrCodeValue}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <p className="text-center text-sm text-gray-600 mb-6">
          Présentez ce code QR à l'hôtel lors de votre arrivée
        </p>

        {/* Booking Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-client-primary-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{hotel.name}</p>
              <p className="text-sm text-gray-600">{hotel.address}</p>
              <p className="text-sm text-gray-600">{hotel.city}, {hotel.country}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-client-primary-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Date</p>
              <p className="text-sm text-gray-600">
                {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-client-primary-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Créneau horaire</p>
              <p className="text-sm text-gray-600">
                {booking.timeSlot.label} ({booking.timeSlot.startTime} - {booking.timeSlot.endTime})
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-client-primary-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Personnes</p>
              <p className="text-sm text-gray-600">
                {booking.guestCount.adults} {booking.guestCount.adults > 1 ? "adultes" : "adulte"}
                {booking.guestCount.children > 0 && `, ${booking.guestCount.children} ${booking.guestCount.children > 1 ? "enfants" : "enfant"}`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-client-primary-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Numéro de réservation</p>
              <p className="text-sm text-gray-600 font-mono">{booking.id}</p>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total payé</span>
            <span className="font-bold text-xl text-client-primary-600">
              {booking.currency === "USD" ? "$" : booking.currency} {booking.totalPrice}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-right">
            {booking.paymentStatus === "paid" ? "Payé" : "À payer à l'hôtel"}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
          >
            <Link href="/dashboard">Voir mes réservations</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href={`/hotels/${hotel.id}`}>Voir l'hôtel</Link>
          </Button>
        </div>

        {/* Important Info */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important :</strong> Arrivez à l'heure indiquée. En cas d'annulation, 
            veuillez nous contacter au moins 24h à l'avance.
          </p>
        </div>
      </div>
    </div>
  );
}

