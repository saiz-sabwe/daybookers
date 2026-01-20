"use client";

import Image from "next/image";
import { Star, MapPin, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hotel } from "@/types";
import { PartnerBadge } from "./PartnerBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HotelHeaderProps {
  hotel: Hotel;
  partnerName?: string;
  onShare?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function HotelHeader({
  hotel,
  partnerName,
  onShare,
  onFavorite,
  isFavorite = false,
}: HotelHeaderProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setImageIndex((prev) => (prev > 0 ? prev - 1 : (hotel.images?.length || 1) - 1));
  };

  const handleNextImage = () => {
    setImageIndex((prev) => (prev < (hotel.images?.length || 1) - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Image Gallery */}
      {hotel.images && hotel.images.length > 0 && (
        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={hotel.images[imageIndex]}
            alt={hotel.name}
            fill
            className="object-cover"
            priority
          />

          {/* Navigation Arrows */}
          {hotel.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={handlePreviousImage}
              >
                ←
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={handleNextImage}
              >
                →
              </Button>
            </>
          )}

          {/* Image Indicators */}
          {hotel.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {hotel.images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === imageIndex ? "bg-white w-8" : "bg-white/50"
                  )}
                  onClick={() => setImageIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            {onFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 hover:bg-white"
                onClick={onFavorite}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                  )}
                />
              </Button>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 hover:bg-white"
                onClick={onShare}
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Hotel Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{hotel.city}, {hotel.country}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">{hotel.rating}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({hotel.reviewCount} avis)
                </span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span>{hotel.stars} étoiles</span>
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-client-primary-600">
              {hotel.currency === "USD" ? "$" : hotel.currency} {hotel.minPrice}
            </div>
            <div className="text-sm text-gray-500">par jour</div>
          </div>
        </div>

        {partnerName && (
          <div>
            <PartnerBadge partnerName={partnerName} />
          </div>
        )}
      </div>
    </div>
  );
}

