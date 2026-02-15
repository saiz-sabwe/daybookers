"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationCard } from "@/components/client/booking/ConfirmationCard";
import { PaymentMethods } from "@/components/client/booking/PaymentMethods";
import { Button } from "@/components/ui/button";
import { Booking, Hotel } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { processPayment } from "@/app/actions/bookings/process-payment";

interface BookingConfirmationClientProps {
  booking: Booking;
  hotel: Hotel;
}

export function BookingConfirmationClient({
  booking,
  hotel,
}: BookingConfirmationClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Afficher les moyens de paiement uniquement si la réservation est en attente
  const showPaymentMethods = booking.status === "PENDING";

  const handlePayment = async () => {
    if (!showPaymentMethods) return;

    setIsProcessing(true);

    try {
      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Appeler l'action serveur pour traiter le paiement
      const result = await processPayment(booking.id, paymentMethod);

      if (result.success) {
        toast({
          title: "Paiement réussi !",
          description: "Votre réservation a été confirmée avec succès.",
          variant: "default",
        });

        // Recharger la page pour afficher le nouveau statut
        router.refresh();
        
        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast({
          title: "Erreur de paiement",
          description: result.error || "Une erreur est survenue lors du traitement de votre paiement.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Retour
          </Button>
        </div>

        <div className="space-y-6">
          {/* Payment Methods - Affiché uniquement si la réservation est en attente */}
          {showPaymentMethods && (
            <>
              <PaymentMethods 
                selectedMethod={paymentMethod}
                onMethodSelect={setPaymentMethod}
              />
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white py-6 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    `Payer ${booking.currency === "USD" ? "$" : booking.currency} ${booking.totalPrice}`
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  En cliquant sur "Payer", vous confirmez votre réservation
                </p>
              </div>
            </>
          )}

          {/* Confirmation Card */}
          <ConfirmationCard booking={booking} hotel={hotel} />
        </div>
      </div>
    </div>
  );
}

