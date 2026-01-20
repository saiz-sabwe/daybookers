"use client";

import { useState, useEffect } from "react";
import { BreadcrumbAdmin } from "@/components/admin/layout/BreadcrumbAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Edit } from "lucide-react";
import { getAllPartnerCommissions } from "@/app/actions/admin/commissions/get";
import { updatePartnerCommission } from "@/app/actions/admin/commissions/update";
import { authClient } from "@/lib/better-auth-client";
import { useToast } from "@/hooks/use-toast";

export default function AdminCommissionsPage() {
  const { data: session } = authClient.useSession();
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [commissionRate, setCommissionRate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchCommissions = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const data = await getAllPartnerCommissions(session.user.id);
      setCommissions(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commissions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [session?.user?.id]);

  const handleEditClick = (partner: any) => {
    setSelectedPartner(partner);
    setCommissionRate(
      partner.commissionRate !== null
        ? (partner.commissionRate * 100).toString()
        : "10"
    );
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!session?.user?.id || !selectedPartner) return;

    const rate = parseFloat(commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast({
        title: "Erreur de validation",
        description: "Le taux de commission doit être entre 0% et 100%",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPartner.managerName) {
      toast({
        title: "Erreur",
        description: "Cet hôtel n'a pas de manager associé",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await updatePartnerCommission(
        session.user.id,
        selectedPartner.hotelId,
        rate / 100
      );

      if (result.success) {
        toast({
          title: "Commission mise à jour",
          description: `Le taux de commission a été mis à jour avec succès`,
          variant: "default",
        });
        setIsEditModalOpen(false);
        fetchCommissions();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour la commission",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <BreadcrumbAdmin items={[{ label: "Commissions" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Commissions
        </h1>
        <p className="text-gray-600">
          Définissez les taux de commission pour chaque hôtel
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Hôtels</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : commissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun hôtel trouvé</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hôtel</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Taux de commission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.hotelId}>
                      <TableCell className="font-medium">
                        {commission.hotelName}
                      </TableCell>
                      <TableCell>{commission.hotelAddress}</TableCell>
                      <TableCell>
                        {commission.managerName ? (
                          <>
                            <p className="font-medium">{commission.managerName}</p>
                            <p className="text-xs text-gray-500">{commission.managerEmail}</p>
                          </>
                        ) : (
                          <span className="text-gray-400">Aucun manager</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {commission.commissionRate !== null
                          ? `${(commission.commissionRate * 100).toFixed(1)}%`
                          : "Non défini"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(commission)}
                          disabled={!commission.managerName}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le taux de commission</DialogTitle>
            <DialogDescription>
              Définissez le taux de commission pour l'hôtel {selectedPartner?.hotelName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="commission-rate">Taux de commission (%)</Label>
              <Input
                id="commission-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="10"
              />
              <p className="text-xs text-gray-500">
                Entrez un taux entre 0% et 100%
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-admin-primary-500 hover:bg-admin-primary-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

