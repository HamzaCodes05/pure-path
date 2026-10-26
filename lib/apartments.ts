import { db } from "@/db";
import { apartments } from "@/db/schema";
import { toHotelPayload, type Hotel, type HotelCity } from "@/lib/hotels";
import { and, asc, eq } from "drizzle-orm";

// Apartments share the hotel listing shape (city, landmark distance, rating, price).
export type Apartment = Hotel;

export async function getActiveApartments(
  city?: HotelCity,
): Promise<Apartment[]> {
  try {
    const rows = await db
      .select()
      .from(apartments)
      .where(
        city
          ? and(eq(apartments.isActive, true), eq(apartments.city, city))
          : eq(apartments.isActive, true),
      )
      .orderBy(
        asc(apartments.city),
        asc(apartments.distanceMeters),
        asc(apartments.name),
      );

    return rows.map(toHotelPayload);
  } catch (error) {
    console.error("GET_ACTIVE_APARTMENTS_ERROR:", error);
    return [];
  }
}
