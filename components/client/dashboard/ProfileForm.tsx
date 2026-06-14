"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDisplayName, StoredUserProfile } from "@/lib/api/user-profile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, User } from "lucide-react";
import { useClientAuth } from "@/hooks/use-client-auth";
import { updateProfile } from "@/app/actions/users/update-profile";
import { DashboardPageHeader } from "@/components/client/dashboard/DashboardPageHeader";
import { getCurrentProfile } from "@/app/actions/auth/get-current-profile";
import { storeUserProfile } from "@/lib/api/auth-storage";
import { useGlobalLoading } from "@/components/shared/GlobalLoadingProvider";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        (value.length >= 10 && /^[\d\s+\-()]+$/.test(value)),
      "Numéro de téléphone invalide (min. 10 chiffres)",
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function buildFormValues(
  profile: StoredUserProfile | null,
  userEmail: string | null,
  userName: string,
): ProfileFormValues {
  const name =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
    userName ||
    "";

  return {
    name: name === "Utilisateur" ? "" : name,
    email: profile?.email || userEmail || "",
    phone: profile?.phone || "",
  };
}

export function ProfileForm() {
  const { isAuthenticated, isAuthPending, userEmail, userName, userProfile } =
    useClientAuth();
  const { toast } = useToast();
  const { runWithLoading } = useGlobalLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProfileReady, setIsProfileReady] = useState(false);
  const [loadedProfile, setLoadedProfile] = useState(userProfile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    if (!isAuthenticated) {
      setIsProfileReady(true);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      await runWithLoading(async () => {
        const profile = userProfile ?? (await getCurrentProfile());

        if (cancelled) {
          return;
        }

        if (profile) {
          storeUserProfile(profile);
          setLoadedProfile(profile);
        }

        form.reset(buildFormValues(profile, userEmail, userName));
        setIsProfileReady(true);
      });
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthPending, isAuthenticated, userProfile, userEmail, userName, form, runWithLoading]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour mettre à jour votre profil",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const result = await runWithLoading(() =>
        updateProfile({
          name: data.name,
          phone: data.phone,
        }),
      );

      if (!result.success || !result.profile) {
        toast({
          title: "Erreur",
          description:
            result.error ||
            "Une erreur est survenue lors de la mise à jour du profil",
          variant: "destructive",
        });
        return;
      }

      storeUserProfile(result.profile);
      setLoadedProfile(result.profile);

      form.reset(
        buildFormValues(
          result.profile,
          result.profile.email || userEmail,
          getUserDisplayName(result.profile, userEmail),
        ),
      );

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
        variant: "success",
      });

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardPageHeader
        icon={User}
        title="Mon profil"
        description="Gérez vos informations personnelles"
      />

      {isProfileReady ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-gray-100 shadow-md">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
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
                        <Input
                          type="email"
                          readOnly
                          disabled
                          {...field}
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormDescription>
                        L&apos;email de connexion ne peut pas être modifié ici
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+243 900 000 000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Requis pour vous contacter concernant vos réservations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <Button
                    type="submit"
                    className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Enregistré
                      </>
                    ) : (
                      "Enregistrer les modifications"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      ) : null}
    </div>
  );
}
