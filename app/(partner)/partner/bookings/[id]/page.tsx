import { notFound } from "next/navigation";
import { getPartnerBookingById } from "@/app/actions/partner/bookings/get";
import { PartnerBookingDetailClient } from "./PartnerBookingDetailClient";

export default async function PartnerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getPartnerBookingById(id);

  if (!booking) {
    return notFound();
  }

  return <PartnerBookingDetailClient booking={booking} />;
}
