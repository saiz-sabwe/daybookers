"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/client/dashboard/DashboardPageHeader";
import { HotelCard } from "@/components/client/HotelCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/utils/EmptyState";
import { Hotel } from "@/types";
import { Heart, HeartOff } from "lucide-react";
import { getFavorites } from "@/app/actions/favorites/get";
import { deleteFavorite } from "@/app/actions/favorites/delete";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useToast } from "@/hooks/use-toast";
import { useGlobalLoading } from "@/components/shared/GlobalLoadingProvider";
import { resolveHotelImage } from "@/lib/images/hotel-image";

function FavoriteCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-[75%]" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

function FavoritesListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <FavoriteCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FavoritesList({
  favoriteHotels: initialFavoriteHotels,
}: {
  favoriteHotels?: Hotel[];
}) {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const { toast } = useToast();
  const { runWithLoading } = useGlobalLoading();
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>(
    initialFavoriteHotels || [],
  );
  const [isLoading, setIsLoading] = useState(!initialFavoriteHotels);

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    if (!initialFavoriteHotels && isAuthenticated) {
      setIsLoading(true);
      runWithLoading(() => getFavorites())
        .then((hotels) => {
          setFavoriteHotels(hotels);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (initialFavoriteHotels || !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthPending, initialFavoriteHotels, runWithLoading]);

  const handleRemoveFavorite = async (hotelId: string) => {
    if (!isAuthenticated) return;

    const result = await runWithLoading(() => deleteFavorite(hotelId));

    if (!result.success) {
      toast({
        title: "Impossible de retirer le favori",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setFavoriteHotels(favoriteHotels.filter((h) => h.id !== hotelId));
      toast({
        title: "Favori retiré",
        description: "L'hôtel a été retiré de vos favoris.",
        variant: "success",
      });
    }
  };

  const description = isLoading
    ? "Chargement de vos favoris..."
    : favoriteHotels.length === 0
      ? "Vos hôtels favoris apparaîtront ici"
      : `${favoriteHotels.length} hôtel${favoriteHotels.length > 1 ? "s" : ""} sauvegardé${favoriteHotels.length > 1 ? "s" : ""}`;

  return (
    <div>
      <DashboardPageHeader icon={Heart} title="Mes favoris" description={description} />

      {isLoading ? null : favoriteHotels.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aucun favori"
          description="Commencez à ajouter des hôtels à vos favoris pour les retrouver facilement."
          actionLabel="Explorer les hôtels"
          onAction={() => (window.location.href = "/hotels")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoriteHotels.map((hotel) => (
            <div key={hotel.id} className="group relative">
              <HotelCard
                id={hotel.id}
                name={hotel.name}
                city={`${hotel.city}, ${hotel.country}`}
                image={resolveHotelImage(hotel.images?.[0])}
                stars={hotel.stars}
                rating={hotel.rating}
                reviewCount={hotel.reviewCount}
                minPrice={hotel.minPrice}
                timeSlots={[]}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 z-10 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
                onClick={() => handleRemoveFavorite(hotel.id)}
                aria-label="Retirer des favoris"
              >
                <HeartOff className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
