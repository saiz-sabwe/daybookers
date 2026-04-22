"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const requestPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

type RequestPasswordFormValues = z.infer<typeof requestPasswordSchema>;

export function RequestPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestPasswordFormValues>({
    resolver: zodResolver(requestPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RequestPasswordFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Appeler l'API Better Auth pour demander un lien de réinitialisation
      // Ex: authClient.forgetPassword({ email: data.email })
      console.log("Request password (non implémenté)", data.email);
      toast({
        title: "Fonctionnalité à venir",
        description: "L'envoi du lien de réinitialisation sera disponible prochainement.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="votre@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le lien"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link href="/login" className="font-medium text-client-primary-600 hover:text-client-primary-500">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
