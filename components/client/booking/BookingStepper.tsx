"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStepperProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
}

export function BookingStepper({ currentStep, steps }: BookingStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isCompleted &&
                      "bg-client-primary-500 border-client-primary-500 text-white",
                    isCurrent &&
                      "bg-client-primary-100 border-client-primary-500 text-client-primary-700",
                    isUpcoming &&
                      "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-client-primary-700",
                      isCompleted && "text-gray-600",
                      isUpcoming && "text-gray-400"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p
                      className={cn(
                        "text-xs mt-1",
                        isCurrent && "text-client-primary-600",
                        !isCurrent && "text-gray-400"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    isCompleted ? "bg-client-primary-500" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

