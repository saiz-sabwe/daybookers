"use client";

import { useState, useEffect } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPartnerBookings } from "@/app/actions/partner/bookings/get";
import { confirmBooking, cancelBookingByPartner } from "@/app/actions/partner/bookings/update";
import { Booking, Hotel } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { authClient } from "@/lib/better-auth-client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import Link from "next/link";

export default function PartnerBookingsPage() {
  const { data: session } = authClient.useSession();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      getPartnerBookings(session.user.id).then((bookingsData) => {
        setBookings(bookingsData);
        setIsLoading(false);
      });
    }
  }, [session?.user?.id]);

  const handleConfirmBooking = async (bookingId: string) => {
    if (!session?.user?.id) return;

    setProcessingBookingId(bookingId);
    try {
      const result = await confirmBooking(bookingId, session.user.id);
      if (result.success) {
        toast({
          title: "Réservation confirmée",
          description: "La réservation a été confirmée avec succès",
          variant: "default",
        });
        // Recharger les réservations
        const updatedBookings = await getPartnerBookings(session.user.id);
        setBookings(updatedBookings);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la confirmation",
        variant: "destructive",
      });
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!session?.user?.id) return;

    setProcessingBookingId(bookingId);
    try {
      const result = await cancelBookingByPartner(bookingId, session.user.id);
      if (result.success) {
        toast({
          title: "Réservation annulée",
          description: "La réservation a été annulée avec succès",
          variant: "default",
        });
        // Recharger les réservations
        const updatedBookings = await getPartnerBookings(session.user.id);
        setBookings(updatedBookings);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation",
        variant: "destructive",
      });
    } finally {
      setProcessingBookingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  if (isLoading) {
    return (
      <div>
        <BreadcrumbPartner items={[{ label: "Réservations" }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbPartner items={[{ label: "Réservations" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-partner-text-primary mb-2">
          Réservations
        </h1>
        <p className="text-gray-600">Gérez toutes les réservations de vos hôtels</p>
      </div>

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => {
                const isProcessing = processingBookingId === booking.id;

                return (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-partner-text-primary">
                          {booking.hotel.name}
                        </p>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : booking.status === "cancelled"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {booking.status === "confirmed"
                            ? "Confirmé"
                            : booking.status === "pending"
                              ? "En attente"
                              : booking.status === "cancelled"
                                ? "Annulé"
                                : "Terminé"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{booking.guestName || booking.user.name}</span> •{" "}
                        {format(new Date(booking.date), "EEEE d MMMM yyyy", { locale: fr })} •{" "}
                        {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                      </p>
                      <p className="text-xs text-gray-500">
                        Réservation #{booking.id.slice(0, 8)} • {booking.guestCount} personne
                        {booking.guestCount > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="font-bold text-partner-primary-600">
                          {booking.currency === "USD" ? "$" : booking.currency} {booking.finalPrice}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmBooking(booking.id)}
                            disabled={isProcessing}
                            className="text-green-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Confirmer
                          </Button>
                        )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/booking/confirm/${booking.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune réservation {statusFilter !== "all" ? `avec le statut "${statusFilter}"` : ""}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
