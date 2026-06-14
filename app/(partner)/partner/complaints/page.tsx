import { getComplaints } from "@/app/actions/partner/complaints/get";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getServerApiToken } from "@/lib/api/server-auth";
import { redirect } from "next/navigation";

export default async function ComplaintsPage() {
  const token = await getServerApiToken();

  if (!token) {
    redirect("/login");
  }

  const complaints = await getComplaints("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-red-100 text-red-800";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800";
      case "RESOLVED": return "bg-green-100 text-green-800";
      case "CLOSED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-500 text-white";
      case "HIGH": return "bg-orange-500 text-white";
      case "MEDIUM": return "bg-yellow-500 text-white";
      case "LOW": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        theme="partner"
        icon={AlertTriangle}
        title="Gestion des plaintes"
        description="Suivi et résolution des réclamations clients"
      >
        <Button>Nouvelle plainte</Button>
      </DashboardPageHeader>

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            Aucune plainte enregistrée
          </Card>
        ) : (
          complaints.map((complaint) => (
            <Card key={complaint.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{complaint.title}</h3>
                    <Badge className={getPriorityColor(complaint.priority)}>
                      {complaint.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {complaint.guestName} - {complaint.hotel.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(complaint.createdAt), "PPP à HH:mm", { locale: fr })}
                  </p>
                </div>
                <Badge className={getStatusColor(complaint.status)}>
                  {complaint.status}
                </Badge>
              </div>
              <p className="text-gray-700 mb-4">{complaint.description}</p>
              {complaint.resolution && (
                <div className="mt-4 p-3 bg-green-50 rounded">
                  <p className="text-sm font-medium text-green-900">Résolution:</p>
                  <p className="text-sm text-green-800">{complaint.resolution}</p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">Voir détails</Button>
                {complaint.status !== "CLOSED" && (
                  <Button size="sm">Mettre à jour</Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
