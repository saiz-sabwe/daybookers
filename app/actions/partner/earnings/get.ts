"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface PartnerEarnings {
  totalRevenue: number;
  commission: number;
  net: number;
  bookingsCount: number;
  period: string;
}

export async function getPartnerEarnings(
  userId: string,
  period: "today" | "week" | "month" | "year" | "all" = "all"
): Promise<PartnerEarnings> {
  return pendingDjango(
    {
      totalRevenue: 0,
      commission: 0,
      net: 0,
      bookingsCount: 0,
      period,
    },
    "partner.earnings.get"
  );
}
