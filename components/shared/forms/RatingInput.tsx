"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxRating?: number;
  disabled?: boolean;
}

export function RatingInput({
  value,
  onChange,
  maxRating = 5,
  disabled = false,
}: RatingInputProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxRating }).map((_, index) => {
        const rating = index + 1;
        const isFilled = rating <= value;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => !disabled && onChange(rating)}
            disabled={disabled}
            className={cn(
              "transition-colors",
              disabled && "cursor-not-allowed",
              !disabled && "hover:scale-110"
            )}
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200",
                !disabled && isFilled && "hover:fill-yellow-500 hover:text-yellow-500",
                !disabled && !isFilled && "hover:fill-yellow-200 hover:text-yellow-200"
              )}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {value} / {maxRating}
        </span>
      )}
    </div>
  );
}

