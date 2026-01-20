import { getBookingById } from "@/app/actions/bookings/get";
import { getHotelById } from "@/app/actions/hotels/get";
import { BookingConfirmationClient } from "./BookingConfirmationClient";
import { notFound } from "next/navigation";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

