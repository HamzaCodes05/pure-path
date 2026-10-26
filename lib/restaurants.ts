import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { and, asc, eq, lte } from "drizzle-orm";

export type RestaurantCity = "makkah" | "madinah";

export type Restaurant = {
  id: number;
  city: RestaurantCity;
  displayCity: string;
  name: string;
  category: string;
  nearestLandmark: string;
  link: string | null;
  address: string;
  distanceMeters: number;
  distanceLabel: string;
  rating: string;
  reviewSummary: string;
  reviewCount: number;
  imageUrl: string | null;
};

const CITY_LABELS: Record<RestaurantCity, string> = {
  makkah: "Makkah",
  madinah: "Madinah",
};

export const CITY_LANDMARKS: Record<RestaurantCity, string> = {
  makkah: "Masjid al-Haram",
  madinah: "Al-Masjid an-Nabawi",
};

export function normalizeRestaurantCity(
  value: unknown,
): RestaurantCity | null {
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

function formatRating(value: string) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    return value;
  }

  return rating.toFixed(1);
}

function toRestaurantPayload(
  row: typeof restaurants.$inferSelect,
): Restaurant {
  const city = normalizeRestaurantCity(row.city) ?? "makkah";

  return {
    id: row.id,
    city,
    displayCity: CITY_LABELS[city],
    name: row.name,
    category: row.category,
    nearestLandmark: row.nearestLandmark,
    link: row.link,
    address: row.address,
    distanceMeters: row.distanceMeters,
    distanceLabel: formatDistance(row.distanceMeters),
    rating: formatRating(row.rating),
    reviewSummary: row.reviewSummary,
    reviewCount: row.reviewCount,
    imageUrl: row.imageUrl,
  };
}

export async function getActiveRestaurants(
  city?: RestaurantCity,
  maxDistance?: number,
): Promise<Restaurant[]> {
  try {
    const conditions = [];

    if (city) {
      conditions.push(eq(restaurants.city, city));
    }

    if (maxDistance) {
      conditions.push(lte(restaurants.distanceMeters, maxDistance));
    }

    const rows = await db
      .select()
      .from(restaurants)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        asc(restaurants.city),
        asc(restaurants.distanceMeters),
        asc(restaurants.name),
      );

    return rows.map(toRestaurantPayload);
  } catch (error) {
    console.error("GET_ACTIVE_RESTAURANTS_ERROR:", error);
    return [];
  }
}
