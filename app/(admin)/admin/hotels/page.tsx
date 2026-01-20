"use client";

import { useState, useEffect } from "react";
import { BreadcrumbAdmin } from "@/components/admin/layout/BreadcrumbAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getAllHotels } from "@/app/actions/admin/hotels/get";
import { authClient } from "@/lib/better-auth-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { HotelStatus } from "@/lib/generated/prisma/client";

export default function AdminHotelsPage() {
  const { data: session } = authClient.useSession();
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const pageSize = 10;

  const fetchHotels = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const result = await getAllHotels(session.user.id, {
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter !== "all" ? (statusFilter as HotelStatus) : undefined,
      });
      setHotels(result.hotels);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (error) {
      console.error("Erreur lors de la récupération des hôtels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [session?.user?.id, page, search, statusFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "DRAFT":
        return "secondary";
      case "INACTIVE":
        return "outline";
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Actif";
      case "DRAFT":
        return "Brouillon";
      case "INACTIVE":
        return "Inactif";
      case "SUSPENDED":
        return "Suspendu";
      default:
        return status;
    }
  };

  return (
    <div>
      <BreadcrumbAdmin items={[{ label: "Hôtels" }]} />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Hôtels
          </h1>
          <p className="text-gray-600">Liste de tous les hôtels de la plateforme</p>
        </div>
        <Button asChild className="bg-admin-primary-500 hover:bg-admin-primary-600 text-white">
          <Link href="/admin/hotels/create">
            <Plus className="w-4 h-4 mr-2" />
            Créer un hôtel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou adresse..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : hotels.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun hôtel trouvé</p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Étoiles</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotels.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{hotel.address}</TableCell>
                        <TableCell>
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(hotel.status)}>
                            {getStatusLabel(hotel.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(hotel.createdAt), "dd/MM/yyyy", { locale: fr })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/hotels/${hotel.id}`}>Voir</Link>
                          </Button>
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
                    Page {page} sur {totalPages} ({total} hôtels)
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

