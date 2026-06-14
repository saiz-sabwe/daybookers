"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BookingStepper } from "@/components/client/booking/BookingStepper";
import { TimeSlotSelector } from "@/components/client/booking/TimeSlotSelector";
import { GuestCounter } from "@/components/client/booking/GuestCounter";
import { BookingSummary } from "@/components/client/booking/BookingSummary";
import { useBooking } from "@/hooks/use-booking";
import { TimeSlot, Hotel } from "@/types";
import { getHotelById } from "@/app/actions/hotels/get";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { getRoomTypesByHotelId } from "@/app/actions/rooms/get";
import { useToast } from "@/hooks/use-toast";
import { useGlobalLoading } from "@/components/shared/GlobalLoadingProvider";
import { Loader2, Clock, BedDouble } from "lucide-react";
import { useClientAuth } from "@/hooks/use-client-auth";
import { createBooking } from "@/app/actions/bookings/create";
import { Skeleton } from "@/components/ui/skeleton";

const guestInfoSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
});

type GuestInfoFormValues = z.infer<typeof guestInfoSchema>;

const steps = [
  { label: "Créneau", description: "Sélectionnez votre créneau horaire" },
  { label: "Personnes", description: "Nombre de personnes" },
  { label: "Informations", description: "Vos coordonnées" },
];

