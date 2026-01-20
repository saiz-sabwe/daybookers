import { notFound } from "next/navigation";
import { getHotelById } from "@/app/actions/hotels/get";
import { PartnerHotelDetailClient } from "./PartnerHotelDetailClient";

export default async function PartnerHotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Récupérer l'hôtel
  const hotelData = await getHotelById(id);
  if (!hotelData) {
    return notFound();
  }

  return <PartnerHotelDetailClient hotel={hotelData} />;
}
