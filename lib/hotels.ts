import { db } from "@/db";
import { hotels } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

export type HotelCity = "makkah" | "madinah";

export type Hotel = {
  id: number;
  city: HotelCity;
  displayCity: string;
  name: string;
  nearestLandmark: string;
  link: string | null;
  distanceMeters: number;
  distanceLabel: string;
  rating: string;
  reviewCount: number;
  reviewSummary: string;
  priceFrom: string | null;
  imageUrl: string | null;
};

const CITY_LABELS: Record<HotelCity, string> = {
  makkah: "Makkah",
  madinah: "Madinah",
};

export function normalizeHotelCity(value: unknown): HotelCity | null {
  if (typeof value !== "string") {
    return null;
  }

  const city = value.trim().toLowerCase();

  if (city === "makkah" || city === "mecca") {
    return "makkah";
  }

  if (city === "madinah" || city === "madina" || city === "medina") {
    return "madinah";
  }

  return null;
}

function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${distanceMeters} m`;
  }

  const kilometers = distanceMeters / 1000;

  return `${kilometers.toFixed(kilometers >= 10 ? 0 : 1)} km`;
}

export function toHotelPayload(row: typeof hotels.$inferSelect): Hotel {
  const city = normalizeHotelCity(row.city) ?? "makkah";

  return {
    id: row.id,
    city,
    displayCity: CITY_LABELS[city],
    name: row.name,
    nearestLandmark: row.nearestLandmark,
    link: row.link,
    distanceMeters: row.distanceMeters,
    distanceLabel: formatDistance(row.distanceMeters),
    rating: row.rating,
    reviewCount: row.reviewCount,
    reviewSummary: row.reviewSummary,
    priceFrom: row.priceFrom,
    imageUrl: row.imageUrl,
  };
}

export async function getActiveHotels(city?: HotelCity): Promise<Hotel[]> {
  try {
    const rows = city
      ? await db
          .select()
          .from(hotels)
          .where(and(eq(hotels.isActive, true), eq(hotels.city, city)))
          .orderBy(asc(hotels.distanceMeters), asc(hotels.name))
      : await db
          .select()
          .from(hotels)
          .where(eq(hotels.isActive, true))
          .orderBy(
            asc(hotels.city),
            asc(hotels.distanceMeters),
            asc(hotels.name),
          );

    return rows.map(toHotelPayload);
  } catch (error) {
    console.error("GET_ACTIVE_HOTELS_ERROR:", error);
    return [];
  }
}
