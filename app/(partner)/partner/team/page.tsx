"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamMembers, type TeamMember } from "@/app/actions/partner/team/get";
import { useClientAuth } from "@/hooks/use-client-auth";
import { PartnerPageGuard } from "@/components/shared/auth/PartnerPageGuard";
import { TeamMemberCreateDialog } from "./TeamMemberCreateDialog";

const ROLE_LABELS: Record<string, string> = {
  Admin: "Super admin",
  GroupManager: "Manager de groupe",
  HotelManager: "Manager d'hôtel",
  Receptionist: "Réceptionniste",
  Client: "Client",
};

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "Admin":
      return "destructive" as const;
    case "GroupManager":
      return "default" as const;
    case "HotelManager":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export default function PartnerTeamPage() {
  const { isAuthenticated, isAuthPending, userProfile } = useClientAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const organizations = userProfile?.organizations ?? [];

  const fetchMembers = useCallback(async () => {
    if (!organizations.length) {
      setMembers([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getTeamMembers(organizations);
      setMembers(result);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'équipe:", error);
    } finally {
      setIsLoading(false);
    }
  }, [organizations]);

  useEffect(() => {
    if (isAuthPending || !isAuthenticated) {
      if (!isAuthPending) setIsLoading(false);
      return;
    }
    fetchMembers();
  }, [isAuthenticated, isAuthPending, fetchMembers]);

  return (
    <PartnerPageGuard>
      <div>
        <DashboardPageHeader
          theme="partner"
          icon={Users}
          title="Équipe"
          description="Les membres de vos enseignes et leurs rôles"
        >
          <TeamMemberCreateDialog onSuccess={fetchMembers} />
        </DashboardPageHeader>

        <Card>
          <CardHeader>
            <CardTitle>Membres ({members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun membre dans vos enseignes pour le moment
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Enseignes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.name}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {ROLE_LABELS[member.role] ?? member.role ?? "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.organizationNames.map((name) => (
                              <Badge key={name} variant="outline">
                                {name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PartnerPageGuard>
  );
}
