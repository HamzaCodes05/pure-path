import { db } from "@/db";
import { normalizeMaxDistance } from "@/lib/distance";
import { restaurants } from "@/db/schema";
import {
  CITY_LANDMARKS,
  getActiveRestaurants,
  normalizeRestaurantCity,
} from "@/lib/restaurants";

type RestaurantRequestBody = Record<string, unknown>;

function getValue(body: RestaurantRequestBody, ...keys: string[]) {
  for (const key of keys) {
    if (body[key] !== undefined) {
      return body[key];
    }
  }

  return undefined;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

function normalizeDecimal(value: unknown) {
  const decimal = Number(value);

  if (!Number.isFinite(decimal)) {
    return null;
  }

  return decimal.toString();
}

function normalizeInteger(value: unknown, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const integer = Number(value);

  if (!Number.isFinite(integer) || integer < 0) {
    return null;
  }

  return Math.round(integer);
}

function normalizeDistanceMeters(body: RestaurantRequestBody) {
  const distanceMeters = getValue(
    body,
    "distanceMeters",
    "distance_meters",
    "Distance_Meters",
  );

  if (distanceMeters !== undefined && distanceMeters !== null) {
    return normalizeInteger(distanceMeters);
  }

  const distanceKm = getValue(
    body,
    "distanceFromHaramKm",
    "distanceFromLandmarkKm",
    "distanceKm",
    "distance_km",
    "Distance_From_Haram_KM",
  );

  if (distanceKm === undefined || distanceKm === null || distanceKm === "") {
    return null;
  }

  const kilometers = Number(distanceKm);

  if (!Number.isFinite(kilometers) || kilometers < 0) {
    return null;
  }

  return Math.round(kilometers * 1000);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = normalizeRestaurantCity(searchParams.get("city"));

    const maxDistance =
      normalizeMaxDistance(searchParams.get("maxDistance")) ?? undefined;

    const result = await getActiveRestaurants(city ?? undefined, maxDistance);

    return Response.json({
      success: true,
      data: result,
      restaurants: result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch restaurants",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RestaurantRequestBody;
    const link = normalizeString(body.link);
    const city = normalizeRestaurantCity(getValue(body, "city", "City"));
    const name = normalizeString(getValue(body, "name", "Name"));
    const category = normalizeString(getValue(body, "category", "Category"));
    const nearestLandmark = city
      ? (normalizeString(
          getValue(body, "nearestLandmark", "nearest_landmark"),
        ) ?? CITY_LANDMARKS[city])
      : null;
    const distanceMeters = normalizeDistanceMeters(body);
    const address = normalizeString(getValue(body, "address", "Address"));
    const rating = normalizeDecimal(getValue(body, "rating", "Rating"));
    const reviewSummary =
      normalizeString(
        getValue(body, "reviewSummary", "review_summary", "Review_Summary"),
      ) ??
      (category && nearestLandmark
        ? `${category} dining option near ${nearestLandmark}.`
        : null);
    const reviewCount = normalizeInteger(
      getValue(body, "reviewCount", "review_count", "Review_Count"),
    );
    const imageUrl = normalizeString(
      getValue(body, "imageUrl", "image_url", "Image_Url", "Image_URL"),
    );

    if (
      !city ||
      !name ||
      !category ||
      !nearestLandmark ||
      distanceMeters === null ||
      !address ||
      !rating ||
      !reviewSummary ||
      reviewCount === null
    ) {
      return Response.json(
        {
          success: false,
          message:
            "name, category, city, address, rating, reviewSummary, and distanceFromHaramKm or distanceMeters are required. City must be Makkah or Madinah.",
        },
        { status: 400 },
      );
    }

    const restaurant = await db.insert(restaurants).values({
      link,
      city,
      name,
      category,
      nearestLandmark,
      distanceMeters,
      address,
      rating,
      reviewSummary,
      reviewCount,
      imageUrl,
    });

    return Response.json(
      {
        success: true,
        data: restaurant[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create restaurant",
      },
      { status: 500 },
    );
  }
}
