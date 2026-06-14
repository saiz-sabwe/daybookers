import { TimeSlot } from "@/app/actions/time-slots/get";
import { Hotel } from "@/types";
import {
  DjangoAvailabilityRecord,
  DjangoBookingRecord,
  DjangoComplaintRecord,
  DjangoHotelRecord,
  DjangoPricingRuleRecord,
  DjangoReviewRecord,
} from "@/lib/api/django-client";
import { resolveHotelImages } from "@/lib/images/hotel-image";
import {
  resolveCityName,
  resolveCountryName,
} from "@/lib/locations/format-location";
import type { PartnerBooking } from "@/app/actions/partner/bookings/get";
import type { PartnerComplaint } from "@/app/actions/partner/complaints/get";
import type { AvailabilityData } from "@/app/actions/partner/availability/get";
import type { PricingRuleData } from "@/app/actions/partner/pricing-rules/get";

export function mapPartnerHotel(hotel: DjangoHotelRecord): Hotel {
  return {
    id: hotel.uuid,
    name: hotel.name,
    city: resolveCityName(hotel.city, hotel.city_name, hotel.address),
    country: resolveCountryName(hotel.country_name),
    address: hotel.address,
    description: hotel.description ?? "",
    stars: hotel.stars,
    rating: 0,
    reviewCount: 0,
    minPrice: hotel.min_price ?? 0,
    currency: "USD",
    images: resolveHotelImages(hotel.images),
    amenities: [],
    latitude: hotel.latitude ?? undefined,
    longitude: hotel.longitude ?? undefined,
    partnerId: hotel.organization ?? undefined,
    groupId: hotel.organization ?? undefined,
    phone: hotel.phone ?? undefined,
    email: hotel.email ?? undefined,
    website: hotel.website ?? undefined,
  };
}

export function buildHotelNameMap(
  hotels: Hotel[],
): Map<string, { id: string; name: string }> {
  return new Map(
    hotels.map((hotel) => [hotel.id, { id: hotel.id, name: hotel.name }]),
  );
}

export function mapPartnerBooking(
  record: DjangoBookingRecord,
  hotelMap: Map<string, { id: string; name: string }>,
  timeSlotMap: Map<string, TimeSlot>,
): PartnerBooking {
  const hotel = hotelMap.get(record.hotel) ?? {
    id: record.hotel,
    name: "Hôtel",
  };
  const slot = timeSlotMap.get(record.time_slot);

  return {
    id: record.uuid,
    hotelId: record.hotel,
    userId: record.profile,
    date: record.date,
    guestName: record.guest_name,
    guestCount: record.guest_count,
    totalPrice: Number(record.original_price ?? record.final_price),
    finalPrice: Number(record.final_price),
    currency: record.currency,
    status: record.status,
    hotel,
    user: {
      id: record.profile,
      name: record.guest_name ?? "Client",
      email: record.guest_email,
    },
    timeSlot: {
      id: record.time_slot,
      label: slot?.name,
      startTime: slot?.startTime ?? "",
      endTime: slot?.endTime ?? "",
    },
  };
}

export interface PartnerReview {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  response: string | null;
  responseAt: string | null;
  createdAt: string;
  hotel: { id: string; name: string };
  user: { id: string; name: string };
}

export function mapPartnerReview(
  record: DjangoReviewRecord,
  hotelMap: Map<string, { id: string; name: string }>,
): PartnerReview {
  const hotel = hotelMap.get(record.hotel) ?? {
    id: record.hotel,
    name: "Hôtel",
  };

  return {
    id: record.uuid,
    hotelId: record.hotel,
    userId: record.profile,
    rating: record.rating,
    title: record.title,
    comment: record.comment,
    response: record.response,
    responseAt: record.response_at,
    createdAt: record.create,
    hotel,
    user: {
      id: record.profile,
      name: "Client",
    },
  };
}

export function mapPartnerComplaint(
  record: DjangoComplaintRecord,
  hotelMap: Map<string, { id: string; name: string }>,
): PartnerComplaint {
  const hotel = hotelMap.get(record.hotel) ?? {
    id: record.hotel,
    name: "Hôtel",
  };

  return {
    id: record.uuid,
    title: record.title,
    description: record.description,
    status: record.status,
    priority: record.priority,
    guestName: record.guest_name,
    createdAt: record.create,
    resolution: record.resolution,
    hotel,
  };
}

export function mapPartnerAvailability(
  record: DjangoAvailabilityRecord,
): AvailabilityData {
  return {
    id: record.uuid,
    roomTypeId: record.room_type,
    timeSlotId: record.time_slot,
    date: new Date(record.date),
    available: record.available,
    price: record.price != null ? Number(record.price) : undefined,
    maxGuests: record.max_guests ?? undefined,
  };
}

export function mapPartnerPricingRule(
  record: DjangoPricingRuleRecord,
): PricingRuleData {
  return {
    id: record.uuid,
    hotelId: record.hotel,
    roomTypeId: record.room_type,
    name: record.name,
    type: record.type,
    description: record.description,
    multiplier: record.multiplier != null ? Number(record.multiplier) : null,
    fixedAmount:
      record.fixed_amount != null ? Number(record.fixed_amount) : null,
    percentage: record.percentage != null ? Number(record.percentage) : null,
    dayOfWeek: record.day_of_week ?? [],
    startDate: record.start_date ? new Date(record.start_date) : null,
    endDate: record.end_date ? new Date(record.end_date) : null,
    minDaysAdvance: record.min_days_advance,
    maxDaysAdvance: record.max_days_advance,
    priority: record.priority,
    active: record.active,
  };
}

export const DEFAULT_COMMISSION_RATE = 0.1;

export function filterBookingsByPeriod(
  bookings: PartnerBooking[],
  period: "today" | "week" | "month" | "year" | "all",
): PartnerBooking[] {
  if (period === "all") {
    return bookings;
  }

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "week") {
    start.setDate(start.getDate() - 7);
  } else if (period === "month") {
    start.setMonth(start.getMonth() - 1);
  } else if (period === "year") {
    start.setFullYear(start.getFullYear() - 1);
  }

  return bookings.filter((booking) => {
    const date = new Date(booking.date);
    if (period === "today") {
      return date.toDateString() === now.toDateString();
    }
    return date >= start && date <= now;
  });
}
