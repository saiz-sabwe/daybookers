"use server";

import { getTimeSlots, TimeSlot } from "@/app/actions/time-slots/get";
import { Hotel } from "@/types";
import {
  DjangoBookingRecord,
  DjangoComplaintRecord,
  DjangoHotelRecord,
  DjangoReviewRecord,
} from "@/lib/api/django-client";
import {
  buildHotelNameMap,
  mapPartnerBooking,
  mapPartnerComplaint,
  mapPartnerHotel,
  mapPartnerReview,
} from "@/lib/api/partner/mappers";
import { fetchPartnerAll } from "@/lib/api/partner/fetch";
import type { PartnerBooking } from "@/app/actions/partner/bookings/get";
import type { PartnerComplaint } from "@/app/actions/partner/complaints/get";
import type { PartnerReview } from "@/lib/api/partner/mappers";

export async function loadPartnerHotels(token: string): Promise<Hotel[]> {
  const profile = await import("@/lib/api/partner/context").then((m) =>
    m.getPartnerProfile(),
  );
  const orgIds = profile?.organizations.map((org) => org.uuid) ?? [];

  if (orgIds.length === 0) {
    return [];
  }

  const hotelsByOrg = await Promise.all(
    orgIds.map((organization) =>
      fetchPartnerAll<DjangoHotelRecord>(token, "/api/hotels/hotels/", {
        organization,
      }),
    ),
  );

  const seen = new Set<string>();
  const hotels: Hotel[] = [];
  for (const list of hotelsByOrg) {
    for (const record of list) {
      if (seen.has(record.uuid)) {
        continue;
      }
      seen.add(record.uuid);
      hotels.push(mapPartnerHotel(record));
    }
  }

  return hotels;
}

async function buildTimeSlotMap(): Promise<Map<string, TimeSlot>> {
  const slots = await getTimeSlots();
  return new Map(slots.map((slot) => [slot.id, slot]));
}

export async function loadPartnerBookings(
  token: string,
  hotelId?: string,
): Promise<PartnerBooking[]> {
  const [records, hotels, timeSlotMap] = await Promise.all([
    fetchPartnerAll<DjangoBookingRecord>(token, "/api/hotels/bookings/", {
      organization_scope: true,
      ...(hotelId ? { hotel: hotelId } : {}),
    }),
    loadPartnerHotels(token),
    buildTimeSlotMap(),
  ]);

  const hotelMap = buildHotelNameMap(hotels);
  return records.map((record) =>
    mapPartnerBooking(record, hotelMap, timeSlotMap),
  );
}

export async function loadPartnerReviews(
  token: string,
  options?: { hotelId?: string; rating?: number },
): Promise<PartnerReview[]> {
  const [records, hotels] = await Promise.all([
    fetchPartnerAll<DjangoReviewRecord>(token, "/api/hotels/reviews/", {
      organization_scope: true,
      ...(options?.hotelId ? { hotel: options.hotelId } : {}),
    }),
    loadPartnerHotels(token),
  ]);

  const hotelMap = buildHotelNameMap(hotels);
  let reviews = records.map((record) => mapPartnerReview(record, hotelMap));

  if (options?.rating) {
    reviews = reviews.filter((review) => review.rating === options.rating);
  }

  return reviews;
}

export async function loadPartnerComplaints(
  token: string,
  hotelId?: string,
): Promise<PartnerComplaint[]> {
  const [records, hotels] = await Promise.all([
    fetchPartnerAll<DjangoComplaintRecord>(token, "/api/hotels/complaints/", {
      organization_scope: true,
      ...(hotelId ? { hotel: hotelId } : {}),
    }),
    loadPartnerHotels(token),
  ]);

  const hotelMap = buildHotelNameMap(hotels);
  return records.map((record) => mapPartnerComplaint(record, hotelMap));
}
