"use server";

import db from "@/lib/db";

export interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string | null;
}

export async function getTimeSlots(): Promise<TimeSlot[]> {
  try {
    const timeSlots = await db.timeSlot.findMany({
      orderBy: {
        startTime: "asc",
      },
    });

    return timeSlots.map((slot) => ({
      id: slot.id,
      name: slot.name,
      startTime: slot.startTime,
      endTime: slot.endTime,
      description: slot.description,
    }));
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return [];
  }
}

export async function getTimeSlotById(id: string): Promise<TimeSlot | null> {
  try {
    const timeSlot = await db.timeSlot.findUnique({
      where: { id },
    });

    if (!timeSlot) {
      return null;
    }

    return {
      id: timeSlot.id,
      name: timeSlot.name,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      description: timeSlot.description,
    };
  } catch (error) {
    console.error("Error fetching time slot:", error);
    return null;
  }
}

