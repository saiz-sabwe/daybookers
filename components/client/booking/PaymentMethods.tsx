"use client";

import { CreditCard, Smartphone, Wallet, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PaymentMethodsProps {
  onMethodSelect?: (method: string) => void;
  selectedMethod?: string;
}

export function PaymentMethods({ onMethodSelect, selectedMethod: initialSelected }: PaymentMethodsProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-client-primary-600" />
          Moyens de paiement
        </CardTitle>
        <CardDescription>
          Sélectionnez votre mode de paiement préféré
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange} className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="relative">
              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedMethod === method.id
                    ? "border-client-primary-500 bg-client-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  disabled={!method.available}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={method.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <method.icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </Label>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle2 className="w-5 h-5 text-client-primary-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </RadioGroup>

        {selectedMethod === "card" && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Sécurisé :</strong> Vos informations de carte sont cryptées et sécurisées.
            </p>
          </div>
        )}

        {selectedMethod === "mobile_money" && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Mobile Money :</strong> Vous recevrez un code de paiement par SMS après la confirmation.
            </p>
          </div>
        )}

        {selectedMethod === "cash" && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Paiement sur place :</strong> Vous pouvez payer directement à la réception de l'hôtel.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

