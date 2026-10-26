import { db } from "@/db";
import { apartments } from "@/db/schema";
import { toHotelPayload, type Hotel, type HotelCity } from "@/lib/hotels";
import { and, asc, eq, lte } from "drizzle-orm";

// Apartments share the hotel listing shape (city, landmark distance, rating, price).
export type Apartment = Hotel;

export async function getActiveApartments(
  city?: HotelCity,
  maxDistance?: number,
): Promise<Apartment[]> {
  try {
    const conditions = [eq(apartments.isActive, true)];

    if (city) {
      conditions.push(eq(apartments.city, city));
    }

    if (maxDistance) {
      conditions.push(lte(apartments.distanceMeters, maxDistance));
    }

    const rows = await db
      .select()
      .from(apartments)
      .where(and(...conditions))
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
