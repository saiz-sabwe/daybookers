"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/better-auth-client";
import { createBooking } from "@/app/actions/bookings/create";

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

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hotelId = searchParams.get("hotelId");
  const roomTypeIdFromUrl = searchParams.get("roomTypeId");
  const timeSlotIdFromUrl = searchParams.get("timeSlotId");
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(roomTypeIdFromUrl);

  useEffect(() => {
    if (hotelId) {
      Promise.all([
        getHotelById(hotelId),
        getTimeSlots(),
        getRoomTypesByHotelId(hotelId),
      ]).then(([hotelData, timeSlotsData, roomTypesData]) => {
        setHotel(hotelData);
        // Mapper les time slots vers le format TimeSlot
        setTimeSlots(
          timeSlotsData.map((slot) => ({
            id: slot.id,
            label: slot.name,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: 0,
            available: true,
          }))
        );
        setRoomTypes(roomTypesData);
        
        // Si un timeSlotId est dans l'URL, le sélectionner
        if (timeSlotIdFromUrl) {
          const slot = timeSlotsData.find((s) => s.id === timeSlotIdFromUrl);
          if (slot) {
            setSelectedTimeSlot({
              id: slot.id,
              label: slot.name,
              startTime: slot.startTime,
              endTime: slot.endTime,
              price: 0,
              available: true,
            });
          }
        }
        
        // Si un roomTypeId est dans l'URL mais pas de roomType sélectionné, utiliser le premier
        if (roomTypeIdFromUrl && !selectedRoomTypeId) {
          const roomType = roomTypesData.find((rt) => rt.id === roomTypeIdFromUrl);
          if (roomType) {
            setSelectedRoomTypeId(roomType.id);
          }
        } else if (!selectedRoomTypeId && roomTypesData.length > 0) {
          setSelectedRoomTypeId(roomTypesData[0].id);
        }
      });
    }
  }, [hotelId, roomTypeIdFromUrl, timeSlotIdFromUrl]);

  const {
    bookingState,
    updateDate,
    updateTimeSlot,
    updateGuestCount,
    resetBooking,
  } = useBooking();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  // Vérifier la session et rediriger si non connecté
  useEffect(() => {
    if (!isSessionPending && !session?.user?.id) {
      router.push("/login");
    }
  }, [session, isSessionPending, router]);

  // Afficher un loader pendant la vérification de la session
  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-client-primary-600" />
      </div>
    );
  }

  // Rediriger si non connecté (sécurité supplémentaire)
  if (!session?.user?.id) {
    return null;
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hôtel introuvable</h1>
          <p className="text-gray-600 mb-4">L'hôtel que vous recherchez n'existe pas.</p>
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
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleGuestCountChange = (count: { adults: number; children: number }) => {
    setGuestCount(count);
    updateGuestCount(count);
    if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      // Vérifier que l'utilisateur est connecté
      if (!session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour réserver",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      if (!selectedRoomTypeId) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un type de chambre",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const roomTypeId = selectedRoomTypeId;

      const result = await createBooking(
        {
          hotelId: hotel.id,
          roomTypeId: roomTypeId,
          date: selectedDate.toISOString().split("T")[0],
          timeSlotId: selectedTimeSlot.id,
          guestCount: guestCount,
          guestInfo: data,
          specialRequests: undefined,
          promotionCode: undefined,
        },
        session.user.id
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
        description: "Votre réservation a été confirmée",
        variant: "success",
      });

      // Rediriger vers la page de confirmation
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
          <BookingStepper currentStep={currentStep} steps={steps} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              {/* Step 1: Time Slot */}
              {currentStep === 1 && (
                <TimeSlotSelector
                  slots={timeSlots}
                  selectedSlotId={selectedTimeSlot?.id || null}
                  onSelect={handleTimeSlotSelect}
                />
              )}

              {/* Step 2: Guest Count */}
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

              {/* Step 3: Guest Info */}
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

              {/* Navigation buttons for steps 1 and 2 */}
              {currentStep < 3 && (
                <div className="flex gap-4 pt-6 border-t border-gray-100 mt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      Retour
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

          {/* Right Column: Summary */}
          <div className="space-y-6">
            <BookingSummary
              hotel={hotel}
              date={selectedDate}
              timeSlot={selectedTimeSlot}
              guestCount={guestCount}
              price={hotel.minPrice}
              currency={hotel.currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

