"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface PartnerComplaint {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  guestName: string;
  createdAt: string | Date;
  resolution?: string | null;
  hotel: {
    id: string;
    name: string;
  };
}

export async function getComplaints(
  _userId?: string,
  _hotelId?: string,
): Promise<PartnerComplaint[]> {
  return pendingDjango([], "partner.complaints.get");
}
