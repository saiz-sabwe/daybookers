"use client";

import { useState, useEffect } from "react";
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
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getPartnerTransactions } from "@/app/actions/partner/earnings/transactions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { TransactionData } from "@/app/actions/partner/earnings/transactions";

interface TransactionsTableProps {
  userId: string;
  period: "today" | "week" | "month" | "year" | "all";
}

export function TransactionsTable({ userId, period }: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Réinitialiser la page à 1 quand la période change
  useEffect(() => {
    setPage(1);
  }, [period]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const result = await getPartnerTransactions(userId, period, page, pageSize);
        setTransactions(result.transactions);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, period, page]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      CONFIRMED: { label: "Confirmée", variant: "default" },
      PENDING: { label: "En attente", variant: "secondary" },
      CANCELLED: { label: "Annulée", variant: "destructive" },
      COMPLETED: { label: "Terminée", variant: "default" },
      REFUNDED: { label: "Remboursée", variant: "outline" },
    };

    const config = statusMap[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string | null) => {
    if (!status) {
      return <Badge variant="outline">Non payé</Badge>;
    }

    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      COMPLETED: { label: "Payé", variant: "default" },
      PENDING: { label: "En attente", variant: "secondary" },
      FAILED: { label: "Échoué", variant: "destructive" },
      REFUNDED: { label: "Remboursé", variant: "outline" },
      PARTIALLY_REFUNDED: { label: "Partiellement remboursé", variant: "outline" },
    };

    const config = statusMap[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune transaction trouvée pour cette période</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Hôtel</TableHead>
              <TableHead>Type de chambre</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Montant total</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead>Statut réservation</TableHead>
              <TableHead>Statut paiement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {format(new Date(transaction.date), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
                <TableCell>{transaction.hotelName}</TableCell>
                <TableCell>{transaction.roomTypeName}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.guestName}</div>
                    <div className="text-sm text-gray-500">{transaction.guestEmail}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {transaction.totalAmount.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: transaction.currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {transaction.commission.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: transaction.currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell className="text-right font-medium text-green-600">
                  {transaction.net.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: transaction.currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(transaction.bookingStatus)}</TableCell>
                <TableCell>{getPaymentStatusBadge(transaction.paymentStatus)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de {(page - 1) * pageSize + 1} à {Math.min(page * pageSize, total)} sur {total} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>
            <div className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

