"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

interface PartnerHeaderProps {
  stats?: StatCard[];
}

export function PartnerHeader({ stats }: PartnerHeaderProps) {
  const defaultStats: StatCard[] = [
    { label: "Réservations du jour", value: 12, change: { value: 20, isPositive: true } },
    { label: "Chiffre d'affaires", value: "$1,240", change: { value: 15, isPositive: true } },
    { label: "Taux d'occupation", value: "85%", change: { value: 2, isPositive: false } },
    { label: "Note moyenne", value: "4.8" },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {displayStats.map((stat, index) => (
        <Card key={index} className="border-l-4 border-partner-primary-500 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-partner-text-primary">{stat.value}</p>
              {stat.change && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    stat.change.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {stat.change.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {stat.change.isPositive ? "+" : "-"}
                    {stat.change.value}%
                  </span>
                </div>
              )}
            </div>
            {stat.change && (
              <p className="text-xs text-gray-400 mt-1">vs hier</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

