"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPartnerReviews } from "@/app/actions/partner/reviews/get";
import { useClientAuth } from "@/hooks/use-client-auth";
import { Star, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ReviewResponse } from "@/components/partner/reviews/ReviewResponse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { Hotel } from "@/types";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";

export default function PartnerReviewsPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchHotels = async () => {
      if (isAuthPending || !isAuthenticated) {
        return;
      }

      try {
        const hotelsData = await getPartnerHotels("");
        setHotels(hotelsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des hôtels:", error);
      }
    };

    fetchHotels();
  }, [isAuthenticated, isAuthPending]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (isAuthPending || !isAuthenticated) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await getPartnerReviews("", {
          hotelId: selectedHotelId !== "all" ? selectedHotelId : undefined,
          rating: selectedRating !== "all" ? parseInt(selectedRating) : undefined,
          page,
          pageSize,
        });
        setReviews(result.reviews);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error("Erreur lors de la récupération des avis:", err);
        setError("Impossible de charger les avis. Veuillez réessayer.");
        setReviews([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [isAuthenticated, isAuthPending, page, selectedHotelId, selectedRating]);

  // Réinitialiser la page à 1 quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [selectedHotelId, selectedRating]);

  const handleRefresh = () => {
    if (isAuthenticated) {
      getPartnerReviews("", {
        hotelId: selectedHotelId !== "all" ? selectedHotelId : undefined,
        rating: selectedRating !== "all" ? parseInt(selectedRating) : undefined,
        page,
        pageSize,
      }).then((result) => {
        setReviews(result.reviews);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      });
    }
  };

  if (isLoading && reviews.length === 0) {
    return (
      <RequirePagePermission redirectTo="/partner/dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
        </div>
      </RequirePagePermission>
    );
  }

  return (
    <RequirePagePermission redirectTo="/partner/dashboard">
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={Star}
        title="Avis clients"
        description="Gérez et répondez aux avis de vos clients"
      />

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Hôtel</label>
                <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les hôtels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les hôtels</SelectItem>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Note</label>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les notes</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des avis ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
              >
                Réessayer
              </Button>
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-partner-text-primary">
                          {review.user.name}
                        </p>
                        <p className="text-sm text-gray-600">{review.hotel.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <p className="font-medium mb-2">{review.title}</p>
                    )}
                    <p className="text-gray-600 mb-2 whitespace-pre-wrap">{review.comment}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      {format(new Date(review.createdAt), "d MMMM yyyy", { locale: fr })}
                    </p>

                    {/* Réponse du partenaire */}
                    {isAuthenticated && (
                      <ReviewResponse
                        reviewId={review.id}
                        userId=""
                        existingResponse={review.response}
                        responseAt={review.responseAt}
                        onSuccess={handleRefresh}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Affichage de {(page - 1) * pageSize + 1} à {Math.min(page * pageSize, total)}{" "}
                    sur {total} avis
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Précédent
                    </Button>
                    <div className="text-sm text-gray-600">
                      Page {page} sur {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun avis pour le moment</p>
          )}
        </CardContent>
      </Card>
    </div>
    </RequirePagePermission>
  );
}
