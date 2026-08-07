import {
  DjangoBookingRecord,
  DjangoHotelRecord,
  DjangoOrganizationRecord,
  DjangoAdminProfileRecord,
} from "@/lib/api/django-client";

export function mapAdminUser(profile: DjangoAdminProfileRecord) {
  const name = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const roles: string[] = [];
  if (profile.is_superuser) {
    roles.push("Super admin");
  } else if (profile.is_staff) {
    roles.push("Staff");
  }
  if (profile.has_organization) {
    roles.push("Partenaire");
  }

  return {
    id: String(profile.id),
    name: name || profile.pseudo || profile.email || "Utilisateur",
    email: profile.email ?? "",
    roles,
    createdAt: new Date(profile.create),
    emailVerified: Boolean(profile.email),
  };
}

export function mapAdminHotel(hotel: DjangoHotelRecord) {
  return {
    id: hotel.uuid,
    name: hotel.name,
    address: hotel.address,
    status: hotel.status,
    stars: hotel.stars,
    createdAt: new Date((hotel as DjangoHotelRecord & { create?: string }).create ?? Date.now()),
    cityId: hotel.city,
  };
}

export function mapAdminHotelDetail(hotel: DjangoHotelRecord) {
  return {
    id: hotel.uuid,
    name: hotel.name,
    slug: hotel.slug,
    address: hotel.address,
    cityId: hotel.city,
    cityName: hotel.city_name,
    countryName: hotel.country_name,
    status: hotel.status,
    stars: hotel.stars,
    description: hotel.description ?? "",
    phone: hotel.phone ?? undefined,
    email: hotel.email ?? undefined,
    website: hotel.website ?? undefined,
    organizationId: hotel.organization,
    latitude: hotel.latitude ?? undefined,
    longitude: hotel.longitude ?? undefined,
    minPrice: hotel.min_price ?? undefined,
    images: hotel.images ?? [],
    createdAt: new Date((hotel as DjangoHotelRecord & { create?: string }).create ?? Date.now()),
  };
}

export function filterUsersByRole<T>(users: T[], _role?: string): T[] {
  return users;
}

export function filterHotelsBySearch(
  hotels: ReturnType<typeof mapAdminHotel>[],
  search?: string,
) {
  if (!search) {
    return hotels;
  }
  const term = search.toLowerCase();
  return hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(term) ||
      hotel.address.toLowerCase().includes(term),
  );
}

export function buildCommissionRows(
  hotels: DjangoHotelRecord[],
  organizations: Array<
    DjangoOrganizationRecord & { commission_rate?: string | number | null }
  >,
) {
  const orgMap = new Map(organizations.map((org) => [org.uuid, org]));

  return hotels.map((hotel) => {
    const org = hotel.organization ? orgMap.get(hotel.organization) : undefined;
    const rate = org?.commission_rate;

    return {
      hotelId: hotel.uuid,
      hotelName: hotel.name,
      hotelAddress: hotel.address,
      commissionRate: rate != null ? Number(rate) : null,
      managerName: org?.manager_name ?? null,
      managerEmail: org?.manager_email ?? null,
      organizationId: hotel.organization,
    };
  });
}

export function computeAdminStats(
  hotels: DjangoHotelRecord[],
  usersCount: number,
  bookings: DjangoBookingRecord[],
) {
  const activeHotels = hotels.filter((hotel) => hotel.status === "ACTIVE").length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const confirmed = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "COMPLETED",
  );
  const totalRevenue = confirmed.reduce(
    (sum, booking) => sum + Number(booking.final_price),
    0,
  );

  return {
    totalHotels: hotels.length,
    activeHotels,
    totalUsers: usersCount,
    totalBookings: bookings.length,
    totalRevenue,
    pendingBookings,
  };
}
