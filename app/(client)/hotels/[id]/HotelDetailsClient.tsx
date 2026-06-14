"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HotelGallery } from "@/components/client/hotel/HotelGallery";
import { Hotel } from "@/types";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createFavorite } from "@/app/actions/favorites/create";
import { deleteFavorite } from "@/app/actions/favorites/delete";
import { isFavorite } from "@/app/actions/favorites/get";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HotelDetailsClientProps {
  hotel: Hotel;
  roomTypes: any[];
}

export function HotelDetailsClient({ hotel }: HotelDetailsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    if (isAuthenticated) {
      isFavorite(hotel.id).then((fav) => {
        setIsFavoriteState(fav);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthPending, hotel.id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/hotels/${hotel.id}`)}`);
      return;
    }

    setIsToggling(true);
    try {
      if (isFavoriteState) {
        const result = await deleteFavorite(hotel.id);
        if (result.success) {
          setIsFavoriteState(false);
          toast({
            title: "Favori retiré",
            description: "L'hôtel a été retiré de vos favoris.",
            variant: "success",
          });
        } else {
          toast({
            title: "Impossible de retirer le favori",
            description: result.error,
            variant: "destructive",
          });
        }
      } else {
        const result = await createFavorite(hotel.id);
        if (result.success) {
          setIsFavoriteState(true);
          toast({
            title: "Ajouté aux favoris",
            description: "L'hôtel a été ajouté à vos favoris.",
            variant: "success",
          });
        } else {
          toast({
            title: "Impossible d'ajouter aux favoris",
            description: result.error,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du toggle du favori:", error);
      toast({
        title: "Une erreur est survenue",
        description: "Veuillez réessayer dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="relative">
      <HotelGallery images={hotel.images} />
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/90 hover:bg-white backdrop-blur-sm"
          onClick={handleToggleFavorite}
          disabled={isLoading || isToggling}
        >
          <Heart
            className={cn(
              "w-5 h-5",
              isFavoriteState ? "fill-red-500 text-red-500" : "text-gray-700"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
