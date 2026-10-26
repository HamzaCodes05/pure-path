import type { Metadata } from "next";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { FlightsSection } from "@/components/packages/FlightsSection";
import { HotelsSection } from "@/components/packages/HotelsSection";
import { RestaurantsSection } from "@/components/packages/RestaurantsSection";
import { FlightDateFilter } from "@/components/packages/FlightDateFilter";
import { getActiveFlights, resolveFlightDate } from "@/lib/flights";
import { getActiveApartments } from "@/lib/apartments";
import { DistanceFilter } from "@/components/packages/DistanceFilter";
import { normalizeMaxDistance } from "@/lib/distance";
import { CityFilter } from "@/components/packages/CityFilter";
import { getActiveHotels, normalizeHotelCity } from "@/lib/hotels";
import { getActiveRestaurants } from "@/lib/restaurants";

export const metadata: Metadata = {
  title: "Journey | Pure Path",
  description:
    "Hotels and restaurants close to the Holy Mosques for your Hajj and Umrah journey.",
};

export const dynamic = "force-dynamic";

export default async function JourneyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { distance, flightDate, city: cityParam } = await searchParams;
  const city =
    normalizeHotelCity(Array.isArray(cityParam) ? cityParam[0] : cityParam) ??
    undefined;
  const flightDateValue = Array.isArray(flightDate)
    ? flightDate[0]
    : flightDate;
  const flightRange = resolveFlightDate(flightDateValue) ?? undefined;
  const maxDistance =
    normalizeMaxDistance(Array.isArray(distance) ? distance[0] : distance) ??
    undefined;

  const [hotels, apartments, restaurants, flights] = await Promise.all([
    getActiveHotels(city, maxDistance),
    getActiveApartments(city, maxDistance),
    getActiveRestaurants(city, maxDistance),
    getActiveFlights(flightRange),
  ]);

  return (
    <main className="min-h-screen bg-[#f8fbfb] pt-24 text-[#17211f]">
      <LandingHeader />
      <CityFilter value={city} />
      <DistanceFilter value={maxDistance} />
      <HotelsSection hotels={hotels} />
      <HotelsSection
        hotels={apartments}
        tone="soft"
        title="Apartments"
        body=""
        empty="Apartment options are coming soon."
      />
      <RestaurantsSection restaurants={restaurants} />
      <FlightDateFilter value={flightRange ? flightDateValue : undefined} />
      <FlightsSection flights={flights} />
    </main>
  );
}
