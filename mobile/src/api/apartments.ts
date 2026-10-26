import { API_BASE_URL } from "../config";
import type { Hotel } from "./hotels";

// Apartments share the hotel listing shape.
export type Apartment = Hotel;

type ApartmentsResponse = {
  data?: Apartment[];
  apartments?: Apartment[];
};

export async function getApartments() {
  const response = await fetch(`${API_BASE_URL}/api/apartments`);

  if (!response.ok) {
    throw new Error("Apartment listings are unavailable.");
  }

  const data = (await response.json()) as ApartmentsResponse;

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return Array.isArray(data.apartments) ? data.apartments : [];
}
