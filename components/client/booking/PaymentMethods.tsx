"use client";

import { CreditCard, Smartphone, Wallet, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PaymentMethodsProps {
  onMethodSelect?: (method: string) => void;
  selectedMethod?: string;
  compact?: boolean;
}

export function PaymentMethods({
  onMethodSelect,
  selectedMethod: initialSelected,
  compact = false,
}: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState(initialSelected || "card");

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    onMethodSelect?.(value);
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Carte bancaire",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      available: true,
    },
    {
      id: "mobile_money",
      name: "Mobile Money",
      description: "M-Pesa, Orange Money, Airtel Money",
      icon: Smartphone,
      available: true,
    },
    {
      id: "cash",
      name: "Paiement à l'hôtel",
      description: "Espèces ou carte sur place",
      icon: Wallet,
      available: true,
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className={compact ? "pb-3" : undefined}>
        <CardTitle className={`flex items-center gap-2 ${compact ? "text-base" : ""}`}>
          <CreditCard className="w-5 h-5 text-client-primary-600" />
          Moyens de paiement
        </CardTitle>
        <CardDescription className={compact ? "text-xs" : undefined}>
          Choisissez comment régler votre réservation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <RadioGroup
          value={selectedMethod}
          onValueChange={handleMethodChange}
          className={compact ? "space-y-2" : "space-y-3"}
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="relative">
              <div
                className={`flex items-center space-x-3 rounded-lg border-2 transition-all cursor-pointer ${
                  compact ? "p-3" : "p-4 items-start"
                } ${
                  selectedMethod === method.id
                    ? "border-client-primary-500 bg-client-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  disabled={!method.available}
                  className={compact ? "" : "mt-1"}
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={method.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <method.icon className="w-4 h-4 text-gray-600 shrink-0" />
                    <div className="min-w-0">
                      <p className={`font-medium text-gray-900 ${compact ? "text-sm" : ""}`}>
                        {method.name}
                      </p>
                      <p className={`text-gray-500 truncate ${compact ? "text-xs" : "text-sm"}`}>
                        {method.description}
                      </p>
                    </div>
                  </Label>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle2 className="w-4 h-4 text-client-primary-600 shrink-0" />
                )}
              </div>
            </div>
          ))}
        </RadioGroup>

        {selectedMethod === "card" && (
          <div className={`${compact ? "mt-2 p-2" : "mt-4 p-3"} bg-blue-50 border border-blue-200 rounded-lg`}>
            <p className={`text-blue-800 ${compact ? "text-xs" : "text-sm"}`}>
              <strong>Sécurisé :</strong> Paiement crypté et sécurisé.
            </p>
          </div>
        )}

        {selectedMethod === "mobile_money" && (
          <div className={`${compact ? "mt-2 p-2" : "mt-4 p-3"} bg-green-50 border border-green-200 rounded-lg`}>
            <p className={`text-green-800 ${compact ? "text-xs" : "text-sm"}`}>
              <strong>Mobile Money :</strong> Instructions envoyées par SMS.
            </p>
          </div>
        )}

        {selectedMethod === "cash" && (
          <div className={`${compact ? "mt-2 p-2" : "mt-4 p-3"} bg-amber-50 border border-amber-200 rounded-lg`}>
            <p className={`text-amber-800 ${compact ? "text-xs" : "text-sm"}`}>
              <strong>Sur place :</strong> Réglez à la réception de l&apos;hôtel.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

