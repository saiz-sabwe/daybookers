"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { getPricingRules } from "@/app/actions/partner/pricing-rules/get";
import { deletePricingRule } from "@/app/actions/partner/pricing-rules/delete";
import { updatePricingRule } from "@/app/actions/partner/pricing-rules/update";
import { useToast } from "@/hooks/use-toast";
import { PricingRuleForm } from "./PricingRuleForm";
import type { PricingRuleData } from "@/app/actions/partner/pricing-rules/get";

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
  };

  const handleToggleActive = async (rule: PricingRuleData) => {
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
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.type}
                        </Badge>
                        {!rule.active && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      {rule.description && (
                        <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {rule.multiplier && (
                          <span>Multiplicateur: {rule.multiplier}x</span>
                        )}
                        {rule.fixedAmount && (
                          <span>Montant fixe: +{rule.fixedAmount} USD</span>
                        )}
                        {rule.percentage && (
                          <span>Pourcentage: +{rule.percentage}%</span>
                        )}
                        {rule.priority !== 0 && (
                          <span>Priorité: {rule.priority}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(rule)}
                      >
                        {rule.active ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingRule(rule)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

