import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const timeSlots = await db.timeSlot.findMany({
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json({ error: "Failed to fetch time slots" }, { status: 500 });
  }
}

