"use client";

import { useState, useEffect } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPartnerSettings } from "@/app/actions/partner/settings/get";
import { updatePartnerSettings } from "@/app/actions/partner/settings/update";
import { authClient } from "@/lib/better-auth-client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function PartnerSettingsPage() {
  const { data: session } = authClient.useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    commissionRate: 0.1,
    payoutMethod: "",
    payoutSchedule: "monthly",
    autoConfirm: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    if (session?.user?.id) {
      getPartnerSettings(session.user.id).then((settingsData) => {
        if (settingsData) {
          setSettings({
            commissionRate: settingsData.commissionRate || 0.1,
            payoutMethod: settingsData.payoutMethod || "",
            payoutSchedule: settingsData.payoutSchedule || "monthly",
            autoConfirm: settingsData.autoConfirm || false,
            emailNotifications: settingsData.emailNotifications ?? true,
            smsNotifications: settingsData.smsNotifications ?? false,
          });
        }
        setIsLoading(false);
      });
    }
  }, [session?.user?.id]);

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      // Ne pas envoyer commissionRate car il ne peut pas être modifié par le partenaire
      const { commissionRate, ...settingsToUpdate } = settings;
      const result = await updatePartnerSettings(session.user.id, settingsToUpdate);
      if (result.success) {
        toast({
          title: "Paramètres mis à jour",
          description: "Vos paramètres ont été enregistrés avec succès",
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <BreadcrumbPartner items={[{ label: "Paramètres" }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbPartner items={[{ label: "Paramètres" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-partner-text-primary mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">Gérez les paramètres de votre compte</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Taux de commission</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-sm font-medium text-gray-900">
                  {settings.commissionRate !== null && settings.commissionRate !== undefined
                    ? `${(settings.commissionRate * 100).toFixed(1)}%`
                    : "Non défini"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Le taux de commission est défini par l'administrateur
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payoutMethod">Méthode de paiement</Label>
              <Select
                value={settings.payoutMethod}
                onValueChange={(value) =>
                  setSettings({ ...settings, payoutMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payoutSchedule">Fréquence de paiement</Label>
              <Select
                value={settings.payoutSchedule}
                onValueChange={(value) =>
                  setSettings({ ...settings, payoutSchedule: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="on_demand">À la demande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réservations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Confirmation automatique</Label>
                <p className="text-sm text-gray-500">
                  Confirmer automatiquement les nouvelles réservations
                </p>
              </div>
              <Switch
                checked={settings.autoConfirm}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoConfirm: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par SMS</Label>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications par SMS
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
