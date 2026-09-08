"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { updateHotel } from "@/app/actions/partner/hotels/update";
import type { AdminHotelDetail } from "@/app/actions/admin/hotels/get";
import { useToast } from "@/hooks/use-toast";
import { PermissionGate } from "@/components/shared/auth/PermissionGate";
import { ImageUploadField } from "@/components/shared/forms/ImageUploadField";
import { djangoPerm } from "@/lib/auth/django-perm";

const hotelSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  description: z.string().optional(),
  address: z.string().min(1, "L'adresse est obligatoire"),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  stars: z.number().min(0).max(5).optional(),
  images: z.array(z.string()),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

interface AdminHotelEditDialogProps {
  hotel: AdminHotelDetail;
}

export function AdminHotelEditDialog({ hotel }: AdminHotelEditDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel.name,
      description: hotel.description || "",
      address: hotel.address,
      phone: hotel.phone || "",
      email: hotel.email || "",
      website: hotel.website || "",
      stars: hotel.stars,
      images: hotel.images ?? [],
    },
  });

  const onSubmit = async (data: HotelFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateHotel(hotel.id, data, "");
      if (result.success) {
        toast({
          title: "Hôtel mis à jour",
          description: "Les modifications ont été enregistrées avec succès",
          variant: "default",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PermissionGate permissions={[djangoPerm("hotels", "hotel", "change")]}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-admin-primary-500 hover:bg-admin-primary-600 text-white"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'hôtel</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de « {hotel.name} ».
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'hôtel</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d'étoiles</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos de l'hôtel</FormLabel>
                    <FormControl>
                      <ImageUploadField
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PermissionGate>
  );
}
