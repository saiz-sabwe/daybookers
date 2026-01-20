"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { respondToReview } from "@/app/actions/partner/reviews/respond";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, Edit } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const responseSchema = z.object({
  response: z
    .string()
    .min(1, "La réponse ne peut pas être vide")
    .max(2000, "La réponse ne peut pas dépasser 2000 caractères"),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

interface ReviewResponseProps {
  reviewId: string;
  userId: string;
  existingResponse?: string | null;
  responseAt?: Date | null;
  onSuccess?: () => void;
}

export function ReviewResponse({
  reviewId,
  userId,
  existingResponse,
  responseAt,
  onSuccess,
}: ReviewResponseProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: existingResponse || "",
    },
  });

  const onSubmit = async (data: ResponseFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await respondToReview(userId, reviewId, data);

      if (result.success) {
        toast({
          title: existingResponse ? "Réponse mise à jour" : "Réponse ajoutée",
          description: existingResponse
            ? "Votre réponse a été mise à jour avec succès"
            : "Votre réponse a été ajoutée avec succès",
          variant: "default",
        });
        setIsEditing(false);
        onSuccess?.();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la réponse",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (existingResponse && !isEditing) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-partner-primary-500">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-partner-primary-600" />
            <span className="text-sm font-medium text-partner-primary-600">
              Votre réponse
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7"
          >
            <Edit className="w-3 h-3 mr-1" />
            Modifier
          </Button>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{existingResponse}</p>
        {responseAt && (
          <p className="text-xs text-gray-500 mt-2">
            Répondu le {format(new Date(responseAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="response"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  {existingResponse ? "Modifier votre réponse" : "Répondre à cet avis"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Écrivez votre réponse ici..."
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  {field.value?.length || 0} / 2000 caractères
                </p>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {existingResponse ? "Modification..." : "Envoi..."}
                </>
              ) : (
                existingResponse ? "Modifier" : "Publier la réponse"
              )}
            </Button>
            {existingResponse && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  form.reset({ response: existingResponse });
                }}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

