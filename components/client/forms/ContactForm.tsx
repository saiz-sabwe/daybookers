"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SUBJECT_OPTIONS = [
  { value: "reservation", label: "Question sur une réservation" },
  { value: "partner", label: "Devenir partenaire (Hôtelier)" },
  { value: "press", label: "Presse / Médias" },
  { value: "careers", label: "Recrutement" },
  { value: "other", label: "Autre demande" },
] as const;

function createContactSchema(showEmail: boolean) {
  return z.object({
    fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().refine(
      (value) =>
        !showEmail || z.string().email().safeParse(value).success,
      { message: "Email invalide" },
    ),
    phone: z
      .string()
      .min(8, "Numéro invalide")
      .regex(/^[\d\s+\-()]+$/, "Format de téléphone invalide"),
    subject: z.string().min(1, "Veuillez sélectionner un sujet"),
    message: z
      .string()
      .min(10, "Le message doit contenir au moins 10 caractères"),
  });
}

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

interface ContactFormProps {
  showEmail?: boolean;
  submitLabel?: string;
  className?: string;
}

export function ContactForm({
  showEmail = false,
  submitLabel = "Envoyer le message",
  className,
}: ContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(() => createContactSchema(showEmail), [showEmail]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (_data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast({
        title: "Message envoyé",
        description:
          "Nous avons bien reçu votre message. Notre équipe vous répondra sous 24 h.",
        variant: "success",
      });

      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className ?? "space-y-6"}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom complet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showEmail ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+243 ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {showEmail && (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone (WhatsApp)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+243 ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SUBJECT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre besoin, votre question ou votre projet..."
                  className="min-h-[160px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Minimum 10 caractères. Soyez aussi précis que possible.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-client-primary-600 hover:bg-client-primary-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
