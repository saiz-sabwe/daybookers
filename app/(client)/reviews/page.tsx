"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RatingInput } from "@/components/shared/forms/RatingInput";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/better-auth-client";
import { useState, useEffect } from "react";
import { getHotels } from "@/app/actions/hotels/get";
import { Hotel } from "@/types";
import { createReview } from "@/app/actions/reviews/create";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reviewSchema = z.object({
  hotelId: z.string().min(1, "Veuillez sélectionner un hôtel"),
  rating: z.number().min(1, "Veuillez donner une note").max(5),
  comment: z.string().min(10, "Le commentaire doit contenir au moins 10 caractères"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function ReviewsPage() {
  const { toast } = useToast();
  const { data: session } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    getHotels().then(setHotels);
  }, []);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      hotelId: "",
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!session?.user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier un avis",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      // TODO: Récupérer bookingId depuis les réservations de l'utilisateur
      // Pour l'instant, on utilise un ID mocké
      const bookingId = "mock-booking-id";

      const result = await createReview(
        {
          hotelId: data.hotelId,
          bookingId: bookingId,
          rating: data.rating,
          title: undefined,
          comment: data.comment,
        },
        session.user.id
      );

      if (!result.success) {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de la publication de votre avis",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Avis publié",
        description: "Merci pour votre avis ! Il sera visible après modération.",
        variant: "success",
      });

      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la publication de l'avis:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication de votre avis",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donner un avis</h1>
          <p className="text-gray-600">
            Partagez votre expérience et aidez d'autres voyageurs à faire leur choix
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hôtel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un hôtel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel.id} value={hotel.id}>
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Sélectionnez l'hôtel pour lequel vous souhaitez laisser un avis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <RatingInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Donnez une note de 1 à 5 étoiles
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre avis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre expérience à l'hôtel..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 10 caractères. Soyez constructif et respectueux.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publication...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publié
                    </>
                  ) : (
                    "Publier mon avis"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

