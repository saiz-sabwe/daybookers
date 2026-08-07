import { notFound } from "next/navigation";
import { getAdminHotelById } from "@/app/actions/admin/hotels/get";
import { AdminHotelDetailClient } from "./AdminHotelDetailClient";

export default async function AdminHotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hotel = await getAdminHotelById(id);

  if (!hotel) {
    return notFound();
  }

  return <AdminHotelDetailClient hotel={hotel} />;
}
