import type { Metadata } from "next";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { FlightsSection } from "@/components/packages/FlightsSection";
import { HotelsSection } from "@/components/packages/HotelsSection";
import { RestaurantsSection } from "@/components/packages/RestaurantsSection";
import { getActiveFlights } from "@/lib/flights";
import { getActiveApartments } from "@/lib/apartments";
import { DistanceFilter } from "@/components/packages/DistanceFilter";
import { normalizeMaxDistance } from "@/lib/distance";
import { getActiveHotels } from "@/lib/hotels";
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
  const { distance } = await searchParams;
  const maxDistance =
    normalizeMaxDistance(Array.isArray(distance) ? distance[0] : distance) ??
    undefined;

  const [hotels, apartments, restaurants, flights] = await Promise.all([
    getActiveHotels(undefined, maxDistance),
    getActiveApartments(undefined, maxDistance),
    getActiveRestaurants(undefined, maxDistance),
    getActiveFlights(),
  ]);

  return (
    <main className="min-h-screen bg-[#f8fbfb] pt-24 text-[#17211f]">
      <LandingHeader />
      <DistanceFilter value={maxDistance} />
      <HotelsSection hotels={hotels} />
      <HotelsSection
        hotels={apartments}
        tone="soft"
        eyebrow="Apartment Stays"
        title="Apartments Close to the Holy Mosques"
        body="Spacious apartments in Makkah and Madinah, ideal for families and longer stays."
        empty="Apartment options are coming soon."
      />
      <RestaurantsSection restaurants={restaurants} />
      <FlightsSection flights={flights} />
    </main>
  );
}
