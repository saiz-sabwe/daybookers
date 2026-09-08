"use server";

import { djangoFetch } from "@/lib/api/django-client";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationNames: string[];
}

interface DjangoTeamProfileRecord {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  pseudo?: string | null;
  email?: string | null;
  role?: string | null;
}

interface OrganizationInput {
  uuid: string;
  name: string;
}

export async function getTeamMembers(
  organizations: OrganizationInput[],
): Promise<TeamMember[]> {
  try {
    const token = await requirePartnerToken();
    if (!token || !organizations.length) {
      return [];
    }

    const members = new Map<string, TeamMember & { orgNames: Set<string> }>();

    for (const org of organizations) {
      let profiles: DjangoTeamProfileRecord[] = [];
      try {
        profiles = await djangoFetch<DjangoTeamProfileRecord[]>(
          `/api/accounts/profiles/?organization=${encodeURIComponent(org.uuid)}`,
          token,
        );
      } catch {
        // Organisation hors périmètre : le backend refuse, on ignore
        continue;
      }

      for (const profile of profiles) {
        const fullName = [profile.first_name, profile.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();
        const existing = members.get(profile.id);
        if (existing) {
          existing.orgNames.add(org.name);
        } else {
          members.set(profile.id, {
            id: profile.id,
            name: fullName || profile.pseudo || profile.email || "Utilisateur",
            email: profile.email ?? "",
            role: profile.role ?? "",
            organizationNames: [],
            orgNames: new Set([org.name]),
          });
        }
      }
    }

    return Array.from(members.values()).map(({ orgNames, ...member }) => ({
      ...member,
      organizationNames: Array.from(orgNames),
    }));
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}
