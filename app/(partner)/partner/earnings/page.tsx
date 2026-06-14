"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPartnerEarnings } from "@/app/actions/partner/earnings/get";
import { useClientAuth } from "@/hooks/use-client-auth";
import { TransactionsTable } from "@/components/partner/earnings/TransactionsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";

export default function PartnerEarningsPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [earnings, setEarnings] = useState({
    totalRevenue: 0,
    commission: 0,
    net: 0,
    bookingsCount: 0,
    period: "all",
  });
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year" | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthPending || !isAuthenticated) {
      return;
    }

    setIsLoading(true);
    getPartnerEarnings("", period).then((earningsData) => {
      setEarnings(earningsData);
      setIsLoading(false);
    });
  }, [isAuthenticated, isAuthPending, period]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as "today" | "week" | "month" | "year" | "all");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={DollarSign}
        title="Revenus"
        description="Consultez vos revenus et transactions"
      />

      <div className="mb-4">
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">30 derniers jours</SelectItem>
            <SelectItem value="year">12 derniers mois</SelectItem>
            <SelectItem value="all">Tout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Revenus totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-partner-primary-600">
              ${earnings.totalRevenue.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {earnings.bookingsCount} réservation{earnings.bookingsCount > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-600">
              ${earnings.commission.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Net</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${earnings.net.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable userId="" period={period} />
        </CardContent>
      </Card>
    </div>
  );
}
