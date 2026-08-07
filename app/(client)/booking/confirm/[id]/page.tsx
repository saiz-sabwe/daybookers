import { getCurrentProfile } from "@/app/actions/auth/get-current-profile";
import { getBookingById } from "@/app/actions/bookings/get";
import { getHotelById } from "@/app/actions/hotels/get";
import { isPartnerStaff } from "@/lib/auth/permissions";
import { BookingConfirmationClient } from "./BookingConfirmationClient";
import { notFound, redirect } from "next/navigation";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await getCurrentProfile();
  if (profile && isPartnerStaff(profile.organizations, profile.hotels)) {
    redirect(`/partner/bookings/${id}`);
  }

  const booking = await getBookingById(id);

  if (!booking) {
    return notFound();
  }

  const hotel = await getHotelById(booking.hotelId);

  if (!hotel) {
    return notFound();
  }

  return <BookingConfirmationClient booking={booking} hotel={hotel} />;
}

