"use client";

import { useState, useEffect } from "react";
import { BookingCard } from "@/components/client/booking/BookingCard";
import { DashboardPageHeader } from "@/components/client/dashboard/DashboardPageHeader";
import { EmptyState } from "@/components/shared/utils/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  CalendarX,
  AlertTriangle,
  Clock,
  CalendarCheck,
  History,
  Ban,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useGlobalLoading } from "@/components/shared/GlobalLoadingProvider";
import { cn } from "@/lib/utils";

function BookingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="h-44 w-full sm:h-auto sm:w-52 md:w-56 shrink-0 rounded-none" />
        <div className="flex-1 space-y-3 p-5 md:p-6">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-[55%]" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingHistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BookingHistory({ bookings: initialBookings, hotels: initialHotels }: { bookings?: Booking[]; hotels?: Hotel[] }) {
  const { toast } = useToast();
  const { runWithLoading } = useGlobalLoading();
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings || []);
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels || []);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialBookings);
  const [activeTab, setActiveTab] = useState<
    "active" | "pending" | "past" | "cancelled"
  >("active");

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    if (!initialBookings && isAuthenticated) {
      setIsLoading(true);
      runWithLoading(() =>
        Promise.all([getBookings(), getHotels()]).then(
          ([bookingsData, hotelsData]) => {
            setBookings(bookingsData);
            setHotels(hotelsData);
          },
        ),
      ).finally(() => setIsLoading(false));
    } else if (initialBookings || !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthPending, initialBookings, runWithLoading]);

  const allBookings = bookings.map((booking) => {
    const hotel = hotels.find((h) => h.id === booking.hotelId);
    return { booking, hotel };
  }).filter((item) => item.hotel !== undefined);

  const pendingBookings = allBookings.filter(
    (item) => item.booking.status === "PENDING"
  );

  const activeBookings = allBookings.filter(
    (item) => item.booking.status === "CONFIRMED"
  );

  const pastBookings = allBookings.filter(
    (item) => item.booking.status === "COMPLETED"
  );

  const cancelled = allBookings.filter(
    (item) => item.booking.status === "CANCELLED"
  );

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel || !isAuthenticated) {
      return;
    }

    setIsCancelling(true);
    try {
      const result = await runWithLoading(() => cancelBooking(bookingToCancel));

      if (result.success) {
        const updatedBookings = await runWithLoading(() => getBookings());
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

  const tabs = [
    {
      id: "active" as const,
      label: "Actives",
      count: activeBookings.length,
      icon: CalendarCheck,
    },
    {
      id: "pending" as const,
      label: "En attente",
      count: pendingBookings.length,
      icon: Clock,
    },
    {
      id: "past" as const,
      label: "Passées",
      count: pastBookings.length,
      icon: History,
    },
    {
      id: "cancelled" as const,
      label: "Annulées",
      count: cancelled.length,
      icon: Ban,
    },
  ];

  const currentList =
    activeTab === "active"
      ? activeBookings
      : activeTab === "pending"
        ? pendingBookings
        : activeTab === "past"
          ? pastBookings
          : cancelled;

  if (isLoading) {
    return (
      <div>
        <DashboardPageHeader
          icon={Calendar}
          title="Mes réservations"
          description="Chargement de vos réservations..."
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardPageHeader
        icon={Calendar}
        title="Mes réservations"
        description="Gérez toutes vos réservations en un seul endroit"
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                isActive
                  ? "border-client-primary-200 bg-client-primary-50 shadow-sm ring-1 ring-client-primary-100"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <TabIcon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-client-primary-600" : "text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-2xl font-bold",
                    isActive ? "text-client-primary-700" : "text-gray-900",
                  )}
                >
                  {tab.count}
                </span>
              </div>
              <p
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-client-primary-700" : "text-gray-600",
                )}
              >
                {tab.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {currentList.length > 0 ? (
          currentList.map(({ booking, hotel }) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              hotel={hotel!}
              showActions={activeTab !== "cancelled"}
              onCancel={handleCancelClick}
              onReviewSuccess={
                activeTab === "past"
                  ? async () => {
                      if (isAuthenticated) {
                        const updatedBookings = await getBookings();
                        setBookings(updatedBookings);
                      }
                    }
                  : undefined
              }
            />
          ))
        ) : activeTab === "pending" ? (
          <EmptyState
            icon={Clock}
            title="Aucune réservation en attente"
            description="Vous n'avez pas de réservation en attente de paiement."
          />
        ) : activeTab === "active" ? (
          <EmptyState
            icon={CalendarX}
            title="Aucune réservation active"
            description="Vous n'avez pas de réservation confirmée pour le moment."
          />
        ) : activeTab === "past" ? (
          <EmptyState
            icon={CalendarX}
            title="Aucune réservation passée"
            description="Vos réservations terminées apparaîtront ici."
          />
        ) : (
          <EmptyState
            icon={CalendarX}
            title="Aucune réservation annulée"
            description="Vous n'avez annulé aucune réservation."
          />
        )}
      </div>

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

