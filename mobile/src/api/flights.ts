import { API_BASE_URL } from "../config";

export type Flight = {
  id: number;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureLabel: string;
  arrivalLabel: string;
  durationLabel: string;
  fare: string;
  fareLabel: string;
  seatsAvailable: number;
  rating: string;
  bookingLink: string;
};

type FlightsResponse = {
  data?: Flight[];
  flights?: Flight[];
};

export async function getFlights(date?: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/flights${date ? `?date=${encodeURIComponent(date)}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Flight listings are unavailable.");
  }

  const data = (await response.json()) as FlightsResponse;

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return Array.isArray(data.flights) ? data.flights : [];
}
