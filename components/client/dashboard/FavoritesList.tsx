"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/utils/EmptyState";
import { Hotel } from "@/types";
import { HeartOff } from "lucide-react";
import { getFavorites } from "@/app/actions/favorites/get";
import { deleteFavorite } from "@/app/actions/favorites/delete";
import { authClient } from "@/lib/better-auth-client";
import { useToast } from "@/hooks/use-toast";

export function FavoritesList({ favoriteHotels: initialFavoriteHotels }: { favoriteHotels?: Hotel[] }) {
  const { data: session } = authClient.useSession();
  const { toast } = useToast();
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>(initialFavoriteHotels || []);

  useEffect(() => {
    if (!initialFavoriteHotels && session?.user?.id) {
      getFavorites(session.user.id).then((hotels) => {
        setFavoriteHotels(hotels);
      });
    }
  }, [session?.user?.id, initialFavoriteHotels]);

  const handleRemoveFavorite = async (hotelId: string) => {
    if (!session?.user?.id) return;

    const result = await deleteFavorite(hotelId, session.user.id);

    if (result.success) {
      setFavoriteHotels(favoriteHotels.filter((h) => h.id !== hotelId));
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
  };

  if (favoriteHotels.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mes favoris</h2>
          <p className="text-gray-600">Vos hôtels favoris apparaîtront ici</p>
        </div>
        <EmptyState
          icon={Heart}
          title="Aucun favori"
          description="Commencez à ajouter des hôtels à vos favoris pour les retrouver facilement."
          actionLabel="Explorer les hôtels"
          onAction={() => window.location.href = "/hotels"}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mes favoris</h2>
        <p className="text-gray-600">Vos hôtels favoris ({favoriteHotels.length})</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="group relative bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {hotel.images && hotel.images[0] && (
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={hotel.images[0]}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm"
                  onClick={() => handleRemoveFavorite(hotel.id)}
                >
                  <HeartOff className="w-5 h-5 text-red-500 fill-red-500" />
                </Button>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-xl text-white mb-1 drop-shadow-lg">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.city}, {hotel.country}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold ml-1 text-gray-900">{hotel.rating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({hotel.reviewCount} avis)
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-client-primary-600">
                    {hotel.currency === "USD" ? "$" : hotel.currency} {hotel.minPrice}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">/jour</span>
                </div>
                <Button asChild size="sm" className="bg-client-primary-600 hover:bg-client-primary-700">
                  <Link href={`/hotels/${hotel.id}`}>Voir</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

