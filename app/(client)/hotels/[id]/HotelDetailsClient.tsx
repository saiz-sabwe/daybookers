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
import { authClient } from "@/lib/better-auth-client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HotelDetailsClientProps {
  hotel: Hotel;
  roomTypes: any[];
}

export function HotelDetailsClient({ hotel }: HotelDetailsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = authClient.useSession();
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      isFavorite(hotel.id, session.user.id).then((fav) => {
        setIsFavoriteState(fav);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [session?.user?.id, hotel.id]);

  const handleToggleFavorite = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    setIsToggling(true);
    try {
      if (isFavoriteState) {
        const result = await deleteFavorite(hotel.id, session.user.id);
        if (result.success) {
          setIsFavoriteState(false);
          toast({
            title: "Favori supprimé",
            description: "L'hôtel a été retiré de vos favoris",
            variant: "success",
          });
        } else {
          toast({
            title: "Erreur",
            description: result.error || "Une erreur est survenue",
            variant: "destructive",
          });
        }
      } else {
        const result = await createFavorite(hotel.id, session.user.id);
        if (result.success) {
          setIsFavoriteState(true);
          toast({
            title: "Ajouté aux favoris",
            description: "L'hôtel a été ajouté à vos favoris",
            variant: "success",
          });
        } else {
          toast({
            title: "Erreur",
            description: result.error || "Une erreur est survenue",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du toggle du favori:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
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

