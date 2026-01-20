"use client";

import { useState, useEffect } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { getPartnerBookings } from "@/app/actions/partner/bookings/get";
import { getPartnerReviews } from "@/app/actions/partner/reviews/get";
import { authClient } from "@/lib/better-auth-client";
import { Hotel, Booking } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, DollarSign, TrendingUp, Star } from "lucide-react";

export default function PartnerDashboard() {
  const { data: session } = authClient.useSession();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([
        getPartnerHotels(session.user.id),
        getPartnerBookings(session.user.id),
        getPartnerReviews(session.user.id),
      ]).then(([hotelsData, bookingsData, reviewsData]) => {
        setHotels(hotelsData);
        setBookings(bookingsData);
        setReviews(reviewsData.reviews || reviewsData); // Support both old and new format
        setIsLoading(false);
      });
    }
  }, [session?.user?.id]);

  // Calculer les statistiques
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === today.getTime();
  });

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === yesterday.getTime();
  });

  const bookingsTodayCount = todayBookings.length;
  const bookingsYesterdayCount = yesterdayBookings.length;
  const bookingsGrowth =
    bookingsYesterdayCount > 0
      ? ((bookingsTodayCount - bookingsYesterdayCount) / bookingsYesterdayCount) * 100
      : bookingsTodayCount > 0
        ? 100
        : 0;

  // Chiffre d'affaires (réservations confirmées uniquement)
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.finalPrice, 0);

  // Chiffre d'affaires d'hier (pour la comparaison)
  const yesterdayConfirmedBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === yesterday.getTime() && booking.status === "confirmed";
  });
  const yesterdayRevenue = yesterdayConfirmedBookings.reduce(
    (sum, booking) => sum + booking.finalPrice,
    0
  );
  const revenueGrowth =
    yesterdayRevenue > 0
      ? ((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : totalRevenue > 0
        ? 100
        : 0;

  // Taux d'occupation (simplifié : basé sur les réservations confirmées)
  // Dans un système réel, cela devrait être calculé en fonction des disponibilités
  const occupancyRate = hotels.length > 0 ? (confirmedBookings.length / (hotels.length * 30)) * 100 : 0;
  const occupancyRateRounded = Math.round(occupancyRate);

  // Note moyenne calculée à partir des avis réels
  const reviewsCount = reviews.length;
  const averageRating =
    reviewsCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount
      : 0;
  const averageRatingRounded = reviewsCount > 0 ? averageRating.toFixed(1) : "N/A";

  // Dernières réservations (5 plus récentes)
  const recentBookings = bookings.slice(0, 5);

  if (isLoading) {
    return (
      <div>
        <BreadcrumbPartner items={[{ label: "Tableau de bord" }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbPartner items={[{ label: "Tableau de bord" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">Bienvenue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-partner-primary-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Réservations du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-partner-primary-600">
                {bookingsTodayCount}
              </div>
              <Calendar className="w-8 h-8 text-partner-primary-400" />
            </div>
            <p
              className={`text-xs font-medium flex items-center mt-2 ${
                bookingsGrowth >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {bookingsGrowth >= 0 ? "+" : ""}
              {bookingsGrowth.toFixed(0)}%{" "}
              <span className="text-gray-400 ml-1">vs hier</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">
                ${totalRevenue.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <p
              className={`text-xs font-medium flex items-center mt-2 ${
                revenueGrowth >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {revenueGrowth >= 0 ? "+" : ""}
              {revenueGrowth.toFixed(0)}%{" "}
              <span className="text-gray-400 ml-1">vs hier</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux d'occupation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">
                {occupancyRateRounded}%
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Basé sur les réservations confirmées
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Note moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-yellow-600">
                {averageRatingRounded}
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {reviewsCount > 0 ? `Sur ${reviewsCount} avis` : "Aucun avis"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dernières réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.guestName || booking.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.hotel.name} • {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-partner-primary-600">
                        {booking.currency === "USD" ? "$" : booking.currency} {booking.finalPrice}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Confirmé"
                          : booking.status === "pending"
                            ? "En attente"
                            : booking.status === "cancelled"
                              ? "Annulé"
                              : "Terminé"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Aucune réservation récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disponibilités rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Gérez vos disponibilités</p>
              <Button asChild variant="outline">
                <Link href="/partner/availability">Voir le calendrier</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
