"use server";

import { loadPartnerComplaints } from "@/lib/api/partner/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

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
  hotelId?: string,
): Promise<PartnerComplaint[]> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }
    return await loadPartnerComplaints(token, hotelId);
  } catch (error) {
    console.error("Error fetching partner complaints:", error);
    return [];
  }
}
