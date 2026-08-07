"use server";

import { getTimeSlots, TimeSlot } from "@/app/actions/time-slots/get";
import { Hotel } from "@/types";
import {
  djangoFetch,
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
  const records = await fetchPartnerAll<DjangoHotelRecord>(
    token,
    "/api/hotels/hotels/",
    { organization_scope: true },
  );

  return records.map(mapPartnerHotel);
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

export async function loadPartnerBookingById(
  token: string,
  bookingId: string,
): Promise<PartnerBooking | null> {
  try {
    const record = await djangoFetch<DjangoBookingRecord>(
      `/api/hotels/bookings/${bookingId}/?organization_scope=true`,
      token,
    );
    const [hotels, timeSlotMap] = await Promise.all([
      loadPartnerHotels(token),
      buildTimeSlotMap(),
    ]);
    const hotelMap = buildHotelNameMap(hotels);
    return mapPartnerBooking(record, hotelMap, timeSlotMap);
  } catch {
    return null;
  }
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
