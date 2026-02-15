"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportGroupDataAsCSV } from "@/app/actions/partner/hotel-groups/export-data";

interface ExportButtonsProps {
  userId: string;
  groupId?: string;
  startDate?: Date;
  endDate?: Date;
}

export function ExportButtons({ userId, groupId, startDate, endDate }: ExportButtonsProps) {
  const { toast } = useToast();

  const handleExportCSV = async () => {
    try {
      const result = await exportGroupDataAsCSV(userId, groupId, startDate, endDate);

      if (result.success && result.data) {
        // Créer un blob et télécharger
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `statistiques-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Export réussi",
          description: "Les données ont été exportées en CSV",
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible d'exporter les données",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExportCSV} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Exporter CSV
      </Button>
    </div>
  );
}

