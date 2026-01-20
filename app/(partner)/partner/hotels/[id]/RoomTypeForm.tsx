"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createRoomType } from "@/app/actions/partner/room-types/create";
import { updateRoomType } from "@/app/actions/partner/room-types/update";

const roomTypeSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  description: z.string().optional(),
  maxGuests: z.number().min(1, "Le nombre de personnes doit être au moins 1").max(10, "Le nombre de personnes ne peut pas dépasser 10"),
  basePrice: z.number().min(0, "Le prix doit être positif"),
  currency: z.string().default("USD"),
});

type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;

interface RoomTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string;
  userId: string;
  roomType?: any; // Si défini, c'est une modification, sinon c'est une création
  onSuccess?: () => void;
}

export function RoomTypeForm({
  open,
  onOpenChange,
  hotelId,
  userId,
  roomType,
  onSuccess,
}: RoomTypeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!roomType;

  const form = useForm<RoomTypeFormValues>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      maxGuests: 2,
      basePrice: 0,
      currency: "USD",
    },
  });

  // Mettre à jour les valeurs du formulaire quand roomType change
  useEffect(() => {
    if (roomType) {
      form.reset({
        name: roomType.name || "",
        description: roomType.description || "",
        maxGuests: roomType.maxGuests || 2,
        basePrice: roomType.basePrice || 0,
        currency: roomType.currency || "USD",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        maxGuests: 2,
        basePrice: 0,
        currency: "USD",
      });
    }
  }, [roomType, form]);

  const onSubmit = async (data: RoomTypeFormValues) => {
    setIsSubmitting(true);
    try {
      let result;
      if (isEditing) {
        result = await updateRoomType(userId, roomType.id, data);
      } else {
        result = await createRoomType(userId, {
          hotelId,
          ...data,
        });
      }

      if (result.success) {
        toast({
          title: isEditing ? "Type de chambre mis à jour" : "Type de chambre créé",
          description: isEditing
            ? "Les modifications ont été enregistrées avec succès"
            : "Le type de chambre a été créé avec succès",
          variant: "default",
        });
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le type de chambre" : "Ajouter un type de chambre"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations du type de chambre"
              : "Remplissez les informations pour créer un nouveau type de chambre"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du type de chambre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Chambre Standard" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Description du type de chambre" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de personnes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="USD" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de base</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Modification..." : "Création..."}
                  </>
                ) : (
                  isEditing ? "Modifier" : "Créer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

