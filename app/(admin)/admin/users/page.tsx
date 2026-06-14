"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
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
import { Search, ChevronLeft, ChevronRight, Loader2, Users } from "lucide-react";
import { getAllUsers } from "@/app/actions/admin/users/get";
import { useClientAuth } from "@/hooks/use-client-auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminUsersPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const fetchUsers = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const result = await getAllUsers("", {
        page,
        pageSize,
        search: search || undefined,
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
  }, [isAuthenticated, isAuthPending, page, search]);

  return (
    <div>
      <DashboardPageHeader
        theme="sadmin"
        icon={Users}
        title="Gestion des Utilisateurs"
        description="Liste de tous les utilisateurs de la plateforme"
      />

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

