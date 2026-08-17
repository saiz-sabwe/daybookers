"use server";

import {
  djangoFetch,
  DjangoApiError,
  DjangoBookingRecord,
  unwrapListPayload,
} from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { getTimeSlots, TimeSlot } from "@/app/actions/time-slots/get";
import { Booking } from "@/types";

async function fetchBookings(token: string): Promise<DjangoBookingRecord[]> {
  const payload = await djangoFetch<unknown>("/api/hotels/bookings/", token);

  return unwrapListPayload<DjangoBookingRecord>(payload);
}

async function buildTimeSlotMap(): Promise<Map<string, TimeSlot>> {
  const slots = await getTimeSlots();
  return new Map(slots.map((slot) => [slot.id, slot]));
}

function mapDjangoBooking(
  record: DjangoBookingRecord,
  timeSlotMap: Map<string, TimeSlot>,
): Booking {
  const slot = timeSlotMap.get(record.time_slot);

  return {
    id: record.uuid,
    hotelId: record.hotel,
    userId: record.profile,
    date: record.date,
    timeSlot: {
      id: record.time_slot,
      label: slot?.name,
      startTime: slot?.startTime ?? "",
      endTime: slot?.endTime ?? "",
    },
    guestCount: {
      adults: record.guest_count,
      children: 0,
    },
    totalPrice: Number(record.final_price),
    currency: record.currency,
    status: record.status as Booking["status"],
    createdAt: record.create,
    updatedAt: record.last_update,
  };
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return [];
    }

    const [records, timeSlotMap] = await Promise.all([
      fetchBookings(token),
      buildTimeSlotMap(),
    ]);

    return records.map((record) => mapDjangoBooking(record, timeSlotMap));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return null;
    }

    const [record, timeSlotMap] = await Promise.all([
      djangoFetch<DjangoBookingRecord>(`/api/hotels/bookings/${id}/`, token),
      buildTimeSlotMap(),
    ]);

    return mapDjangoBooking(record, timeSlotMap);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export async function getBookingsByHotelId(hotelId: string): Promise<Booking[]> {
  const bookings = await getBookings();
  return bookings.filter((booking) => booking.hotelId === hotelId);
}
