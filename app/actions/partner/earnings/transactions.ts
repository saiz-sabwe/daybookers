"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface TransactionData {
  id: string;
  date: Date;
  hotelName: string;
  roomTypeName: string;
  guestName: string;
  guestEmail: string;
  totalAmount: number;
  commission: number;
  net: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string | null;
  createdAt: Date;
}

export async function getPartnerTransactions(
  userId: string,
  period: "today" | "week" | "month" | "year" | "all" = "all",
  page: number = 1,
  pageSize: number = 10
): Promise<{
  transactions: TransactionData[];
  total: number;
  totalPages: number;
}> {
  return pendingDjango(
    { transactions: [], total: 0, totalPages: 0 },
    "partner.earnings.transactions"
  );
}
