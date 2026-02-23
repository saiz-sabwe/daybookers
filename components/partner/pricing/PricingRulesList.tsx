"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { getPricingRules } from "@/app/actions/partner/pricing-rules/get";
import { deletePricingRule } from "@/app/actions/partner/pricing-rules/delete";
import { updatePricingRule } from "@/app/actions/partner/pricing-rules/update";
import { useToast } from "@/hooks/use-toast";
import { PricingRuleForm } from "./PricingRuleForm";
import type { PricingRuleData } from "@/app/actions/partner/pricing-rules/get";

const ruleTypeLabels: Record<string, { label: string; color: string; description: string }> = {
  WEEKEND: { 
    label: "Week-end", 
    color: "bg-blue-100 text-blue-800", 
    description: "Supplément appliqué les week-ends (vendredi, samedi, dimanche)" 
  },
  SEASON: { 
    label: "Saison", 
    color: "bg-purple-100 text-purple-800", 
    description: "Tarification selon la haute/basse saison" 
  },
  HOLIDAY: { 
    label: "Jour férié", 
    color: "bg-red-100 text-red-800", 
    description: "Prix spécial pour les jours fériés et événements" 
  },
  LAST_MINUTE: { 
    label: "Dernière minute", 
    color: "bg-green-100 text-green-800", 
    description: "Réduction pour les réservations à courte échéance" 
  },
  ADVANCE_BOOKING: { 
    label: "Réservation anticipée", 
    color: "bg-orange-100 text-orange-800", 
    description: "Réduction pour les réservations longtemps à l'avance" 
  },
  CUSTOM: { 
    label: "Personnalisée", 
    color: "bg-gray-100 text-gray-800", 
    description: "Règle personnalisée avec vos propres paramètres" 
  },
};

interface PricingRulesListProps {
  hotelId: string | null;
  roomTypeId: string | null;
  userId: string;
}

export function PricingRulesList({
  hotelId,
  roomTypeId,
  userId,
}: PricingRulesListProps) {
  const { toast } = useToast();
  const [rules, setRules] = useState<PricingRuleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRuleData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [togglingRuleId, setTogglingRuleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true);
      try {
        const data = await getPricingRules(hotelId, roomTypeId, userId);
        setRules(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des règles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, [hotelId, roomTypeId, userId]);

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette règle ?")) {
      return;
    }

    setDeletingRuleId(ruleId);
    try {
      const result = await deletePricingRule(userId, ruleId);
      if (result.success) {
        toast({
          title: "Règle supprimée",
          description: "La règle a été supprimée avec succès",
          variant: "default",
        });
        setRules((prev) => prev.filter((r) => r.id !== ruleId));
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de supprimer la règle",
          variant: "destructive",
        });
      }
    } finally {
      setDeletingRuleId(null);
    }
  };

  const handleToggleActive = async (rule: PricingRuleData) => {
    setTogglingRuleId(rule.id);
    try {
      const result = await updatePricingRule(userId, rule.id, {
        active: !rule.active,
      });

      if (result.success) {
        setRules((prev) =>
          prev.map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r))
        );
        toast({
          title: rule.active ? "Règle désactivée" : "Règle activée",
          description: `La règle "${rule.name}" a été ${rule.active ? "désactivée" : "activée"}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour la règle",
          variant: "destructive",
        });
      }
    } finally {
      setTogglingRuleId(null);
    }
  };

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingRule(null);
    // Rafraîchir la liste
    getPricingRules(hotelId, roomTypeId, userId).then(setRules);
  };

  if (!hotelId && !roomTypeId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">
              Sélectionnez un hôtel ou un type de chambre pour voir les règles
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Règles de tarification</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une règle
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Aucune règle de tarification</p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une règle
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => {
              const typeInfo = ruleTypeLabels[rule.type] || ruleTypeLabels.CUSTOM;
              return (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <Badge className={typeInfo.color}>
                          {typeInfo.label}
                        </Badge>
                        {!rule.active && (
                          <Badge variant="outline" className="bg-gray-100">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2 italic">{typeInfo.description}</p>
                      {rule.description && (
                        <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {rule.multiplier && (
                          <span className="text-blue-700 font-medium">
                            ✕ Multiplicateur: {rule.multiplier}x
                          </span>
                        )}
                        {rule.fixedAmount && (
                          <span className="text-green-700 font-medium">
                            + Montant fixe: {rule.fixedAmount} USD
                          </span>
                        )}
                        {rule.percentage && (
                          <span className="text-purple-700 font-medium">
                            % Pourcentage: {rule.percentage > 0 ? '+' : ''}{rule.percentage}%
                          </span>
                        )}
                        {rule.priority !== 0 && (
                          <span className="text-gray-600">
                            Priorité: {rule.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(rule)}
                        disabled={togglingRuleId === rule.id}
                        title={rule.active ? "Désactiver" : "Activer"}
                      >
                        {togglingRuleId === rule.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : rule.active ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingRule(rule)}
                        disabled={deletingRuleId === rule.id || togglingRuleId === rule.id}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(rule.id)}
                        disabled={deletingRuleId === rule.id}
                        title="Supprimer"
                      >
                        {deletingRuleId === rule.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>

      <PricingRuleForm
        open={isCreateModalOpen || !!editingRule}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditingRule(null);
          }
        }}
        hotelId={hotelId}
        roomTypeId={roomTypeId}
        userId={userId}
        rule={editingRule || undefined}
        onSuccess={handleSuccess}
      />
    </>
  );
}

