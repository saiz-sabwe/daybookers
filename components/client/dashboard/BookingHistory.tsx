"use client";

import { useState, useEffect } from "react";
import { BookingCard } from "@/components/client/booking/BookingCard";
import { EmptyState } from "@/components/shared/utils/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBookings } from "@/app/actions/bookings/get";
import { getHotels } from "@/app/actions/hotels/get";
import { cancelBooking } from "@/app/actions/bookings/update";
import { Booking, Hotel } from "@/types";
import { CalendarX, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth-client";

export function BookingHistory({ bookings: initialBookings, hotels: initialHotels }: { bookings?: Booking[]; hotels?: Hotel[] }) {
  const { toast } = useToast();
  const { data: session } = authClient.useSession();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings || []);
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels || []);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!initialBookings) {
      Promise.all([getBookings(session?.user?.id), getHotels()]).then(([bookingsData, hotelsData]) => {
        setBookings(bookingsData);
        setHotels(hotelsData);
      });
    }
  }, [session?.user?.id, initialBookings]);

  const allBookings = bookings.map((booking) => {
    const hotel = hotels.find((h) => h.id === booking.hotelId);
    return { booking, hotel };
  }).filter((item) => item.hotel !== undefined);

  const activeBookings = allBookings.filter(
    (item) => item.booking.status === "confirmed" || item.booking.status === "pending"
  );

  const pastBookings = allBookings.filter(
    (item) => item.booking.status === "completed"
  );

  const cancelled = allBookings.filter(
    (item) => item.booking.status === "cancelled"
  );

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel || !session?.user?.id) {
      return;
    }

    setIsCancelling(true);
    try {
      const result = await cancelBooking(bookingToCancel, session.user.id);

      if (result.success) {
        // Recharger les réservations depuis la base de données
        const updatedBookings = await getBookings(session.user.id);
        setBookings(updatedBookings);

        toast({
          title: "Réservation annulée",
          description: "Votre réservation a été annulée avec succès.",
          variant: "success",
        });
        setCancelDialogOpen(false);
        setBookingToCancel(null);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de l'annulation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation de la réservation",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelDialog = () => {
    setCancelDialogOpen(false);
    setBookingToCancel(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mes réservations</h2>
        <p className="text-gray-600">Gérez toutes vos réservations en un seul endroit</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Actives ({activeBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Passées ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées ({cancelled.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeBookings.length > 0 ? (
            activeBookings.map(({ booking, hotel }) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                hotel={hotel!}
                onCancel={handleCancelClick}
              />
            ))
          ) : (
            <EmptyState
              icon={CalendarX}
              title="Aucune réservation active"
              description="Vous n'avez pas de réservation active pour le moment."
            />
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastBookings.length > 0 ? (
            pastBookings.map(({ booking, hotel }) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                hotel={hotel!}
                showActions={true}
                onReviewSuccess={async () => {
                  if (session?.user?.id) {
                    const updatedBookings = await getBookings(session.user.id);
                    setBookings(updatedBookings);
                  }
                }}
              />
            ))
          ) : (
            <EmptyState
              icon={CalendarX}
              title="Aucune réservation passée"
              description="Vos réservations terminées apparaîtront ici."
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-6">
          {cancelled.length > 0 ? (
            cancelled.map(({ booking, hotel }) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                hotel={hotel!}
                showActions={false}
              />
            ))
          ) : (
            <EmptyState
              icon={CalendarX}
              title="Aucune réservation annulée"
              description="Vous n'avez annulé aucune réservation."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de confirmation d'annulation */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-xl">Annuler la réservation</DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2">
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelDialog}
              className="w-full sm:w-auto"
            >
              Non, garder la réservation
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? "Annulation..." : "Oui, annuler"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

