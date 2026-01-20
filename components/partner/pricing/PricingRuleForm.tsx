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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createPricingRule } from "@/app/actions/partner/pricing-rules/create";
import { updatePricingRule } from "@/app/actions/partner/pricing-rules/update";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { PricingRuleData } from "@/app/actions/partner/pricing-rules/get";

const pricingRuleSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  type: z.enum(["WEEKEND", "SEASON", "HOLIDAY", "LAST_MINUTE", "ADVANCE_BOOKING", "CUSTOM"]),
  description: z.string().optional(),
  multiplier: z.number().optional(),
  fixedAmount: z.number().optional(),
  percentage: z.number().optional(),
  dayOfWeek: z.array(z.number()).optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  minDaysAdvance: z.number().optional(),
  maxDaysAdvance: z.number().optional(),
  priority: z.number().default(0),
  active: z.boolean().default(true),
});

type PricingRuleFormValues = z.infer<typeof pricingRuleSchema>;

interface PricingRuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string | null;
  roomTypeId: string | null;
  userId: string;
  rule?: PricingRuleData;
  onSuccess?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Dimanche" },
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
];

export function PricingRuleForm({
  open,
  onOpenChange,
  hotelId,
  roomTypeId,
  userId,
  rule,
  onSuccess,
}: PricingRuleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!rule;

  const form = useForm<PricingRuleFormValues>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      name: "",
      type: "CUSTOM",
      description: "",
      multiplier: undefined,
      fixedAmount: undefined,
      percentage: undefined,
      dayOfWeek: [],
      startDate: null,
      endDate: null,
      minDaysAdvance: undefined,
      maxDaysAdvance: undefined,
      priority: 0,
      active: true,
    },
  });

  useEffect(() => {
    if (rule) {
      form.reset({
        name: rule.name || "",
        type: rule.type as any,
        description: rule.description || "",
        multiplier: rule.multiplier || undefined,
        fixedAmount: rule.fixedAmount || undefined,
        percentage: rule.percentage || undefined,
        dayOfWeek: rule.dayOfWeek || [],
        startDate: rule.startDate ? new Date(rule.startDate) : null,
        endDate: rule.endDate ? new Date(rule.endDate) : null,
        minDaysAdvance: rule.minDaysAdvance || undefined,
        maxDaysAdvance: rule.maxDaysAdvance || undefined,
        priority: rule.priority || 0,
        active: rule.active ?? true,
      });
    } else {
      form.reset({
        name: "",
        type: "CUSTOM",
        description: "",
        multiplier: undefined,
        fixedAmount: undefined,
        percentage: undefined,
        dayOfWeek: [],
        startDate: null,
        endDate: null,
        minDaysAdvance: undefined,
        maxDaysAdvance: undefined,
        priority: 0,
        active: true,
      });
    }
  }, [rule, form]);

  const onSubmit = async (data: PricingRuleFormValues) => {
    setIsSubmitting(true);
    try {
      let result;
      if (isEditing) {
        result = await updatePricingRule(userId, rule.id, data);
      } else {
        result = await createPricingRule(userId, {
          ...data,
          hotelId: hotelId || null,
          roomTypeId: roomTypeId || null,
        });
      }

      if (result.success) {
        toast({
          title: isEditing ? "Règle mise à jour" : "Règle créée",
          description: isEditing
            ? "La règle a été mise à jour avec succès"
            : "La règle a été créée avec succès",
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

  const selectedType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la règle" : "Créer une règle de tarification"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les paramètres de la règle"
              : "Créez une nouvelle règle de tarification dynamique"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la règle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Surcharge week-end" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de règle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WEEKEND">Week-end</SelectItem>
                      <SelectItem value="SEASON">Saison</SelectItem>
                      <SelectItem value="HOLIDAY">Jour férié</SelectItem>
                      <SelectItem value="LAST_MINUTE">Dernière minute</SelectItem>
                      <SelectItem value="ADVANCE_BOOKING">Réservation à l'avance</SelectItem>
                      <SelectItem value="CUSTOM">Personnalisée</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Textarea {...field} rows={2} placeholder="Description de la règle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Modificateur de prix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="multiplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multiplicateur</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        placeholder="Ex: 1.2"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">Ex: 1.2 = +20%</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fixedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant fixe</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        placeholder="Ex: 50"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">Montant à ajouter</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        placeholder="Ex: 15"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">% à ajouter</p>
                  </FormItem>
                )}
              />
            </div>

            {/* Jours de la semaine (pour WEEKEND) */}
            {selectedType === "WEEKEND" && (
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={() => (
                  <FormItem>
                    <FormLabel>Jours de la semaine</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name="dayOfWeek"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), day.value])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== day.value) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{day.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Plage de dates (pour SEASON, HOLIDAY) */}
            {(selectedType === "SEASON" || selectedType === "HOLIDAY") && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de début</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de fin</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Jours à l'avance (pour LAST_MINUTE, ADVANCE_BOOKING) */}
            {(selectedType === "LAST_MINUTE" || selectedType === "ADVANCE_BOOKING") && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minDaysAdvance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jours minimum à l'avance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxDaysAdvance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jours maximum à l'avance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorité</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">
                    Plus élevé = appliqué en premier (défaut: 0)
                  </p>
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

