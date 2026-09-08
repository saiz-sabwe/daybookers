"use server";

import {
  djangoFetch,
  DjangoOrganizationRecord,
  unwrapListPayload,
} from "@/lib/api/django-client";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface OrganizationCommissionRate {
  uuid: string;
  name: string;
  commissionRate: number | null;
}

interface OrganizationInput {
  uuid: string;
  name: string;
}

/**
 * Taux de commission DayBooker des enseignes du partenaire connecté.
 * La liste des enseignes vient du profil client (déjà filtré par périmètre) ;
 * on ne retient que celles-ci dans la réponse de l'API.
 */
export async function getMyCommissionRates(
  organizations: OrganizationInput[],
): Promise<OrganizationCommissionRate[]> {
  try {
    const token = await requirePartnerToken();
    if (!token || !organizations.length) {
      return [];
    }

    const allowed = new Map(organizations.map((org) => [org.uuid, org.name]));
    const payload = await djangoFetch<unknown>(
      "/api/accounts/organizations/",
      token,
    );
    const records = unwrapListPayload<DjangoOrganizationRecord>(payload);

    return records
      .filter((record) => allowed.has(String(record.uuid)))
      .map((record) => ({
        uuid: String(record.uuid),
        name: allowed.get(String(record.uuid)) ?? record.name,
        commissionRate:
          record.commission_rate != null ? Number(record.commission_rate) : null,
      }));
  } catch (error) {
    console.error("Error fetching commission rates:", error);
    return [];
  }
}
