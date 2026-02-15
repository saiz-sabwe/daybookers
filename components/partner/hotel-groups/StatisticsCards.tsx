"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, DollarSign, TrendingUp } from "lucide-react";

interface StatisticsCardsProps {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  currency?: string;
}

export function StatisticsCards({
  totalBookings,
  totalRevenue,
  occupancyRate,
  currency = "USD",
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Réservations totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {currency === "USD" ? "$" : currency} {totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux d'occupation</p>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

