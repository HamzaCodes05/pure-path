import { API_BASE_URL } from "../config";

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

type RestaurantsResponse = {
  data?: Restaurant[];
  restaurants?: Restaurant[];
};

export async function getRestaurants(maxDistance?: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/restaurants${maxDistance ? `?maxDistance=${maxDistance}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Restaurant listings are unavailable.");
  }

  const data = (await response.json()) as RestaurantsResponse;

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return Array.isArray(data.restaurants) ? data.restaurants : [];
}