function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <Skeleton className="h-9 w-64 mb-8" />
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const { runWithLoading, startLoading } = useGlobalLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hotelId = searchParams.get("hotelId");
  const roomTypeIdFromUrl = searchParams.get("roomTypeId");
  const timeSlotIdFromUrl = searchParams.get("timeSlotId");
  const isBookingPrefilled = Boolean(
    hotelId && roomTypeIdFromUrl && timeSlotIdFromUrl,
  );
  const [currentStep, setCurrentStep] = useState(isBookingPrefilled ? 2 : 1);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(
    roomTypeIdFromUrl,
  );
  const [isHotelLoading, setIsHotelLoading] = useState(!!hotelId);

  const {
    updateTimeSlot,
    updateGuestCount,
  } = useBooking();

  const [selectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [guestCount, setGuestCount] = useState({ adults: 1, children: 0 });

  const form = useForm<GuestInfoFormValues>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const redirectToLoginRef = useRef(false);

  const callbackPath = useMemo(() => {
    const query = searchParams.toString();
    return `/booking${query ? `?${query}` : ""}`;
  }, [searchParams]);

  useEffect(() => {
    if (isAuthPending || isAuthenticated || redirectToLoginRef.current) {
      return;
    }

    redirectToLoginRef.current = true;
    startLoading();
    const callbackUrl = encodeURIComponent(callbackPath);
    router.replace(`/login?callbackUrl=${callbackUrl}`);
  }, [isAuthenticated, isAuthPending, router, callbackPath, startLoading]);

  useEffect(() => {
    if (!hotelId || isAuthPending || !isAuthenticated) {
      if (!hotelId) {
        setIsHotelLoading(false);
      }
      return;
    }

    let cancelled = false;
    setIsHotelLoading(true);

    runWithLoading(() =>
      Promise.all([
        getHotelById(hotelId),
        getTimeSlots(),
        getRoomTypesByHotelId(hotelId),
      ]).then(([hotelData, timeSlotsData, roomTypesData]) => {
        if (cancelled) return;

        setHotel(hotelData);
        setTimeSlots(
          timeSlotsData.map((slot) => ({
            id: slot.id,
            label: slot.name,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: 0,
            available: true,
          })),
        );
        setRoomTypes(roomTypesData);

        if (timeSlotIdFromUrl) {
          const slot = timeSlotsData.find((s) => s.id === timeSlotIdFromUrl);
          if (slot) {
            const mappedSlot = {
              id: slot.id,
              label: slot.name,
              startTime: slot.startTime,
              endTime: slot.endTime,
              price: 0,
              available: true,
            };
            setSelectedTimeSlot(mappedSlot);
            updateTimeSlot(mappedSlot);
          }
        }

        if (roomTypeIdFromUrl) {
          const roomType = roomTypesData.find((rt) => rt.id === roomTypeIdFromUrl);
          if (roomType) {
            setSelectedRoomTypeId(roomType.id);
          }
        } else if (roomTypesData.length > 0) {
          setSelectedRoomTypeId(roomTypesData[0].id);
        }
      }),
    ).finally(() => {
      if (!cancelled) {
        setIsHotelLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    hotelId,
    roomTypeIdFromUrl,
    timeSlotIdFromUrl,
    isAuthPending,
    isAuthenticated,
    updateTimeSlot,
    runWithLoading,
  ]);

  if (isAuthPending) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-client-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isHotelLoading) {
    return null;
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hôtel introuvable</h1>
          <p className="text-gray-600 mb-4">L&apos;hôtel que vous recherchez n&apos;existe pas.</p>
          <Button onClick={() => router.push("/hotels")}>
            Retour aux hôtels
          </Button>
        </div>
      </div>
    );
  }

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    updateTimeSlot(slot);
  };

  const handleGuestCountChange = (count: { adults: number; children: number }) => {
    setGuestCount(count);
    updateGuestCount(count);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (isBookingPrefilled && currentStep === 2 && hotelId) {
      router.push(`/hotels/${hotelId}`);
      return;
    }
    if (currentStep > (isBookingPrefilled ? 2 : 1)) {
      setCurrentStep(currentStep - 1);
    }
  };

  const activeSteps = isBookingPrefilled ? steps.slice(1) : steps;
  const stepperStep = isBookingPrefilled ? currentStep - 1 : currentStep;
  const selectedRoomType = roomTypes.find((rt) => rt.id === selectedRoomTypeId);
  const bookingPrice = selectedRoomType?.basePrice ?? hotel?.minPrice ?? 0;
  const bookingCurrency = selectedRoomType?.currency ?? hotel?.currency ?? "USD";

  const onSubmit = async (data: GuestInfoFormValues) => {
    if (!selectedTimeSlot) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un créneau horaire",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!selectedRoomTypeId) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un type de chambre",
          variant: "destructive",
        });
        return;
      }

      const result = await runWithLoading(() =>
        createBooking({
          hotelId: hotel.id,
          roomTypeId: selectedRoomTypeId,
          date: selectedDate.toISOString().split("T")[0],
          timeSlotId: selectedTimeSlot.id,
          guestCount,
          guestInfo: data,
          specialRequests: undefined,
          promotionCode: undefined,
        }),
      );

      if (!result.success) {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de la création de la réservation",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Réservation créée",
        description: "Finalisez le paiement pour confirmer votre créneau.",
        variant: "success",
      });

      startLoading();
      router.push(`/booking/confirm/${result.bookingId}`);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedTimeSlot !== null;
    if (currentStep === 2) return guestCount.adults > 0;
    if (currentStep === 3) return form.formState.isValid;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Réserver votre séjour</h1>

        <div className="mb-8">
          <BookingStepper currentStep={stepperStep} steps={activeSteps} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              {isBookingPrefilled && selectedTimeSlot && selectedRoomType && (
                <div className="mb-6 rounded-lg border border-client-primary-100 bg-client-primary-50/50 p-4">
                  <p className="text-sm font-medium text-client-primary-800 mb-3">
                    Votre sélection
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-700">
                    <span className="inline-flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-client-primary-500" />
                      {selectedRoomType.name}
                    </span>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-4 h-4 text-client-primary-500" />
                      {selectedTimeSlot.label} ({selectedTimeSlot.startTime} - {selectedTimeSlot.endTime})
                    </span>
                  </div>
                </div>
              )}

              {currentStep === 1 && !isBookingPrefilled && (
                <TimeSlotSelector
                  slots={timeSlots}
                  selectedSlotId={selectedTimeSlot?.id || null}
                  onSelect={handleTimeSlotSelect}
                />
              )}

              {currentStep === 2 && (
                <GuestCounter
                  adults={guestCount.adults}
                  children={guestCount.children}
                  onAdultsChange={(count) =>
                    handleGuestCountChange({ ...guestCount, adults: count })
                  }
                  onChildrenChange={(count) =>
                    handleGuestCountChange({ ...guestCount, children: count })
                  }
                />
              )}

              {currentStep === 3 && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Vos coordonnées
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+243 900 000 000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                      >
                        Retour
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-client-primary-500 hover:bg-client-primary-600 text-white"
                        disabled={isSubmitting || !canProceed()}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          "Confirmer la réservation"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {currentStep < 3 && (
                <div className="flex gap-4 pt-6 border-t border-gray-100 mt-6">
                  {(currentStep > (isBookingPrefilled ? 2 : 1) ||
                    (isBookingPrefilled && currentStep === 2)) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      {isBookingPrefilled && currentStep === 2
                        ? "Modifier la chambre"
                        : "Retour"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1 bg-client-primary-500 hover:bg-client-primary-600 text-white"
                  >
                    Continuer
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <BookingSummary
              hotel={hotel}
              date={selectedDate}
              timeSlot={selectedTimeSlot}
              guestCount={guestCount}
              price={bookingPrice}
              currency={bookingCurrency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
