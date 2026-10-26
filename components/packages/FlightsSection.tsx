import type { Flight } from "@/lib/flights";

import { FlightCard } from "./FlightCard";
import { HotelCarousel } from "./HotelCarosal";

export function FlightsSection({ flights }: { flights: Flight[] }) {
  return (
    <section className="bg-[#f8fbfb] px-5 py-14 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-[#202020] sm:text-5xl">
          Flights for Your Journey
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#40505a]">
          Browse active flight options with schedules, seats, fares, and direct
          booking links.
        </p>

        {flights.length > 0 ? (
          <div className="mt-10">
            <HotelCarousel>
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </HotelCarousel>
          </div>
        ) : (
          <p className="mt-8 text-base leading-7 text-[#40505a]">
            Flight options are coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
