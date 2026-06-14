"use server";

export async function deleteRoomType(
  _userId: string,
  _roomTypeId: string,
) {
  return {
    success: false,
    error: "La suppression de type de chambre n'est pas encore supportée par l'API.",
  };
}
