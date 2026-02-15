"use client";

import { useState, useMemo } from "react";
import { PaymentWithDetails } from "@/app/actions/partner/payments/get";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar, CreditCard, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentsListProps {
  payments: PaymentWithDetails[];
}

const statusConfig = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  COMPLETED: { label: "Complété", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  FAILED: { label: "Échoué", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  REFUNDED: { label: "Remboursé", color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertCircle },
  PARTIALLY_REFUNDED: { label: "Partiellement remboursé", color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertCircle },
};

const methodLabels: Record<string, string> = {
  CREDIT_CARD: "Carte bancaire",
  PAYPAL: "PayPal",
  BANK_TRANSFER: "Virement bancaire",
  MOBILE_MONEY: "Mobile Money",
  CASH: "Espèces",
};

export function PaymentsList({ payments }: PaymentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  // Filtrer les paiements
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    // Filtrer par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.booking.guestName.toLowerCase().includes(searchLower) ||
          payment.booking.guestEmail.toLowerCase().includes(searchLower) ||
          payment.bookingId.toLowerCase().includes(searchLower) ||
          payment.transactionId?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par statut
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Filtrer par date
    if (dateFilter !== "ALL") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        const paymentDay = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate());

        switch (dateFilter) {
          case "TODAY":
            return paymentDay.getTime() === today.getTime();
          case "WEEK":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return paymentDay >= weekAgo;
          case "MONTH":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return paymentDay >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [payments, searchTerm, statusFilter, dateFilter]);

  // Calculer les totaux
  const totals = useMemo(() => {
    return filteredPayments.reduce(
      (acc, payment) => {
        acc.total += payment.amount;
        if (payment.status === "COMPLETED") {
          acc.completed += payment.amount;
        } else if (payment.status === "PENDING") {
          acc.pending += payment.amount;
        }
        return acc;
      },
      { total: 0, completed: 0, pending: 0 }
    );
  }, [filteredPayments]);

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total transactions</p>
              <p className="text-2xl font-bold text-gray-900">${totals.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paiements complétés</p>
              <p className="text-2xl font-bold text-gray-900">${totals.completed.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">${totals.pending.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher par client ou réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtre statut */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="COMPLETED">Complété</SelectItem>
              <SelectItem value="FAILED">Échoué</SelectItem>
              <SelectItem value="REFUNDED">Remboursé</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtre date */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les périodes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes les périodes</SelectItem>
              <SelectItem value="TODAY">Aujourd'hui</SelectItem>
              <SelectItem value="WEEK">7 derniers jours</SelectItem>
              <SelectItem value="MONTH">30 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tableau des paiements */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Réservation</TableHead>
              <TableHead>Hôtel</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => {
                const statusInfo = statusConfig[payment.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{payment.booking.guestName}</p>
                        <p className="text-sm text-gray-500">{payment.booking.guestEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">#{payment.bookingId.slice(-8)}</p>
                        <p className="text-sm text-gray-500">
                          {payment.booking.roomType.name} - {payment.booking.timeSlot.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{payment.booking.hotel.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-gray-900">
                        {payment.currency} {payment.amount.toFixed(2)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {payment.method ? methodLabels[payment.method] || payment.method : "Non spécifié"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(payment.createdAt), "dd MMM yyyy", { locale: fr })}</span>
                      </div>
                      {payment.paidAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Payé: {format(new Date(payment.paidAt), "HH:mm", { locale: fr })}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Résumé en bas */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-600">
          Affichage de <span className="font-semibold">{filteredPayments.length}</span> transaction(s) sur{" "}
          <span className="font-semibold">{payments.length}</span> au total
        </p>
      </div>
    </div>
  );
}

