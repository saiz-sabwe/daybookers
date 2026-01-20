"use client";

import { useState, useEffect } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPartnerEarnings } from "@/app/actions/partner/earnings/get";
import { authClient } from "@/lib/better-auth-client";
import { TransactionsTable } from "@/components/partner/earnings/TransactionsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PartnerEarningsPage() {
  const { data: session } = authClient.useSession();
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
    if (session?.user?.id) {
      setIsLoading(true);
      getPartnerEarnings(session.user.id, period).then((earningsData) => {
        setEarnings(earningsData);
        setIsLoading(false);
      });
    }
  }, [session?.user?.id, period]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as "today" | "week" | "month" | "year" | "all");
  };

  if (isLoading) {
    return (
      <div>
        <BreadcrumbPartner items={[{ label: "Revenus" }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbPartner items={[{ label: "Revenus" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-partner-text-primary mb-2">
          Revenus
        </h1>
        <p className="text-gray-600">Consultez vos revenus et transactions</p>
      </div>

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
          <TransactionsTable userId={session.user.id} period={period} />
        </CardContent>
      </Card>
    </div>
  );
}
