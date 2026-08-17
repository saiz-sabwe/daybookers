"use server";

import { Hotel } from "@/types";
import {
  djangoFetch,
  djangoFetchPublic,
  DjangoHotelRecord,
  unwrapListPayload,
} from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { resolveHotelImages } from "@/lib/images/hotel-image";
import {
  resolveCityName,
  resolveCountryName,
} from "@/lib/locations/format-location";

export interface HotelSearchParams {
  location?: string;
  searchTerm?: string;
  date?: string;
  timeSlotId?: string;
}

function mapDjangoHotel(hotel: DjangoHotelRecord): Hotel {
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
  };
}

async function getHotelsFromDjango(
  params?: HotelSearchParams,
  token?: string,
): Promise<Hotel[]> {
  const query = new URLSearchParams();
  query.set("status", "ACTIVE");
  if (params?.location) {
    query.set("city", params.location);
  }

  const path = query.toString()
    ? `/api/hotels/hotels/?${query.toString()}`
    : "/api/hotels/hotels/";
  const payload = token
    ? await djangoFetch<unknown>(path, token)
    : await djangoFetchPublic<unknown>(path);

  const records = unwrapListPayload<DjangoHotelRecord>(payload);
  let hotels = records.map(mapDjangoHotel);

  if (params?.searchTerm) {
    const term = params.searchTerm.toLowerCase();
    hotels = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(term) ||
        hotel.address.toLowerCase().includes(term),
    );
  }

  return hotels;
}

export async function getHotels(params?: HotelSearchParams): Promise<Hotel[]> {
  try {
    let token: string | undefined;
    try {
      token = await getServerApiToken();
    } catch {
      token = undefined;
    }
    return await getHotelsFromDjango(params, token);
  } catch (error) {
    console.error("Error fetching hotels from Django:", error);
    return [];
  }
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  try {
    let token: string | undefined;
    try {
      token = await getServerApiToken();
    } catch {
      token = undefined;
    }
    const path = `/api/hotels/hotels/${id}/`;
    const hotel = token
      ? await djangoFetch<DjangoHotelRecord>(path, token)
      : await djangoFetchPublic<DjangoHotelRecord>(path);
    return mapDjangoHotel(hotel);
  } catch (error) {
    console.error("Error fetching hotel from Django:", error);
    return null;
  }
}
