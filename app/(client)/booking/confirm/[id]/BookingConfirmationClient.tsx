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
import { useGlobalLoading } from "@/components/shared/GlobalLoadingProvider";

interface BookingConfirmationClientProps {
  booking: Booking;
  hotel: Hotel;
}

function formatPrice(currency: string, amount: number) {
  return `${currency === "USD" ? "$" : currency} ${amount}`;
}

function getPaymentButtonLabel(
  method: string,
  currency: string,
  amount: number,
) {
  const price = formatPrice(currency, amount);
  switch (method) {
    case "cash":
      return "Confirmer — je paierai à l'hôtel";
    case "mobile_money":
      return `Payer ${price} via Mobile Money`;
    default:
      return `Payer ${price} par carte`;
  }
}

function getPaymentHelperText(method: string) {
  switch (method) {
    case "cash":
      return "Votre réservation sera confirmée. Vous réglez le montant à la réception de l'hôtel.";
    case "mobile_money":
      return "Vous recevrez les instructions de paiement par SMS. La réservation sera confirmée après validation.";
    default:
      return "Votre réservation sera confirmée une fois le paiement accepté.";
  }
}

export function BookingConfirmationClient({
  booking,
  hotel,
}: BookingConfirmationClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { runWithLoading } = useGlobalLoading();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const isPending = booking.status === "PENDING";

  const handlePayment = async () => {
    if (!isPending) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await runWithLoading(() =>
        processPayment(booking.id, paymentMethod),
      );

      if (result.success) {
        toast({
          title: "Réservation confirmée !",
          description:
            paymentMethod === "cash"
              ? "Présentez-vous à l'hôtel avec votre QR code."
              : "Votre paiement a été accepté.",
          variant: "success",
        });

        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description:
            result.error ||
            "Une erreur est survenue lors de la confirmation de votre réservation.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 lg:py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2"
          size="sm"
        >
          ← Retour
        </Button>

        {isPending ? (
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-stretch">
            <ConfirmationCard
              booking={booking}
              hotel={hotel}
              compact
              showActions={false}
              showImportantNote={false}
            />

            <div className="mt-6 lg:mt-0 flex flex-col gap-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shrink-0">
                <strong>En attente de confirmation</strong> — finalisez le
                paiement pour bloquer votre créneau.
              </div>

              <PaymentMethods
                selectedMethod={paymentMethod}
                onMethodSelect={setPaymentMethod}
                compact
              />

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 shrink-0">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white py-5 text-base font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    getPaymentButtonLabel(
                      paymentMethod,
                      booking.currency,
                      booking.totalPrice,
                    )
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {getPaymentHelperText(paymentMethod)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ConfirmationCard booking={booking} hotel={hotel} compact />
          </div>
        )}
      </div>
    </div>
  );
}
