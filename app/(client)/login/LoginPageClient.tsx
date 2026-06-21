"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { signin } from "@/app/actions/auth/signin";
import { storeApiSession } from "@/lib/api/auth-storage";
import { useGlobalLoading } from "@/components/shared/GlobalLoadingProvider";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { runWithLoading, startLoading } = useGlobalLoading();
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl");
  const decodedCallback =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : callbackUrl
        ? (() => {
            try {
              const decoded = decodeURIComponent(callbackUrl);
              return decoded.startsWith("/") && !decoded.startsWith("//")
                ? decoded
                : "/";
            } catch {
              return "/";
            }
          })()
        : "/";
  const safeRedirectUrl = decodedCallback;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await runWithLoading(() =>
        signin({
          email: data.email,
          password: data.password,
        }),
      );

      if (!result.success || !result.token || !result.profile) {
        toast({
          title: "Connexion échouée",
          description: result.error ?? "Email ou mot de passe incorrect. Vérifiez vos identifiants.",
          variant: "destructive",
        });
        return;
      }

      storeApiSession(
        result.token,
        result.profile,
        result.permissionCatalog ?? [],
      );

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
        variant: "success",
        duration: 1500,
      });

      startLoading();
      window.location.href = safeRedirectUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer.";

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-md">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Connexion à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link href="/register" className="font-medium text-client-primary-600 hover:text-client-primary-500">
            créez un compte gratuitement
          </Link>
        </p>
      </div>

      <div className="mx-auto mt-5 w-full max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-lg sm:px-8">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Se souvenir de moi
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" type="button" disabled>
                Facebook
              </Button>
              <Button variant="outline" className="w-full" type="button" disabled>
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
