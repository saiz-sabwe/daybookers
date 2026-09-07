"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getAdminUserById,
  type AdminUserDetail,
} from "@/app/actions/admin/users/get";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PermissionGate } from "@/components/shared/auth/PermissionGate";
import { djangoPerm } from "@/lib/auth/django-perm";

interface AdminUserDetailDialogProps {
  userId: string;
  userName: string;
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium break-all">{value || "—"}</p>
    </div>
  );
}

export function AdminUserDetailDialog({
  userId,
  userName,
}: AdminUserDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    getAdminUserById(userId)
      .then(setDetail)
      .finally(() => setIsLoading(false));
  }, [open, userId]);

  return (
    <PermissionGate permissions={[djangoPerm("profils", "profile")]}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Voir
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détail de l'utilisateur</DialogTitle>
            <DialogDescription>{userName}</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : !detail ? (
            <p className="text-sm text-gray-500 py-4">
              Impossible de charger le détail de cet utilisateur.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {detail.isSuperuser && <Badge>Super admin</Badge>}
                {detail.isStaff && !detail.isSuperuser && (
                  <Badge variant="secondary">Staff</Badge>
                )}
                {detail.hasOrganization && (
                  <Badge variant="outline">Partenaire</Badge>
                )}
                <Badge variant={detail.isActive ? "default" : "destructive"}>
                  {detail.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="Prénom" value={detail.firstName} />
                <DetailRow label="Nom" value={detail.lastName} />
                <DetailRow label="Pseudo" value={detail.pseudo} />
                <DetailRow label="Nom d'utilisateur" value={detail.username} />
                <DetailRow label="Email" value={detail.email} />
                <DetailRow label="Téléphone" value={detail.phone} />
                <DetailRow label="Adresse" value={detail.address} />
                <DetailRow
                  label="Inscrit le"
                  value={
                    detail.createdAt
                      ? format(new Date(detail.createdAt), "dd MMMM yyyy", {
                          locale: fr,
                        })
                      : undefined
                  }
                />
              </div>

              {detail.organizations.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Organisations</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.organizations.map((org) => (
                      <Badge key={org.uuid} variant="outline">
                        {org.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PermissionGate>
  );
}
