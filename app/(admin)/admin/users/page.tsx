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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getAllUsers } from "@/app/actions/admin/users/get";
import { authClient } from "@/lib/better-auth-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserRole } from "@/lib/generated/prisma/client";

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const pageSize = 10;

  const fetchUsers = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const result = await getAllUsers(session.user.id, {
        page,
        pageSize,
        search: search || undefined,
        role: roleFilter !== "all" ? (roleFilter as UserRole) : undefined,
      });
      setUsers(result.users);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session?.user?.id, page, search, roleFilter]);

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      ROLE_USER: "Utilisateur",
      ROLE_SUBSCRIBER: "Abonné",
      ROLE_HOTEL_MANAGER: "Gestionnaire d'hôtel",
      ROLE_HOTEL_GROUP_MANAGER: "Gestionnaire de groupe",
      ROLE_HOTEL_RECEPTIONIST: "Réceptionniste",
      ROLE_ADMIN: "Administrateur",
      ROLE_SUPER_ADMIN: "Super Admin",
    };
    return roleLabels[role] || role;
  };

  return (
    <div>
      <BreadcrumbAdmin items={[{ label: "Utilisateurs" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600">Liste de tous les utilisateurs de la plateforme</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="ROLE_USER">Utilisateur</SelectItem>
                <SelectItem value="ROLE_SUBSCRIBER">Abonné</SelectItem>
                <SelectItem value="ROLE_HOTEL_MANAGER">Gestionnaire d'hôtel</SelectItem>
                <SelectItem value="ROLE_HOTEL_GROUP_MANAGER">Gestionnaire de groupe</SelectItem>
                <SelectItem value="ROLE_HOTEL_RECEPTIONIST">Réceptionniste</SelectItem>
                <SelectItem value="ROLE_ADMIN">Administrateur</SelectItem>
                <SelectItem value="ROLE_SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôles</TableHead>
                      <TableHead>Email vérifié</TableHead>
                      <TableHead>Inscrit le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role: string) => (
                              <Badge key={role} variant="outline">
                                {getRoleLabel(role)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.emailVerified ? "default" : "secondary"}>
                            {user.emailVerified ? "Oui" : "Non"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: fr })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Précédent
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} sur {totalPages} ({total} utilisateurs)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Suivant <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

